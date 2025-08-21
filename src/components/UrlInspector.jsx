import React from 'react'

function analyzeUrl(input){
  let issues = []
  let parsed = null
  try {
    parsed = new URL(input)
  } catch {
    return { ok:false, issues:['Invalid URL'], parsed:null }
  }
  const host = parsed.hostname

  // IP address
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(host)) {
    issues.push('Uses raw IP address (phishing risk)')
  }
  // excessive subdomains
  if (host.split('.').length > 4) {
    issues.push('Too many subdomains')
  }
  // punycode
  if (host.startsWith('xn--')) {
    issues.push('Punycode domain (visually deceptive)')
  }
  // suspicious TLDs (very rough)
  const badTlds = ['zip','mov','xyz','country','men']
  const tld = host.split('.').pop()
  if (badTlds.includes(tld)) {
    issues.push(`Suspicious TLD: .${tld}`)
  }
  // http vs https
  if (parsed.protocol !== 'https:') {
    issues.push('Not using HTTPS')
  }

  return { ok: issues.length===0, issues, parsed}
}

export default function UrlInspector(){
  const [url, setUrl] = React.useState('https://example.com')
  const [report, setReport] = React.useState(null)

  function onCheck(e){
    e.preventDefault()
    setReport(analyzeUrl(url.trim()))
  }

  return (
    <form onSubmit={onCheck}>
      <div className="row" style={{gap:8}}>
        <input className="input" placeholder="https://example.com" value={url} onChange={e=>setUrl(e.target.value)} />
        <button className="btn inline" type="submit">Inspect</button>
      </div>
      {report && (
        <div style={{marginTop:12}}>
          {report.ok ? <p className="badge">Looks safe ✅</p> : <p className="badge">Potential risks ⚠️</p>}
          <ul style={{paddingLeft:16}}>
            {report.issues.length ? report.issues.map((i,idx)=>(<li key={idx}>{i}</li>)) : <li>No obvious issues found.</li>}
          </ul>
          {report.parsed && <small className="muted">Host: {report.parsed.hostname}</small>}
        </div>
      )}
    </form>
  )
}
