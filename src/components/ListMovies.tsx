import { type ResponseMovies, type Movies } from "@/types/movie.type"
import Link from "next/link"
import React from "react"
import MovieNotFound from "./MovieNotFound"

interface Props {
  dataMovies: {
    results: Movies[]
  }
}

function ListMovies({ dataMovies }: Props) {
  const { results: movies } = dataMovies as ResponseMovies
  if (movies === undefined || movies.length === 0) {
    return <MovieNotFound />
  }
  const filterMovies = movies.filter((movie) => movie.poster_path)
  return (
    <section className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,300px))] place-content-center gap-y-2">
      {filterMovies.map((movie) => (
        <Link
          href={`/movies/${movie.id}`}
          key={movie.id}
          className="relative mx-auto flex h-96 w-64 flex-col items-center justify-center rounded border border-gray-200/20 hover:animate-colorChange hover:border"
        >
          <img
            className="absolute inset-0 h-full w-full object-contain"
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            alt={movie.title}
          />
          <div className="text-balance absolute bottom-0 z-[1] w-full bg-slate-800/25 px-1 py-2 text-center text-xl font-bold">
            <p className="text-white">{movie.title}</p>
          </div>
        </Link>
      ))}
    </section>
  )
}

export default ListMovies
