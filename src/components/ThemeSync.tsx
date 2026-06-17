"use client"
import { useEffect } from "react"
import { themeToCssVars, useThemeStore } from "@/store/theme"

/**
 * Bridges the global theme store to the document root. Whenever the active theme
 * changes (e.g. opening a movie), it writes the CSS custom properties onto
 * <html>, so the whole app re-skins. The actual color transition is animated in
 * globals.css via @property + transition on :root.
 */
export default function ThemeSync() {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    const root = document.documentElement
    const vars = themeToCssVars(theme)
    for (const [key, value] of Object.entries(vars)) {
      root.style.setProperty(key, value)
    }
  }, [theme])

  return null
}
