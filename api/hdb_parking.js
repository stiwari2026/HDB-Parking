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

  // 1. BEFORE the fetch: verify credential early before making any upstream call.
  // A missing variable sent as "undefined" or empty string is stopped immediately.
  const apiKey = process.env.HDB_Parking;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'undefined') {
    return send(503, {
      error: 'Service Unavailable: HDB_Parking credential is not configured or empty',
      variable: 'HDB_Parking',
      configured: false
    });
  }

  // 2. Fetch live data from data.gov.sg upstream API
  let upstreamResponse;
  try {
    upstreamResponse = await fetch(
      'https://api.data.gov.sg/v1/transport/carpark-availability',
      {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
          'AccountKey': apiKey,
          Accept: 'application/json'
        },
        signal: typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(8000) : undefined
      }
    );
  } catch (networkError) {
    return send(502, {
      error: 'Upstream unreachable',
      reason: 'Could not connect to the upstream carpark availability service.'
    });
  }

  // 3. AFTER the fetch: inspect response.ok before attempting to read body
  if (!upstreamResponse.ok) {
    let reason = `Upstream refused request with HTTP ${upstreamResponse.status}`;
    try {
      const errorText = await upstreamResponse.text();
      if (errorText && errorText.trim().length > 0) {
        reason = `Upstream error ${upstreamResponse.status}: ${errorText.trim().slice(0, 150)}`;
      }
    } catch {
      // Empty refusal body is handled safely without throwing
    }

    return send(upstreamResponse.status, {
      error: 'Upstream refused',
      upstreamStatus: upstreamResponse.status,
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
  const rawCarparks = Array.isArray(primaryItem.carpark_data) ? primaryItem.carpark_data : [];

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
