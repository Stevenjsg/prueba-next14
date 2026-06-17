import { getPopularFilms, getTrendingFilms, getTopRatedFilms } from "@/services/Movies"
import { type typeCategory, type ResponseMovies } from "../types/movie.type"
import InfiniteMovies from "@/components/InfiniteMovies"

interface Props {
  searchParams: Promise<{
    t?: typeCategory
  }>
}

const categoryData: Record<string, () => Promise<ResponseMovies>> = {
  trending: getTrendingFilms,
  popular: getPopularFilms,
  torated: getTopRatedFilms,
}

export default async function Home(props: Props) {
  const searchParams = await props.searchParams
  const category = searchParams.t?.toLowerCase() ?? "trending"
  const getFilms = categoryData[category] ?? getTrendingFilms
  const title = category in categoryData ? category : "trending"

  const data = await getFilms()
  if (data === null) {
    return <div>Error 404</div>
  }

  return (
    <main className="flex flex-col items-center justify-center ">
      <h1 className="my-4 text-4xl font-bold text-subtitle">
        <span className="mr-2 capitalize tracking-tight text-accent">{title}</span>
        movies
      </h1>
      <InfiniteMovies key={category} initialMovies={data.results} category={category} />
    </main>
  )
}
