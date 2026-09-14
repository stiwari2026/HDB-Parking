/**
 * Vercel Serverless Function: api/hdb_parking.js
 * Fetches real-time HDB carpark availability from data.gov.sg.
 * Returns only the filtered fields required by the front-end.
 */

export default async function handler(req, res) {
  const send = (statusCode, data) => {
    res.setHeader('Content-Type', 'application/json');
    if (typeof res.status === 'function') {
      return res.status(statusCode).json(data);
    }
    res.statusCode = statusCode;
    res.end(JSON.stringify(data));
  };

  // 1. BEFORE the fetch: read the credential, but do not block on it.
  // data.gov.sg serves this endpoint without a key; the key only raises the
  // rate limit. A variable that was never set arrives as undefined or the
  // string "undefined", so treat those as absent rather than sending them.
  const apiKey = process.env.HDB_Parking;
  const hasKey =
    typeof apiKey === 'string' &&
    apiKey.trim() !== '' &&
    apiKey.trim() !== 'undefined';

  // 2. Fetch live data from data.gov.sg upstream API
  const headers = { Accept: 'application/json' };
  if (hasKey) {
    headers['x-api-key'] = apiKey.trim();
  }

  let upstreamResponse;
  try {
    upstreamResponse = await fetch(
      'https://api.data.gov.sg/v1/transport/carpark-availability',
      {
        method: 'GET',
        headers,
        signal:
          typeof AbortSignal.timeout === 'function'
            ? AbortSignal.timeout(8000)
            : undefined
      }
    );
  } catch (networkError) {
    return send(502, {
      error: 'Upstream unreachable',
      reason: 'Could not connect to the upstream carpark availability service.'
    });
  }

  // 3. AFTER the fetch: inspect response.ok before attempting to read body.
  // The body is deliberately NOT echoed back. Some gateways repeat the
  // rejected key in their error text, which would put the credential in a
  // client response. Map the status to our own wording instead.
  if (!upstreamResponse.ok) {
    const status = upstreamResponse.status;
    let reason;

    if (status === 401 || status === 403) {
      reason = `Upstream rejected the request (${status}). The configured key is not being accepted.`;
    } else if (status === 429) {
      reason = 'Upstream rate limit reached (429). Too many requests in the last minute.';
    } else if (status >= 500) {
      reason = `Upstream is failing on its own side (${status}).`;
    } else {
      reason = `Upstream refused the request with HTTP ${status}.`;
    }

    return send(status, {
      error: 'Upstream refused',
      upstreamStatus: status,
      keyConfigured: hasKey,
      reason
    });
  }

  // 4. Parse payload and filter only needed fields
  let rawData;
  try {
    rawData = await upstreamResponse.json();
  } catch {
    return send(502, {
      error: 'Upstream error',
      reason: 'Upstream answered with non-JSON response payload.'
    });
  }

  const items = Array.isArray(rawData?.items) ? rawData.items : [];
  const primaryItem = items[0] || {};
  const rawCarparks = Array.isArray(primaryItem.carpark_data)
    ? primaryItem.carpark_data
    : [];

  // Filter and extract only necessary fields for the screen
  const carparks = rawCarparks.map((item) => {
    const infoList = Array.isArray(item.carpark_info) ? item.carpark_info : [];
    return {
      carpark_number: item.carpark_number,
      update_datetime: item.update_datetime,
      lots: infoList.map((info) => ({
        lot_type: info.lot_type, // 'C' = Car, 'H' = Heavy Vehicle, 'Y' = Motorcycle
        total_lots: parseInt(info.total_lots, 10) || 0,
        lots_available: parseInt(info.lots_available, 10) || 0
      }))
    };
  });

  // 5. Set Cache-Control header matching source update frequency
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');

  return send(200, {
    timestamp: primaryItem.timestamp || new Date().toISOString(),
    total_records: carparks.length,
    carparks
  });
}
