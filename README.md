# SafeFront

A front‑end web security toolkit built with **Vite + React**. Run quick checks on password strength, inspect URLs for red flags, and audit a site's security headers. Includes input sanitization demo.

🌐 **Live Demo:** _Deploy to Vercel and paste your URL here_

## 🚀 Features
- **Password Strength Meter** — length/variety scoring with tips
- **URL Inspector** — flags punycode, IP URLs, too many subdomains, suspicious TLDs, no HTTPS
- **Security Headers Audit** — serverless/Express endpoint checks common headers (HSTS, CSP, XFO, X‑CTO, Referrer‑Policy, Permissions‑Policy)
- **Sanitizer Demo** — shows how **DOMPurify** guards against XSS
- **Responsive, accessible UI**

## 🛠 Tech Stack
- **Frontend**: React, Vite, CSS
- **Security**: DOMPurify, custom heuristics
- **APIs**: Vercel Serverless (production) + Express dev API (local)

## 📂 Project Structure
```
safefront/
├── api/                # Vercel serverless functions
│   └── headers.js
├── server/             # Local dev API (Express)
│   └── index.js
├── src/
│   ├── components/     # PasswordChecker, UrlInspector, HeadersAudit, SanitizerDemo
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 Local Setup
```bash
npm install
# start local API (separate terminal)
npm run dev:api
# start Vite dev server (http://localhost:5173)
npm run dev
```
The Vite dev server proxies **/api** to the local Express API on **5174**.

## 🌐 Deploy (Vercel)
1. Push to GitHub
2. Import the repo in Vercel
3. Framework: **Vite** (auto) • Build: `npm run build` • Output: `dist`
4. The serverless endpoint `/api/headers` is deployed automatically.

## 🔒 Notes
- The headers endpoint blocks localhost and private IPs to reduce SSRF risk.
- Some sites block HEAD/GET requests from serverless providers; test your own domain for best results.

## 🏷 Topics
`react` `vite` `javascript` `security` `headers` `xss` `dompurify` `vercel`
