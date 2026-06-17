# SDD — FilmsCenter (prueba-next14)

> **Software Design Document**
> Proyecto: `prueba-next14` (FilmsCenter)
> Última actualización: 2026-06-17

---

## 1. Resumen

FilmsCenter es una aplicación web de catálogo de películas construida sobre
**Next.js 16 (App Router, Turbopack)**. Consume la API pública de **TMDB (The Movie DB)**
para listar películas (tendencia, populares, mejor valoradas), mostrar el
detalle de cada película con sus créditos y permitir búsqueda por título. El
listado principal implementa **scroll infinito** mediante Server Actions e
`IntersectionObserver`. La vista de detalle **re-tinta toda la app** con una
paleta derivada del póster (degradado + acentos), gestionada por un estado
global de tematización (§8).

| | |
|---|---|
| Tipo | SPA/SSR híbrida (App Router) |
| Renderizado | React Server Components + Client Components puntuales |
| Datos | TMDB REST API v3 |
| Estilos | Tailwind CSS |
| Gestor de paquetes | pnpm |
| Despliegue objetivo | Vercel (plantilla `create-next-app`) |

---

## 2. Stack tecnológico

| Capa | Tecnología | Versión declarada |
|---|---|---|
| Framework | Next.js (App Router, Turbopack) | `16.2.9` |
| UI | React / React DOM | `^19.2` |
| Lenguaje | TypeScript | `^5.2.2` |
| Estilos | Tailwind CSS + autoprefixer + PostCSS | `^3` |
| Estado global | Zustand | `^5.0.14` |
| Extracción de color | Canvas API (cliente, sin dependencias) | — |
| Lint/format | ESLint 9 (flat config) + `eslint-config-next` + Prettier | ver §7 |
| Runtime / gestor | Node ≥ 20.9 · pnpm 11 (fijado con `packageManager`) | — |

---

## 3. Arquitectura

### 3.1 Modelo de renderizado

- **Server Components por defecto.** Las páginas (`page.tsx`) son `async` y
  obtienen los datos directamente en el servidor antes de renderizar.
- **Client Components** sólo donde hay interactividad: `InfiniteMovies`
  (`"use client"`), formularios y menús.
- **Server Actions** (`"use server"`) para la capa de datos: `services/Movies.ts`
  y `actions/getPageMovies.ts`. Esto mantiene la `Authorization` de TMDB en el
  servidor y evita exponer el token al cliente.
- **Capa de tematización en cliente:** un store Zustand (`store/theme.ts`)
  guarda la paleta activa y un componente de sincronización la escribe como CSS
  variables en `:root`. Permite que la app entera se re-tinte por película
  (detalle §8).

### 3.2 Flujo de datos (listado principal)

```
RSC Home (page.tsx)
   │  searchParams.t → categoría (trending | popular | torated)
   ▼
getFilms()  ──►  services/Movies.ts  ──►  fetch TMDB  ──►  ResponseMovies
   │
   ▼
<InfiniteMovies initialMovies=... category=...>   (client)
   │  IntersectionObserver sobre sentinel
   ▼
loadMoreMovies(category, page)  (server action)
   │  dedup por id, hasMore = page < total_pages
   ▼
<ListMovies movies=...>  →  <MovieCard>
```

### 3.3 Rutas

| Ruta | Archivo | Render | Función |
|---|---|---|---|
| `/` | `app/page.tsx` | RSC | Listado por categoría + scroll infinito |
| `/movies/[id]` | `app/movies/[id]/page.tsx` | RSC | Detalle + `generateMetadata` dinámica + créditos |
| `/search/[slug]` | `app/search/[slug]/page.tsx` | RSC | Resultados de búsqueda (slug → query) |

### 3.4 Estructura de carpetas

```
src/
├── app/                 # App Router (layout, page, rutas dinámicas, icon, globals)
├── components/          # UI: ListMovies, MovieCard, InfiniteMovies, NavBar,
│                        #     SearchForm, TagComponents, CardsCredits, etc.
├── icon/                # Iconos SVG como componentes React
├── services/            # Movies.ts (cliente TMDB), palette.ts (extracción de
│                        #   color en cliente), utils.ts
├── store/theme.ts       # Estado global de tematización (Zustand)
├── actions/             # Server actions de paginación (getPageMovies.ts)
├── types/               # movie.type.ts, credits.d.ts
└── constant.ts          # TMDB_URL, auth header, categorías de menú
```

