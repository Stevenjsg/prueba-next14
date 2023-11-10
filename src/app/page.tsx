import { getPopularFilms, getTrendingFilms } from "@/services/Movies"
import { type typeCategory, type ResponseMovies } from "../types/movie.type"
import ListMovies from "@/components/ListMovies"

interface Props {
  searchParams: {
    t: typeCategory
  }
}

export default async function Home({ searchParams }: Props) {
  const { t } = searchParams
  const data = (await getTrendingFilms()) as ResponseMovies
  if (data === null) {
    return <div>Error 404</div>
  }
  if (t !== undefined) {
    let categoryData: ResponseMovies | null = null
    if (t.toLowerCase() === "popular") {
      categoryData = (await getPopularFilms()) as ResponseMovies
    } else if (t.toLowerCase() === "torated") {
      console.log(t.toLowerCase())
    } else if (t.toLowerCase() === "upcoming") {
      console.log(t.toLowerCase())
    }

    if (categoryData !== null) {
      return (
        <main className="flex flex-col items-center justify-center py-2 lg:py-8">
          <h1 className="my-4 text-4xl font-bold text-white opacity-80">
            <span className="mr-2 tracking-tight text-blue-500">
              {t.toUpperCase()}
            </span>
            movies
          </h1>
          <ListMovies dataMovies={categoryData} />
        </main>
      )
    }
  }
  return (
    <main className="flex flex-col items-center justify-center py-2 lg:py-8">
      <h1 className="my-4 text-4xl font-bold text-white opacity-80">
        <span className="mr-2 tracking-tight text-blue-500">Trending</span>
        movies
      </h1>
      <ListMovies dataMovies={data} />
    </main>
  )
}
