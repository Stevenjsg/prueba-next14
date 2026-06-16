import { type ResponseMovies, type Movies } from "@/types/movie.type";
import React from "react";
import MovieNotFound from "./MovieNotFound";
import MovieCard from "./MovieCard";
interface Props {
  movies: Movies[];
}

function ListMovies({ movies }: Props) {
  if (movies === undefined || movies.length === 0) {
    return <MovieNotFound />;
  }
  const filterMovies = movies.filter((movie) => movie.poster_path);
  return (
    <section className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {filterMovies.map((movie, index) => (
        <MovieCard key={movie.id} index={index} movie={movie} />
      ))}
    </section>
  );
}

export default ListMovies;
