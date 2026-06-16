"use client"
import { useState, useEffect, useRef } from "react"
import { loadMoreMovies } from "@/actions/getPageMovies"
import { type Movies } from "@/types/movie.type"
import ListMovies from "./ListMovies"

interface Props {
  initialMovies: Movies[]
  category: string
}

export default function InfiniteMovies({ initialMovies, category }: Props) {
  const [movies, setMovies] = useState<Movies[]>(initialMovies)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entries]) => {
        if (!entries.isIntersecting || isLoading || !hasMore) return
        void (async () => {
          setIsLoading(true)
          const nextPage = page + 1
          const newMovies = await loadMoreMovies(category, nextPage)
          if (newMovies.results.length === 0) {
            setHasMore(false)
          } else {
            setMovies((prev) => {
              const ids = new Set(prev.map((movie) => movie.id))
              const news = newMovies.results.filter((movie) => !ids.has(movie.id))
              return [...prev, ...news]
            })
            setPage(nextPage)
            setHasMore(newMovies.page < newMovies.total_pages)
          }
          setIsLoading(false)
        })()
      },
      { threshold: 1.0, rootMargin: "200px" },
    )

    const el = sentinelRef.current
    if (el != null) observer.observe(el)

    return () => {
      if (el != null) observer.unobserve(el)
    }
  }, [page, isLoading, hasMore, category])

  return (
    <>
      <ListMovies movies={movies} />
      {isLoading && <p>Loading...</p>}
      {!hasMore && <p>No more movies to load.</p>}
      <div ref={sentinelRef} className="h-10 w-full" />
    </>
  )
}
