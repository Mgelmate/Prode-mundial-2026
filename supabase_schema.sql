-- ─────────────────────────────────────────────────────────────────────────────
-- PRODE MUNDIAL 2026 — Script SQL para Supabase
-- Ejecutalo en: Supabase Dashboard → SQL Editor → New Query
-- ─────────────────────────────────────────────────────────────────────────────

-- Tabla de picks de los usuarios
CREATE TABLE IF NOT EXISTS picks (
  id           BIGSERIAL PRIMARY KEY,
  usuario      TEXT NOT NULL,
  partido_id   TEXT NOT NULL,
  resultado    TEXT NOT NULL CHECK (resultado IN ('local', 'visitante', 'empate')),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (usuario, partido_id)
);

-- Tabla de resultados oficiales (la cargás vos a medida que se juegan)
CREATE TABLE IF NOT EXISTS resultados (
  id           BIGSERIAL PRIMARY KEY,
  partido_id   TEXT NOT NULL UNIQUE,
  resultado    TEXT NOT NULL CHECK (resultado IN ('local', 'visitante', 'empate')),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_picks_usuario ON picks(usuario);
CREATE INDEX IF NOT EXISTS idx_picks_partido ON picks(partido_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- PERMISOS (Row Level Security)
-- Permite leer y escribir a usuarios anónimos (el prode no usa auth)
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE resultados ENABLE ROW LEVEL SECURITY;

-- Picks: cualquiera puede leer y escribir
CREATE POLICY "picks_select" ON picks FOR SELECT USING (true);
CREATE POLICY "picks_insert" ON picks FOR INSERT WITH CHECK (true);
CREATE POLICY "picks_update" ON picks FOR UPDATE USING (true) WITH CHECK (true);

-- Resultados: cualquiera puede leer, solo el service_role puede escribir
CREATE POLICY "resultados_select" ON resultados FOR SELECT USING (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- EJEMPLO: Cómo cargar un resultado oficial (para vos como admin)
-- ─────────────────────────────────────────────────────────────────────────────
-- INSERT INTO resultados (partido_id, resultado)
-- VALUES ('A00', 'local')           -- México ganó como local
-- ON CONFLICT (partido_id) DO UPDATE SET resultado = EXCLUDED.resultado;
