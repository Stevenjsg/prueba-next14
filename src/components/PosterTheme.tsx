"use client"
import Image from "next/image"
import { useEffect, useRef } from "react"
import { extractTheme } from "@/services/palette"
import { useThemeStore } from "@/store/theme"

interface Props {
  src: string
  alt: string
  className?: string
}

/**
 * Renders the movie poster with next/image and, once it has loaded, samples it
 * on a canvas to derive the page theme and push it into the global store. On
 * unmount (leaving the movie) it restores the default theme.
 *
 * next/image serves the optimized file from /_next/image (same origin), so the
 * canvas can read its pixels without tripping TMDB's flaky CORS headers.
 */
export default function PosterTheme({ src, alt, className }: Props) {
  const setTheme = useThemeStore((state) => state.setTheme)
  const reset = useThemeStore((state) => state.reset)
  const ref = useRef<HTMLImageElement>(null)

  const apply = (img: HTMLImageElement) => {
    if (img.naturalWidth === 0) return
    try {
      setTheme(extractTheme(img))
    } catch {
      // Canvas can throw if the image taints — keep the default theme.
    }
  }

  useEffect(() => {
    // Handle images already cached/decoded before onLoad fires.
    if (ref.current?.complete === true) apply(ref.current)
    return () => {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  return (
    <Image
      ref={ref}
      fill
      priority
      sizes="(max-width: 768px) 90vw, (max-width: 1280px) 40vw, 500px"
      className={className}
      src={src}
      alt={alt}
      onLoad={(event) => {
        apply(event.currentTarget)
      }}
    />
  )
}
