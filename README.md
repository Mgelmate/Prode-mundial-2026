# ⚽ Prode Mundial 2026 — Easy Moreno

App web para que tu equipo haga sus pronósticos del Mundial 2026 y comparen resultados en una tabla de posiciones en tiempo real.

---

## ¿Qué incluye?

- 🔐 Login por nombre (sin contraseñas)
- ⚽ Todos los partidos: fase de grupos + octavos + cuartos + semis + final
- 💾 Picks guardados en Supabase (no se pierden nunca)
- 🏆 Tabla de posiciones con aciertos en tiempo real
- 📱 Diseño mobile-first, funciona desde el celu

---

## Configuración paso a paso

### Paso 1 — Crear cuenta en Supabase (gratis)

1. Entrá a [supabase.com](https://supabase.com)
2. Hacé clic en **"Start for free"**
3. Registrate con GitHub o email
4. Creá un nuevo proyecto (elegí cualquier nombre, ej: `prode-mundial`)
5. Guardá la contraseña que te pide (no la vas a necesitar para la app, pero por las dudas)
6. Esperá 1-2 minutos a que el proyecto se inicialice

### Paso 2 — Crear las tablas en Supabase

1. En tu proyecto de Supabase, andá a **SQL Editor** (ícono de la izquierda)
2. Hacé clic en **"New query"**
3. Copiá todo el contenido del archivo `supabase_schema.sql`
4. Pegalo en el editor y hacé clic en **"Run"**
5. Deberías ver "Success. No rows returned"

### Paso 3 — Obtener las credenciales

1. En Supabase, andá a **Settings** → **API**
2. Copiá:
   - **Project URL** → algo como `https://abcdefgh.supabase.co`
   - **anon public key** → una cadena larga que empieza con `eyJ...`

### Paso 4 — Configurar las variables de entorno

1. En la carpeta del proyecto, copiá el archivo `.env.example` como `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Abrí `.env.local` y completá con tus credenciales:
   ```
   REACT_APP_SUPABASE_URL=https://tu-proyecto.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJ...tu-anon-key
   ```

### Paso 5 — Instalar y probar localmente

```bash
npm install
npm start
```

La app debería abrirse en `http://localhost:3000`

### Paso 6 — Subir a Vercel (hosting gratis)

1. Subí el proyecto a GitHub:
   ```bash
   git init
   git add .
   git commit -m "Prode Mundial 2026"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/prode-mundial.git
   git push -u origin main
   ```

2. Entrá a [vercel.com](https://vercel.com) y registrate con GitHub

3. Hacé clic en **"New Project"** → seleccioná tu repositorio

4. Antes de deployar, en **Environment Variables** agregá:
   - `REACT_APP_SUPABASE_URL` → tu URL de Supabase
   - `REACT_APP_SUPABASE_ANON_KEY` → tu anon key

5. Hacé clic en **Deploy**

6. En 1-2 minutos tenés una URL pública como `https://prode-mundial.vercel.app`

7. ¡Compartí esa URL por WhatsApp con tus compañeros! 🎉

---

## Cómo cargar resultados oficiales

A medida que se jueguen los partidos, cargás el resultado en Supabase para que la tabla de posiciones se actualice automáticamente.

En **SQL Editor** de Supabase:

```sql
-- Ejemplo: Argentina ganó como local en partido B00
INSERT INTO resultados (partido_id, resultado)
VALUES ('B00', 'local')
ON CONFLICT (partido_id) DO UPDATE SET resultado = EXCLUDED.resultado;
```

Los `partido_id` de los partidos de grupos siguen el formato `{GRUPO}{i}{j}`:
- `A00` = primer partido del Grupo A (México vs EEUU)
- `B00` = primer partido del Grupo B (Argentina vs Ecuador)
- etc.

Para la fase eliminatoria: `R32_1`, `QF_1`, `SF_1`, `FINAL`, etc.

---

## Stack técnico

- **React 18** — interfaz
- **Supabase** — base de datos PostgreSQL en la nube
- **Vercel** — hosting estático con deploy automático desde GitHub
