import React from 'react'

function scorePassword(pw){
  let score = 0
  if (!pw) return {score, label:'Too short'}
  const unique = new Set(pw).size
  score += Math.min(40, unique * 2)
  if (/[a-z]/.test(pw)) score += 10
  if (/[A-Z]/.test(pw)) score += 10
  if (/[0-9]/.test(pw)) score += 10
  if (/[^A-Za-z0-9]/.test(pw)) score += 15
  if (pw.length >= 12) score += 15
  const label = score >= 80 ? 'Strong' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Weak'
  return {score: Math.min(score, 100), label}
}

export default function PasswordChecker(){
  const [pw, setPw] = React.useState('')
  const {score, label} = scorePassword(pw)
  return (
    <div>
      <input className="input" type="password" placeholder="Enter a password…" value={pw} onChange={e=>setPw(e.target.value)} />
      <div style={{marginTop:8}}>
        <div style={{height:10,background:'#0e1217',border:'1px solid var(--border)',borderRadius:999,overflow:'hidden'}}>
          <div style={{width:`${score}%`,height:'100%',background: score>79?'#4fd18b':score>59?'#b7e07d':score>39?'#e5c16a':'#ff6b6b'}} />
        </div>
        <div className="row" style={{marginTop:8, justifyContent:'space-between'}}>
          <small className="muted">Score: {score}</small>
          <small className="badge">{label}</small>
        </div>
        <ul style={{marginTop:8, paddingLeft:16}}>
          <li>Use 12+ characters</li>
          <li>Mix upper/lowercase, numbers, symbols</li>
          <li>Avoid common words and patterns</li>
        </ul>
      </div>
    </div>
  )
}
