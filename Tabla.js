import React, { useState, useEffect } from 'react'
import { supabase, TODOS_LOS_PARTIDOS } from '../lib/supabase'

export default function Tabla() {
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)
  const [resultados, setResultados] = useState({})
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    setError(null)
    try {
      // Cargar todos los picks
      const { data: picks, error: errorPicks } = await supabase
        .from('picks')
        .select('usuario, partido_id, resultado')

      if (errorPicks) throw errorPicks

      // Cargar resultados oficiales
      const { data: resOficiales, error: errorRes } = await supabase
        .from('resultados')
        .select('partido_id, resultado')

      if (errorRes) throw errorRes

      // Mapear resultados oficiales
      const mapResultados = {}
      resOficiales.forEach((r) => { mapResultados[r.partido_id] = r.resultado })
      setResultados(mapResultados)

      // Agrupar picks por usuario
      const porUsuario = {}
      picks.forEach(({ usuario, partido_id, resultado }) => {
        if (!porUsuario[usuario]) porUsuario[usuario] = {}
        porUsuario[usuario][partido_id] = resultado
      })

      // Calcular aciertos
      const rankingCalculado = Object.entries(porUsuario).map(([usuario, userPicks]) => {
        const totalPicks = Object.keys(userPicks).length
        const aciertos = Object.entries(userPicks).filter(
          ([pid, res]) => mapResultados[pid] && mapResultados[pid] === res
        ).length
        const partidosConResultado = Object.keys(mapResultados).length
        const pct = partidosConResultado > 0
          ? Math.round((aciertos / Math.min(totalPicks, partidosConResultado)) * 100)
          : 0
        return { usuario, aciertos, totalPicks, pct }
      })

      rankingCalculado.sort((a, b) => b.aciertos - a.aciertos || b.pct - a.pct)
      setRanking(rankingCalculado)
      setLastUpdate(new Date())
    } catch (err) {
      setError('No se pudo cargar la tabla. Verificá la conexión.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const partidosConResultado = Object.keys(resultados).length

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-ball">⚽</div>
        <p>Cargando tabla...</p>
      </div>
    )
  }

  return (
    <div className="tabla-container">
      <div className="tabla-header">
        <div>
          <h2 className="tabla-titulo">Tabla de posiciones</h2>
          <p className="tabla-sub">
            {partidosConResultado} partido{partidosConResultado !== 1 ? 's' : ''} con resultado oficial cargado
          </p>
        </div>
        <button className="refresh-btn" onClick={cargarDatos} title="Actualizar">
          ↻ Actualizar
        </button>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {ranking.length === 0 ? (
        <div className="tabla-vacia">
          <p>🏟️ Todavía no hay picks cargados.</p>
          <p>Sé el primero en completar tu prode.</p>
        </div>
      ) : (
        <div className="tabla-lista">
          {ranking.map((jugador, idx) => (
            <div
              key={jugador.usuario}
              className={`tabla-row ${idx === 0 ? 'tabla-row--primero' : ''} ${idx === 1 ? 'tabla-row--segundo' : ''} ${idx === 2 ? 'tabla-row--tercero' : ''}`}
            >
              <div className="tabla-pos">
                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`}
              </div>
              <div className="tabla-info">
                <span className="tabla-nombre">{jugador.usuario}</span>
                <span className="tabla-picks">{jugador.totalPicks} picks cargados</span>
              </div>
              <div className="tabla-stats">
                <span className="tabla-aciertos">{jugador.aciertos}</span>
                <span className="tabla-aciertos-label">aciertos</span>
              </div>
              {partidosConResultado > 0 && (
                <div className="tabla-pct">
                  <div className="pct-bar">
                    <div className="pct-fill" style={{ width: `${jugador.pct}%` }} />
                  </div>
                  <span className="pct-num">{jugador.pct}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {lastUpdate && (
        <p className="tabla-update">
          Actualizado: {lastUpdate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
    </div>
  )
}