---

## 4. Integración externa (TMDB)

- Base: `https://api.themoviedb.org/3/`
- Autenticación: `Authorization: Bearer ${TMDB_API_KEY}` (definido en
  `src/constant.ts`, leído de `process.env.TMDB_API_KEY`).
- Endpoints usados: `trending/movie/day`, `movie/popular`, `movie/top_rated`,
  `movie/{id}`, `movie/{id}/credits`, `search/movie`.
- Imágenes servidas desde `image.tmdb.org`, autorizado en
  `next.config.js → images.remotePatterns`.

---

## 5. Configuración y entorno

| Variable | Uso |
|---|---|
| `TMDB_API_KEY` | Token Bearer de TMDB (`.env`, **no** versionar) |

`next.config.js` sólo configura los `remotePatterns` de `next/image` para
`image.tmdb.org/t/p/w500/**`.

---

## 6. Decisiones y observaciones de diseño

- **Dedup en scroll infinito:** `InfiniteMovies` filtra por `id` con un `Set`
  para evitar duplicados entre páginas de TMDB.
- **`rootMargin: "200px"`** precarga la siguiente página antes de llegar al
  final del viewport.
- **Imágenes unificadas con `next/image`:** toda la app (listado, detalle y
  créditos) usa `next/image`. El póster del detalle se renderiza vía
  `PosterTheme` (§8). Se sirven optimizadas y desde el mismo origen
  (`/_next/image`), lo que además habilita la extracción de color por canvas sin
  CORS.
- **Manejo de errores básico:** los servicios hacen `.catch(console.log)` y las
  páginas devuelven `Error 404` / `MovieNotFound` como fallback simple.

---

## 7. Deuda técnica

> ✅ **Resuelta (2026-06-17).** Las tres fases de actualización se completaron.
> La app corre en **Next 16.2.9 / React 19.2** y `pnpm audit --prod` está
> **limpio** (0 vulnerabilidades en lo que se despliega). Se conserva el historial
> abajo como registro.

### 7.1 Resumen del audit

```
Antes (2026-06-16):  46 vulnerabilidades — 1 critical · 18 high · 22 moderate · 5 low
Ahora  (2026-06-17):  pnpm audit --prod  → 0 vulnerabilidades
                      pnpm audit (todo)  → 12 — 7 high · 4 moderate · 1 low (SOLO dev)
```

- **Runtime / producción: limpio.** Se cerró la crítica de middleware, todas las
  high de `next` y las moderate residuales (XSS App Router, DoS `next/image`,
  cache poisoning RSC). El postcss que bundlea Next se parchea con un `override`
  a `^8.5.15` (cierra el XSS de postcss + el aviso de `nanoid`).
- **Las 12 restantes son solo de desarrollo**, transitivas del propio toolchain
  más reciente (`eslint-config-next@16`→`fast-glob`/`eslint-import-resolver`→
  `braces`/`minimatch`/`picomatch`, `eslint@9`→`flatted`, `tailwindcss`→`yaml`).
  Sin exposición en runtime; dependen de parches upstream. Deuda dev de baja
  prioridad (forzarlas con overrides arriesga romper el linting de código no
  desplegado).

### 7.2 Vulnerabilidades destacadas en `next` (dependencia directa, runtime)

| Severidad | Título | Vulnerable | Parcheada |
|---|---|---|---|
| **critical** | Authorization Bypass in Next.js Middleware | `>=14.0.0 <14.2.25` | `>=14.2.25` |
| high | SSRF in Server Actions | `>=13.4.0 <14.1.1` | `>=14.1.1` |
| high | Cache Poisoning | `>=14.0.0 <14.2.10` | `>=14.2.10` |
| high | DoS with Server Components / Server Actions | varios `<14.2.x` | `>=14.2.x` |
| high | Authorization bypass / Middleware-Proxy bypass (Pages) | varios | 14.2.x / 15.x |
| moderate | DoS / Content Injection / Cache Key Confusion en `next/image` | varios | 14.2.x / 15.x |
| moderate | XSS en App Router / `beforeInteractive` | varios | 14.2.x / 15.x |
| low | Cache poisoning por colisiones de cache-busting en RSC | `>=13.4.6 <15.5.16` | `>=15.5.16` |
| low | Information exposure en dev server | — | 14.2.x |

