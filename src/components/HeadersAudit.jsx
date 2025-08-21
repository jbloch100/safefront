import React from 'react'

const IMPORTANT = [
  'strict-transport-security',
  'content-security-policy',
  'x-frame-options',
  'x-content-type-options',
  'referrer-policy',
  'permissions-policy'
]

function scoreHeaders(headers){
  let score = 0
  const present = {}
  IMPORTANT.forEach(h=>{
    const v = headers[h] || headers[h.toLowerCase()]
    present[h] = typeof v === 'string' && v.length>0
    if (present[h]) score += 100/IMPORTANT.length
  })
  return { score: Math.round(score), present }
}

export default function HeadersAudit(){
  const [target, setTarget] = React.useState('https://example.com')
  const [result, setResult] = React.useState(null)
  const [err, setErr] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  async function runAudit(e){
    e.preventDefault()
    setLoading(true); setErr(''); setResult(null)
    try{
      const res = await fetch(`/api/headers?url=${encodeURIComponent(target)}`, { headers: {'Accept':'application/json'} })
      const data = await res.json()
      if(!res.ok){ throw new Error(data?.error || 'Audit failed') }
      setResult(data)
    }catch(e){
      setErr(e.message)
    }finally{
      setLoading(false)
    }
  }

  const score = result ? scoreHeaders(result.headers || {}) : {score:0, present:{}}

  return (
    <div>
      <form onSubmit={runAudit} className="row" style={{gap:8}}>
        <input className="input" placeholder="https://yoursite.com" value={target} onChange={e=>setTarget(e.target.value)} />
        <button className="btn inline" disabled={loading}>{loading?'Auditing…':'Audit'}</button>
      </form>
      {err && <p style={{color:'var(--danger)'}}>{err}</p>}
      {result && (
        <div style={{marginTop:12}}>
          <p className="muted">Status: {result.status} • Final URL: {result.finalUrl}</p>
          <div className="row" style={{justifyContent:'space-between', marginTop:8}}>
            <strong>Score: {score.score}/100</strong>
            <small className="muted">({Object.values(score.present).filter(Boolean).length}/{IMPORTANT.length} key headers)</small>
          </div>
          <ul style={{paddingLeft:16, marginTop:8}}>
            {IMPORTANT.map((h)=>(
              <li key={h}>
                {score.present[h] ? '✅' : '❌'} <code>{h}</code>
              </li>
            ))}
          </ul>
        </div>
      )}
      <small className="muted">Note: Some sites block header checks; try your own domain for best results.</small>
    </div>
  )
}
