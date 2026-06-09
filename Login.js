import React, { useState } from 'react'

export default function Login({ onLogin }) {
  const [nombre, setNombre] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    const trimmed = nombre.trim()
    if (trimmed.length < 2) {
      setError('Ingresá tu nombre (mínimo 2 caracteres)')
      return
    }
    if (trimmed.length > 30) {
      setError('Nombre muy largo, máximo 30 caracteres')
      return
    }
    onLogin(trimmed)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="login-screen">
      <div className="login-bg-pattern" aria-hidden />
      <div className="login-card">
        <div className="login-emblem">⚽</div>
        <h1 className="login-title">PRODE MUNDIAL 2026</h1>
        <p className="login-subtitle">Easy Moreno · Elegí tus pronósticos</p>
        <div className="login-form">
          <label className="login-label" htmlFor="nombre">¿Cómo te llamás?</label>
          <input
            id="nombre"
            className="login-input"
            type="text"
            placeholder="Tu nombre o apodo"
            value={nombre}
            onChange={(e) => { setNombre(e.target.value); setError('') }}
            onKeyDown={handleKey}
            maxLength={30}
            autoFocus
          />
          {error && <p className="login-error">{error}</p>}
          <button className="login-btn" onClick={handleSubmit}>
            Entrar al prode →
          </button>
        </div>
        <p className="login-hint">
          Usá siempre el mismo nombre para que tus picks se guarden correctamente
        </p>
      </div>
    </div>
  )
}