> La actualización a **`14.2.35`** resuelve la crítica y **todas las high de
> `next`**. Un puñado de advisories moderate/low restantes sólo cierran en la
> rama **15.x** (`>=15.5.16`) o superior.

### 7.3 Plan de actualización (ejecutado)

**✅ Fase 1 — Parche de seguridad (`14.0.0 → 14.2.35`).** Cerró la crítica de
middleware y todas las high de `next` sin cambios de código.

**✅ Fase 2 — Salto a Next 16 (`14.2.35 → 15 → 16.2.9`), por etapas:**
- **Etapa A (Next 15 + React 19):** `params`/`searchParams` migrados a async
  (codemod `next-async-request-api`) en `Home`, `MoviPage`, `SearchMovies`;
  caché explícita de `fetch` en `services/Movies.ts` (Next 15 ya no cachea por
  defecto): `revalidate` 1 h listados, 1 día detalle/créditos, `no-store` búsqueda.
- **Etapa B (Next 16):** Turbopack por defecto (sin webpack custom); `next.config`
  ya compatible (quality 75, `remotePatterns`); `sharp` aprobado para el
  optimizador. `tsconfig` actualizado por Next (`jsx: react-jsx`, `.next/dev/types`).

**✅ Fase 3 — Toolchain de lint (ESLint 9 flat config):**
- `next lint` (eliminado en Next 16) → `eslint .`; nuevo `eslint.config.mjs` que
  extiende los presets flat nativos de `eslint-config-next@16` (que ya traen
  `typescript-eslint` v8, react, react-hooks, import, jsx-a11y) + Prettier.
- Eliminado `eslint-config-standard-with-typescript` (deprecado) y plugins ya
  redundantes; `eslint@9`. Borrados `.eslintrc.js` y `.eslintignore`.

**Despliegue (Vercel):** se fija `pnpm@11` con el campo `packageManager` en
`package.json` para que Vercel use la misma versión que en local (pnpm 9 no
entiende `pnpm-workspace.yaml` —`allowBuilds`/`overrides`— y fallaba con
"packages field missing or empty").

### 7.4 Otra deuda técnica (no de seguridad)

- ~~**`<img>` crudo en `movies/[id]`** en lugar de `next/image`~~ ✅ **Resuelto
  (2026-06-17):** póster y fotos de reparto migrados a `next/image` (§8.6).
- **Manejo de errores con `console.log`** en `services/Movies.ts`; no hay
  `error.tsx`/`not-found.tsx` por ruta. Añadir boundaries del App Router.
- **Tipado de respuestas:** `getTrendingFilms`/`getPopularFilms`/... devuelven
  `any` implícito (`data` de `response.json()`); tipar con `ResponseMovies`.
- **`.env` presente en el árbol de trabajo:** confirmar que está en
  `.gitignore` y que `TMDB_API_KEY` no se ha filtrado en el historial.

### 7.5 Prioridad

| # | Acción | Impacto | Estado |
|---|---|---|---|
| 1 | `next@14.2.35` (Fase 1) | Cierra crítica + high runtime | ✅ Hecho |
| 2 | Salto a Next 16 (Fase 2) | Cierra moderate/low residuales | ✅ Hecho |
| 3 | Toolchain de lint → ESLint 9 flat (Fase 3) | Quita ruido transitivo | ✅ Hecho |
| 4 | ~~`<img>` → `next/image`~~ ✅ | Calidad/UX | ✅ Hecho |
| 5 | Tipado de respuestas TMDB, `error.tsx`/`not-found.tsx` por ruta | Calidad/UX | 🟢 Pendiente |
| 6 | Vulns dev-only del toolchain de lint (cuando upstream parchee) | Ruido | 🟢 Pendiente |

