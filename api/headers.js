// api/headers.js (Vercel serverless, ESM)
export default async function handler(req, res) {
	try {
		// Support both req.query and parsing from req.url (works on Vercel)
		const urlParam =
		(req.query && req.query.url) ||
		new URL(req.url, 'http://localhost').searchParams.get('url') ||
		'';

		const target = urlParam.trim();
		if (!target) {
			return res.status(400).json({ ok: false, error: 'Missing ?url param' });
		}

		let targetUrl;
		try {
			targetUrl = new URL(target);
		} catch {
			return res.status(400).json({ ok: false, error: 'Invalid URL' });
		}

		if (!/^https?:$/.test(targetUrl.protocol)) {
			return res.status(400).json({ ok: false, error: 'Only http/https URLs are allowed' });
		}

		// Try HEAD first, then GET (some sites block HEAD)
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 8000);

		let resp = await fetch(targetUrl, {
			method: 'HEAD',
			redirect: 'follow',
			cache: 'no-store',
			signal: controller.signal
		}).catch(() => null);

		if (!resp || !resp.ok) {
			resp = await fetch(targetUrl, {
				method: 'GET',
				redirect: 'follow',
				cache: 'no-store',
				signal: controller.signal
			});
		}
		clearTimeout(timeout);

		const raw = {};
		// resp.headers is an iterable Headers; normalize keys to lowercase
		for (const [k, v] of resp.headers) raw[k.toLowerCase()] = v;

		const get = (h) => raw[h] || '';
		const audit = {
			hsts: !!get('strict-transport-security'),
			csp: !!get('content-security-policy'),
			xFrameOptions: !!get('x-frame-options'),
			xContentTypeOptions: get('x-content-type-options').toLowerCase() === 'nosniff',
			referrerPolicy: !!get('referrer-policy'),
			permissionsPolicy: !!get('permissions-policy') || !!get('feature-policy'),
			httpsRedirectLikely: targetUrl.protocol === 'https:' || !!get('strict-transport-security')
		};

		return res.status(200).json({
			ok: true,
			url: targetUrl.toString(),
			status: resp.status,
			headers: raw,
			audit
		});
	} catch (err) {
		return res.status(500).json({ ok: false, error: String(err?.message || err) });
	}
}