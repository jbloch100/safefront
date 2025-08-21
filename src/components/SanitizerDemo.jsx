import React from 'react'
import DOMPurify from 'dompurify'

export default function SanitizerDemo(){
  const [input, setInput] = React.useState('<b>Try typing HTML</b> <img src=x onerror=alert(1) />')
  const clean = DOMPurify.sanitize(input, { USE_PROFILES: { html: true } })

  return (
    <div>
      <textarea className="input" rows={5} value={input} onChange={e=>setInput(e.target.value)} />
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12, marginTop:12}}>
        <div className="card">
          <h4>Raw</h4>
          <div style={{whiteSpace:'pre-wrap', wordBreak:'break-word'}}>{input}</div>
        </div>
        <div className="card">
          <h4>Sanitized</h4>
          <div dangerouslySetInnerHTML={{__html: clean}} />
        </div>
      </div>
    </div>
  )
}