---

## 8. Tematización dinámica por color del póster (implementado)

> Objetivo cumplido: al abrir `/movies/[id]`, **toda la app** adopta una paleta
> derivada del póster — un degradado vertical **negro → azul → marrón** que sigue
> al póster, con título, subtítulos y acentos derivados del color más vívido. Al
> salir, los listados vuelven al tema neutro por defecto.

### 8.1 Cambio de enfoque respecto al plan inicial

El plan original (extracción **server-side** con `node-vibrant`, CSS vars sólo en
`<main>`) se **descartó**:

- `node-vibrant` sólo devuelve *swatches* globales; no puede reproducir el
  degradado **direccional** (oscuro arriba → color dominante en medio → tonos
  cálidos abajo) que pedía el diseño.
- Se quería que el **estado global** guardara la paleta y re-tintara la app
  completa, algo intrínsecamente de cliente.

Resultado: `node-vibrant` **eliminado** (§2); extracción **en cliente** sobre
`<canvas>` + **estado global con Zustand** + **design system de tokens CSS**.

### 8.2 Extracción de color (cliente) — `src/services/palette.ts`

- Módulo puro de cliente (sin dependencias de Node). `extractTheme(img)` dibuja
  el póster en un `<canvas>` de 64px y lo muestrea por **bandas horizontales**
  (arriba/medio/abajo) → las tres paradas del degradado, normalizadas a una
  luminancia objetivo (negro / azul / marrón).
- El píxel **más vívido** (mayor saturación, luminancia media) define el
  `accent`; de él se derivan por HSL `title`, `subtitle`, `text`, `surface`,
  `brand` y `accentSoft`. Incluye guarda para pósters monocromos.

### 8.3 Estado global — `src/store/theme.ts` (Zustand)

- `useThemeStore` guarda el `Theme` activo (`defaultTheme` neutro para listados).
- `themeToCssVars(theme)` mapea el `Theme` a las custom properties que consumen
  Tailwind y `globals.css`.
- API: `setTheme(theme)` / `reset()`.

### 8.4 Aplicación al DOM — `ThemeSync` + `PosterTheme`

- `src/components/ThemeSync.tsx` (montado en el `layout`): se suscribe al store y
  escribe las CSS vars en `document.documentElement` → **re-skin de toda la app**
  (logo, navbar, búsqueda, tags, fondo).
- `src/components/PosterTheme.tsx`: renderiza el póster con `next/image`; en
  `onLoad` ejecuta `setTheme(extractTheme(img))`; en `unmount`, `reset()`.

### 8.5 Design system — `tailwind.config.ts` + `globals.css`

- Tokens semánticos expuestos como utilidades Tailwind: `text-title`,
  `text-subtitle`, `text-content`, `text-brand`, `bg-accent`, `bg-accent-soft`,
  `bg-surface` y el degradado `bg-theme`. Sustituyen a los colores hardcodeados.
- `globals.css`: valores por defecto en `:root`, fondo del `body` con el
  degradado, y los tokens registrados con `@property … <color>` + `transition`
  en `:root` para que el cambio de paleta haga **cross-fade (~0.7s)** en vez de
  saltar.

### 8.6 Imágenes y CORS

- Póster y fotos de reparto usan `next/image`. El optimizador sirve desde
  `/_next/image` (**mismo origen**), lo que permite leer los píxeles en el canvas
  **sin CORS** y evita el problema de cabeceras CORS cacheadas de la CDN de TMDB.
- Por eso se descartaron tanto `crossOrigin="anonymous"` (la CDN cachea sin
  `Vary: Origin`) como un proxy propio `/api/poster` (redundante: el optimizador
  ya es el «proxy» de mismo origen).

### 8.7 Compromiso conocido

- Extracción en cliente ⇒ breve instante con el tema por defecto antes de que el
  póster cargue; el `transition` de 0.7s lo convierte en un *fade* intencional.

---

## 9. Verificación

Tras cada fase:

```bash
pnpm audit            # severidad y nº de vulnerabilidades
pnpm build            # sin errores de compilación
pnpm lint             # sin regresiones de lint
```
