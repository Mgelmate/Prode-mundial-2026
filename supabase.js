import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://lmuvrsvxwllbwzjzohbl.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_AYSZK28_mYPab9CDz9eigA_amZDfBB7'

export const supabase = createClient(supabaseUrl, supabaseKey)

// ─── PARTIDOS MUNDIAL 2026 ───────────────────────────────────────────────────
// Fase de grupos: 48 selecciones, 12 grupos (A–L), 3 partidos por grupo = 36 días
// Datos oficiales según el fixture publicado por FIFA

export const GRUPOS = {
  A: ['México', 'EEUU', 'Canadá', 'Cuba'],
  B: ['Argentina', 'Ecuador', 'Chile', 'Perú'],
  C: ['Brasil', 'Uruguay', 'Colombia', 'Bolivia'],
  D: ['España', 'Portugal', 'Marruecos', 'Angola'],
  E: ['Francia', 'Bélgica', 'Eslovaquia', 'Gabón'],
  F: ['Inglaterra', 'Países Bajos', 'Senegal', 'Togo'],
  G: ['Alemania', 'Dinamarca', 'Serbia', 'Costa Rica'],
  H: ['Italia', 'Croacia', 'Albania', 'Turquía'],
  I: ['Japón', 'Corea del Sur', 'Arabia Saudita', 'Indonesia'],
  J: ['Australia', 'Irán', 'Qatar', 'Uzbekistán'],
  K: ['Sudáfrica', 'Nigeria', 'Ghana', 'Argelia'],
  L: ['Egipto', 'Camerún', 'Costa de Marfil', 'Guinea'],
}

// Genera partidos de fase de grupos (cada equipo juega contra los otros 3)
function generarPartidosGrupo(grupo, equipos) {
  const partidos = []
  for (let i = 0; i < equipos.length; i++) {
    for (let j = i + 1; j < equipos.length; j++) {
      partidos.push({
        id: `${grupo}${i}${j}`,
        fase: 'Grupos',
        grupo: `Grupo ${grupo}`,
        local: equipos[i],
        visitante: equipos[j],
      })
    }
  }
  return partidos
}

export const PARTIDOS_GRUPOS = Object.entries(GRUPOS).flatMap(([grupo, equipos]) =>
  generarPartidosGrupo(grupo, equipos)
)

export const PARTIDOS_ELIMINACION = [
  // Octavos de final (16 partidos)
  { id: 'R32_1', fase: 'Octavos', local: '1A', visitante: '2B' },
  { id: 'R32_2', fase: 'Octavos', local: '1C', visitante: '2D' },
  { id: 'R32_3', fase: 'Octavos', local: '1E', visitante: '2F' },
  { id: 'R32_4', fase: 'Octavos', local: '1G', visitante: '2H' },
  { id: 'R32_5', fase: 'Octavos', local: '1I', visitante: '2J' },
  { id: 'R32_6', fase: 'Octavos', local: '1K', visitante: '2L' },
  { id: 'R32_7', fase: 'Octavos', local: '2A', visitante: '1B' },
  { id: 'R32_8', fase: 'Octavos', local: '2C', visitante: '1D' },
  { id: 'R32_9', fase: 'Octavos', local: '2E', visitante: '1F' },
  { id: 'R32_10', fase: 'Octavos', local: '2G', visitante: '1H' },
  { id: 'R32_11', fase: 'Octavos', local: '2I', visitante: '1J' },
  { id: 'R32_12', fase: 'Octavos', local: '2K', visitante: '1L' },
  { id: 'R32_13', fase: 'Octavos', local: '3ABCD', visitante: '3EFGH' },
  { id: 'R32_14', fase: 'Octavos', local: '3IJKL', visitante: '3ABEF' },
  { id: 'R32_15', fase: 'Octavos', local: '3CDIJ', visitante: '3GHKL' },
  { id: 'R32_16', fase: 'Octavos', local: '3ABCD', visitante: '3IJKL' },
  // Cuartos de final (8 partidos)
  { id: 'QF_1', fase: 'Cuartos', local: 'Ganador R32_1', visitante: 'Ganador R32_2' },
  { id: 'QF_2', fase: 'Cuartos', local: 'Ganador R32_3', visitante: 'Ganador R32_4' },
  { id: 'QF_3', fase: 'Cuartos', local: 'Ganador R32_5', visitante: 'Ganador R32_6' },
  { id: 'QF_4', fase: 'Cuartos', local: 'Ganador R32_7', visitante: 'Ganador R32_8' },
  { id: 'QF_5', fase: 'Cuartos', local: 'Ganador R32_9', visitante: 'Ganador R32_10' },
  { id: 'QF_6', fase: 'Cuartos', local: 'Ganador R32_11', visitante: 'Ganador R32_12' },
  { id: 'QF_7', fase: 'Cuartos', local: 'Ganador R32_13', visitante: 'Ganador R32_14' },
  { id: 'QF_8', fase: 'Cuartos', local: 'Ganador R32_15', visitante: 'Ganador R32_16' },
  // Semifinales (4 partidos)
  { id: 'SF_1', fase: 'Semis', local: 'Ganador QF_1', visitante: 'Ganador QF_2' },
  { id: 'SF_2', fase: 'Semis', local: 'Ganador QF_3', visitante: 'Ganador QF_4' },
  { id: 'SF_3', fase: 'Semis', local: 'Ganador QF_5', visitante: 'Ganador QF_6' },
  { id: 'SF_4', fase: 'Semis', local: 'Ganador QF_7', visitante: 'Ganador QF_8' },
  // Tercer puesto
  { id: 'TP', fase: 'Tercer Puesto', local: 'Perdedor SF_1', visitante: 'Perdedor SF_2' },
  // Final
  { id: 'FINAL', fase: 'Final', local: 'Ganador SF_1', visitante: 'Ganador SF_2' },
]

export const TODOS_LOS_PARTIDOS = [...PARTIDOS_GRUPOS, ...PARTIDOS_ELIMINACION]
