# SDD — FilmsCenter (prueba-next14)

> **Software Design Document**
> Proyecto: `prueba-next14` (FilmsCenter)
> Última actualización: 2026-06-17

---

## 1. Resumen

FilmsCenter es una aplicación web de catálogo de películas construida sobre
**Next.js 14 (App Router)**. Consume la API pública de **TMDB (The Movie DB)**
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
| Framework | Next.js | `14.0.0` |
| UI | React / React DOM | `^18` |
| Lenguaje | TypeScript | `^5.2.2` |
| Estilos | Tailwind CSS + autoprefixer + PostCSS | `^3` |
| Estado global | Zustand | `^5.0.14` |
| Extracción de color | Canvas API (cliente, sin dependencias) | — |
| Lint/format | ESLint 8 + `eslint-config-standard-with-typescript` + Prettier | ver §7 |

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

> Esta sección documenta el resultado de `pnpm audit` (2026-06-16) y el plan de
> actualización. **Es la deuda más urgente del proyecto.**

### 7.1 Resumen del audit

```
46 vulnerabilidades:  1 critical · 18 high · 22 moderate · 5 low
```

La deuda se concentra en **dos focos**:

1. **`next@14.0.0`** — desactualizado en ~2 años. Acumula 1 crítica, varias
   altas y moderadas. Versión instalada: `14.0.0`. Último parche 14.x:
   **`14.2.35`**. Último estable global: **`16.2.9`**.
2. **Cadena de herramientas de lint** (`eslint@8` +
   `eslint-config-standard-with-typescript@39` + `@typescript-eslint@6`) —
   arrastra vulnerabilidades transitivas (ReDoS, prototype pollution) en
   `braces`, `cross-spawn`, `minimatch`, `picomatch`, `flatted`,
   `brace-expansion`, `js-yaml`, `babel`, etc. Son devDependencies (riesgo en
   runtime ≈ nulo, pero ruido y deuda de mantenimiento).

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

### 7.3 Plan de actualización recomendado

**Fase 1 — Parche de seguridad inmediato (bajo riesgo, mismo major):**

```bash
pnpm add next@14.2.35 eslint-config-next@14.2.35
pnpm audit            # verificar que la crítica y las high de next desaparecen
pnpm build            # 14.0 → 14.2 no tiene breaking changes relevantes
```
- Cierra la crítica de middleware + todas las high de `next`.
- Sin cambios de código esperados (App Router, Server Actions y RSC ya en uso).

**Fase 2 — Salto a major 15 / 16 (planificado, requiere QA):**
- `next@15` / `next@16` cierran las moderate/low residuales (XSS App Router,
  `next/image` DoS, cache poisoning RSC).
- Breaking changes a revisar: `searchParams`/`params` pasan a ser **async**
  (afecta `Home`, `MoviPage`, `SearchMovies`), caching por defecto cambia,
  React 19 requerido en Next 15+.
- Migrar con el codemod oficial: `npx @next/codemod@latest upgrade`.

**Fase 3 — Toolchain de lint (limpia el ruido transitivo):**
- `eslint-config-standard-with-typescript` está **deprecado** (renombrado a
  `eslint-config-love`). Migrar a ESLint 9 (flat config) + `typescript-eslint`
  v8, o reemplazar por la config recomendada de Next.
- Esto elimina la mayoría de las 18 high / moderate transitivas
  (`braces`, `cross-spawn`, `minimatch`, `picomatch`, `flatted`, ...).

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

| # | Acción | Impacto | Esfuerzo | Prioridad |
|---|---|---|---|---|
| 1 | `next@14.2.35` (Fase 1) | Cierra crítica + high runtime | Bajo | 🔴 Ahora |
| 2 | Migrar toolchain de lint (Fase 3) | Quita ruido transitivo | Medio | 🟠 Pronto |
| 3 | Salto a Next 15/16 (Fase 2) | Cierra moderate/low residuales | Alto | 🟡 Planificar |
| 4 | ~~`<img>` → `next/image`~~ ✅, tipado, error boundaries | Calidad/UX | Bajo-Medio | 🟢 Continuo |

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
