import Image from "next/image";
import Link from "next/link";
import { type Movies } from "@/types/movie.type";

export default function MovieCard({
  movie,
  index,
}: {
  movie: Movies;
  index: number;
}) {
  return (
    <Link
      href={`/movies/${movie.id}`}
      key={movie.id}
      className="relative mx-auto flex w-full aspect-[2/3] flex-col items-center justify-center rounded border border-gray-200/20 hover:animate-colorChange hover:border hover:shadow-lg hover:shadow-gray-200/20 dark:border-gray-700/20 dark:hover:border dark:hover:shadow-gray-700/20"
    >
      <Image
        className="object-cover rounded"
        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
        alt={movie.title}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        priority={index < 5}
      />
      <div className="text-balance absolute bottom-0 z-[1] w-full bg-slate-800/25 px-1 py-2 text-center text-xl font-bold">
        <p className="text-white">{movie.title}</p>
      </div>
    </Link>
  );
}
