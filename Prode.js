import React, { useState, useEffect, useCallback } from 'react'
import { supabase, PARTIDOS_GRUPOS, PARTIDOS_ELIMINACION } from '../lib/supabase'

const FASES_GRUPOS = ['Grupos']
const FASES_ELIM = ['Octavos', 'Cuartos', 'Semis', 'Tercer Puesto', 'Final']

export default function Prode({ usuario }) {
  const [picks, setPicks] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [faseActiva, setFaseActiva] = useState('Grupos')
  const [grupoActivo, setGrupoActivo] = useState('Grupo A')
  const [error, setError] = useState(null)

  // Cargar picks existentes del usuario
  useEffect(() => {
    const cargarPicks = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('picks')
          .select('partido_id, resultado')
          .eq('usuario', usuario)

        if (error) throw error

        const mapa = {}
        data.forEach((row) => { mapa[row.partido_id] = row.resultado })
        setPicks(mapa)
      } catch (err) {
        setError('No se pudieron cargar tus picks. Verificá la conexión.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    cargarPicks()
  }, [usuario])

  const handlePick = useCallback((partidoId, resultado) => {
    setPicks((prev) => ({ ...prev, [partidoId]: resultado }))
    setSaved(false)
  }, [])

  const handleGuardar = async () => {
    setSaving(true)
    setError(null)
    try {
      const rows = Object.entries(picks).map(([partido_id, resultado]) => ({
        usuario,
        partido_id,
        resultado,
        updated_at: new Date().toISOString(),
      }))

      const { error } = await supabase
        .from('picks')
        .upsert(rows, { onConflict: 'usuario,partido_id' })

      if (error) throw error
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError('Error al guardar. Intentá de nuevo.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  // Grupos disponibles
  const gruposUnicos = [...new Set(PARTIDOS_GRUPOS.map((p) => p.grupo))].sort()

  // Partidos a mostrar según fase activa
  const partidosMostrar =
    faseActiva === 'Grupos'
      ? PARTIDOS_GRUPOS.filter((p) => p.grupo === grupoActivo)
      : PARTIDOS_ELIMINACION.filter((p) => p.fase === faseActiva)

  // Contador de picks
  const totalPartidos = PARTIDOS_GRUPOS.length + PARTIDOS_ELIMINACION.length
  const picksCompletados = Object.keys(picks).length

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-ball">⚽</div>
        <p>Cargando tus picks...</p>
      </div>
    )
  }

  return (
    <div className="prode-container">
      {/* Progreso */}
      <div className="progreso-card">
        <div className="progreso-info">
          <span className="progreso-label">Tus picks</span>
          <span className="progreso-num">{picksCompletados} / {totalPartidos}</span>
        </div>
        <div className="progreso-bar">
          <div
            className="progreso-fill"
            style={{ width: `${(picksCompletados / totalPartidos) * 100}%` }}
          />
        </div>
      </div>

      {/* Tabs de fase */}
      <div className="fase-tabs">
        {['Grupos', ...FASES_ELIM].map((fase) => (
          <button
            key={fase}
            className={`fase-tab ${faseActiva === fase ? 'active' : ''}`}
            onClick={() => setFaseActiva(fase)}
          >
            {fase}
          </button>
        ))}
      </div>

      {/* Selector de grupo (solo en fase de grupos) */}
      {faseActiva === 'Grupos' && (
        <div className="grupo-tabs">
          {gruposUnicos.map((g) => {
            const letra = g.replace('Grupo ', '')
            return (
              <button
                key={g}
                className={`grupo-tab ${grupoActivo === g ? 'active' : ''}`}
                onClick={() => setGrupoActivo(g)}
              >
                {letra}
              </button>
            )
          })}
        </div>
      )}

      {/* Lista de partidos */}
      <div className="partidos-lista">
        {partidosMostrar.map((partido) => (
          <PartidoCard
            key={partido.id}
            partido={partido}
            pick={picks[partido.id]}
            onPick={handlePick}
          />
        ))}
      </div>

      {/* Botón guardar */}
      <div className="guardar-wrapper">
        {error && <p className="error-msg">{error}</p>}
        <button
          className={`guardar-btn ${saved ? 'guardado' : ''}`}
          onClick={handleGuardar}
          disabled={saving || picksCompletados === 0}
        >
          {saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar picks'}
        </button>
      </div>
    </div>
  )
}

function PartidoCard({ partido, pick, onPick }) {
  const esGrupo = partido.fase === 'Grupos'
  const opciones = esGrupo
    ? [
        { valor: 'local', label: partido.local },
        { valor: 'empate', label: 'Empate' },
        { valor: 'visitante', label: partido.visitante },
      ]
    : [
        { valor: 'local', label: partido.local },
        { valor: 'visitante', label: partido.visitante },
      ]

  return (
    <div className={`partido-card ${pick ? 'partido-card--picked' : ''}`}>
      {partido.grupo && <span className="partido-grupo-badge">{partido.grupo}</span>}
      {!partido.grupo && <span className="partido-grupo-badge fase-badge">{partido.fase}</span>}
      <div className="partido-equipos">
        <span className="partido-equipo local">{partido.local}</span>
        <span className="partido-vs">VS</span>
        <span className="partido-equipo visitante">{partido.visitante}</span>
      </div>
      <div className="partido-opciones">
        {opciones.map((op) => (
          <button
            key={op.valor}
            className={`opcion-btn ${pick === op.valor ? 'opcion-btn--selected' : ''}`}
            onClick={() => onPick(partido.id, op.valor)}
          >
            {op.label}
          </button>
        ))}
      </div>
    </div>
  )
}
