import React, { useState, useEffect } from 'react'
import Login from './components/Login'
import Prode from './components/Prode'
import Tabla from './components/Tabla'
import './App.css'

export default function App() {
  const [usuario, setUsuario] = useState(() => localStorage.getItem('prode_usuario') || null)
  const [vista, setVista] = useState('prode') // 'prode' | 'tabla'

  const handleLogin = (nombre) => {
    localStorage.setItem('prode_usuario', nombre)
    setUsuario(nombre)
  }

  const handleLogout = () => {
    localStorage.removeItem('prode_usuario')
    setUsuario(null)
  }

  if (!usuario) return <Login onLogin={handleLogin} />

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="header-trophy">🏆</span>
            <div>
              <h1 className="header-title">PRODE MUNDIAL</h1>
              <p className="header-sub">USA · CANADA · MEXICO 2026</p>
            </div>
          </div>
          <div className="header-right">
            <nav className="header-nav">
              <button
                className={`nav-btn ${vista === 'prode' ? 'active' : ''}`}
                onClick={() => setVista('prode')}
              >
                Mi Prode
              </button>
              <button
                className={`nav-btn ${vista === 'tabla' ? 'active' : ''}`}
                onClick={() => setVista('tabla')}
              >
                Tabla
              </button>
            </nav>
            <div className="header-user">
              <span className="user-badge">{usuario.charAt(0).toUpperCase()}</span>
              <span className="user-name">{usuario}</span>
              <button className="logout-btn" onClick={handleLogout} title="Salir">✕</button>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        {vista === 'prode' && <Prode usuario={usuario} />}
        {vista === 'tabla' && <Tabla />}
      </main>
    </div>
  )
}
