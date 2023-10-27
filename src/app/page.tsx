import { getTrendingFilms } from "@/services/Movies"
import { type Movies } from "./movie.type"
import ListMovies from "@/components/ListMovies"

export default async function Home() {
  const data = (await getTrendingFilms()) as {
    results: Movies[]
  }
  if (data === null) {
    return <div>Error 404</div>
  }
  return (
    <main className="flex flex-col items-center justify-center py-8">
      <h1 className="my-4 text-4xl font-bold text-red-500">Trending Movies</h1>
      <ListMovies dataMovies={data} />
    </main>
  )
}
