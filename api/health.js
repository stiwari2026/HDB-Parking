/**
 * Vercel Serverless Function: api/health.js
 * Reports credential status and upstream service reachability.
 * Note: Credential is NEVER output or partially exposed.
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

  const apiKey = process.env.HDB_Parking;
  const keyConfigured = Boolean(
    apiKey && apiKey.trim() !== '' && apiKey !== 'undefined'
  );

  let upstreamAnswered = false;
  let upstreamStatus = null;
  let upstreamStatusText = null;

  try {
    const headers = {
      Accept: 'application/json'
    };
    if (keyConfigured) {
      headers['x-api-key'] = apiKey;
      headers['AccountKey'] = apiKey;
    }

    const upstreamResponse = await fetch(
      'https://api.data.gov.sg/v1/transport/carpark-availability',
      {
        method: 'GET',
        headers,
        signal: typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(6000) : undefined
      }
    );

    upstreamAnswered = true;
    upstreamStatus = upstreamResponse.status;
    upstreamStatusText = upstreamResponse.statusText;
  } catch {
    upstreamAnswered = false;
    upstreamStatus = null;
    upstreamStatusText = null;
  }

  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  return send(200, {
    keyConfigured,
    upstreamAnswered,
    upstreamStatus,
    upstreamStatusText,
    timestamp: new Date().toISOString()
  });
}
