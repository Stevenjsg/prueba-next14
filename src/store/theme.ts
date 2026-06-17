import { create } from "zustand"

/**
 * Design-system color tokens for a single page "skin".
 *
 * grad1/grad2/grad3 are the vertical background gradient stops (negro -> azul ->
 * marron for La Odisea). Everything else is derived from the poster's accent so
 * titles, subtitles and surfaces stay in harmony.
 */
export interface Theme {
  grad1: string
  grad2: string
  grad3: string
  surface: string
  accent: string
  accentSoft: string
  title: string
  subtitle: string
  text: string
  brand: string
}

/** Neutral dark theme used on listing/search pages and before a poster loads. */
export const defaultTheme: Theme = {
  grad1: "hsl(222 47% 6%)",
  grad2: "hsl(215 41% 16%)",
  grad3: "hsl(222 40% 9%)",
  surface: "hsl(222 30% 18%)",
  accent: "hsl(0 72% 55%)",
  accentSoft: "hsl(0 55% 42%)",
  title: "hsl(0 75% 62%)",
  subtitle: "hsl(0 0% 100% / 0.45)",
  text: "hsl(0 0% 100% / 0.9)",
  brand: "hsl(0 72% 45%)",
}

/** Maps a Theme to the CSS custom properties consumed by Tailwind/globals.css. */
export const themeToCssVars = (theme: Theme): Record<string, string> => ({
  "--grad-1": theme.grad1,
  "--grad-2": theme.grad2,
  "--grad-3": theme.grad3,
  "--surface": theme.surface,
  "--accent": theme.accent,
  "--accent-soft": theme.accentSoft,
  "--title": theme.title,
  "--subtitle": theme.subtitle,
  "--text": theme.text,
  "--brand": theme.brand,
})

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  reset: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: defaultTheme,
  setTheme: (theme) => {
    set({ theme })
  },
  reset: () => {
    set({ theme: defaultTheme })
  },
}))
