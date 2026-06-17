import { type Theme, defaultTheme } from "@/store/theme"

/**
 * Client-side color extraction.
 *
 * node-vibrant only returns global swatches, so it can't reproduce a poster's
 * vertical mood (dark at the top, a dominant hue in the middle, warm tones at the
 * bottom). Here we draw the poster onto a tiny canvas and sample it by horizontal
 * bands to build a faithful negro -> azul -> marron gradient, then derive every
 * other token (accent, title, subtitle, text...) from the most vivid color.
 */

type RGB = [number, number, number]
type HSL = [number, number, number]

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      default:
        h = (r - g) / d + 4
    }
    h /= 6
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

const hsl = (h: number, s: number, l: number, a = 1) =>
  a === 1 ? `hsl(${h} ${s}% ${l}%)` : `hsl(${h} ${s}% ${l}% / ${a})`

/** Average color of the rows in [y0, y1) of the RGBA pixel buffer. */
function averageBand(data: Uint8ClampedArray, width: number, y0: number, y1: number): RGB {
  let r = 0
  let g = 0
  let b = 0
  let count = 0
  for (let y = y0; y < y1; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      if (data[i + 3] < 128) continue // skip near-transparent pixels
      r += data[i]
      g += data[i + 1]
      b += data[i + 2]
      count++
    }
  }
  if (count === 0) return [0, 0, 0]
  return [r / count, g / count, b / count]
}

/** Most vivid color in the image: maximise saturation, prefer mid lightness. */
function mostVivid(data: Uint8ClampedArray): HSL {
  let best: HSL = [0, 0, 50]
  let bestScore = -1
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue
    const [h, s, l] = rgbToHsl(data[i], data[i + 1], data[i + 2])
    // Penalise extremes of lightness so we land on a saturated, usable hue.
    const score = s * (1 - Math.abs(l - 55) / 55)
    if (score > bestScore) {
      bestScore = score
      best = [h, s, l]
    }
  }
  return best
}

/** Darken/normalise a band to a target lightness while keeping its hue. */
function gradientStop([r, g, b]: RGB, targetL: number): string {
  const [h, s] = rgbToHsl(r, g, b)
  return hsl(h, clamp(s, 0, 55), targetL)
}

export function extractTheme(img: HTMLImageElement): Theme {
  const width = 64
  const ratio = img.naturalWidth > 0 ? img.naturalHeight / img.naturalWidth : 1.5
  const height = Math.max(3, Math.round(width * ratio))

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (ctx === null) return defaultTheme

  ctx.drawImage(img, 0, 0, width, height)
  const { data } = ctx.getImageData(0, 0, width, height)

  const third = Math.floor(height / 3)
  const top = averageBand(data, width, 0, third)
  const mid = averageBand(data, width, third, third * 2)
  const bottom = averageBand(data, width, third * 2, height)

  const [vh, vs] = mostVivid(data)
  const saturated = vs >= 12 // grayscale poster guard
  const accentH = saturated ? vh : 0
  const accentS = saturated ? clamp(vs, 55, 95) : 0

  return {
    // negro -> azul -> marron, following the poster top to bottom
    grad1: gradientStop(top, 6),
    grad2: gradientStop(mid, 16),
    grad3: gradientStop(bottom, 11),
    surface: saturated ? hsl(accentH, 22, 18) : hsl(0, 0, 18),
    accent: hsl(accentH, accentS, 60),
    accentSoft: hsl(accentH, saturated ? clamp(vs, 45, 70) : 0, 42),
    title: hsl(accentH, accentS, 64),
    subtitle: hsl(accentH, saturated ? 35 : 0, 78, 0.55),
    text: hsl(accentH, saturated ? 16 : 0, 90, 0.92),
    brand: hsl(accentH, accentS, 55),
  }
}
