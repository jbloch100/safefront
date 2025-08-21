import React from 'react'
import PasswordChecker from './components/PasswordChecker.jsx'
import UrlInspector from './components/UrlInspector.jsx'
import HeadersAudit from './components/HeadersAudit.jsx'
import SanitizerDemo from './components/SanitizerDemo.jsx'

export default function App(){
  return (
    <div className="container">
      <header className="section">
        <h1>SafeFront</h1>
        <p className="muted">A front‑end web security toolkit — password strength, URL inspection, and security headers audit.</p>
      </header>

      <main className="grid cols-2">
        <div className="card">
          <h3>Password Strength</h3>
          <PasswordChecker />
        </div>

        <div className="card">
          <h3>URL Inspector</h3>
          <UrlInspector />
        </div>

        <div className="card">
          <h3>Security Headers Audit</h3>
          <HeadersAudit />
        </div>

        <div className="card">
          <h3>Sanitizer Demo</h3>
          <SanitizerDemo />
        </div>
      </main>

      <footer className="footer">
        <small className="muted">© {new Date().getFullYear()} SafeFront • Built with React + Vite • No tracking</small>
      </footer>
    </div>
  )
}
