import express from 'express';

const app = express();

// Allow local-dev requests (optional; Vite proxy usually handles same-origin)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/api/headers', async (req, res) => {
  try 
  {
    const target = (req.query.url || '').trim();

    if (!target) {
      return res.status(400).json({ ok: false, error: 'Missing ?url param' });
    }

    let url;
    try {
      url = new URL(target);
    } catch {
      return res.status(400).json({ ok: false, error: 'Invalid URL' });
    }

    if (!/^https?:$/.test(url.protocol)) {
      return res.status(400).json({ ok: false, error: 'Only http/https URLs are allowed' });
    }

    // Fetch headers (HEAD first; fall back to GET if server blocks HEAD)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    let resp = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      cache: 'no-store',
      signal: controller.signal,
    }).catch(() => null);

    if (!resp || !resp.ok) {
      resp = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        cache: 'no-store',
        signal: controller.signal,
      });
    }

    clearTimeout(timeout);

    const raw = {};
    for (const [k, v] of resp.headers) raw[k.toLowerCase()] = v;

    // Audit common security headers
    const get = (h) => raw[h] || '';
    const audit = {
      hsts: !!get('strict-transport-security'),
      csp: !!get('content-security-policy'),
      xFrameOptions: !!get('x-frame-options'),
      xContentTypeOptions: get('x-content-type-options').toLowerCase() === 'nosniff',
      referrerPolicy: !!get('referrer-policy'),
      permissionsPolicy: !!get('permissions-policy') || !!get('feature-policy'),
      httpsRedirectLikely: url.protocol === 'https:' || !!get('strict-transport-security'),
    };

    return res.json({
      ok: true,
      url: url.toString(),
      status: resp.status,
      headers: raw,
      audit,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
});

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`SafeFront API running on http://localhost:${PORT}`);
});