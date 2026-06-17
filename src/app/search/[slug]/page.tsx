import ListMovies from "@/components/ListMovies"
import MovieNotFound from "@/components/MovieNotFound"
import { findMovie } from "@/services/Movies"

interface Props {
  params: Promise<{
    slug: string
  }>
}
export default async function SearchMovies(props: Props) {
  const params = await props.params;
  const { slug } = params
  const search = slug.replace(/-/g, " ")
  const data = await findMovie({ query: search })
  if (data === undefined || data.results.length === 0) {
    return <MovieNotFound title={search} />
  }
  return (
    <main className="flex flex-col items-center justify-center pb-8">
      <h1 className="my-4 text-4xl font-bold text-title">Estas buscando: {search}</h1>
      <ListMovies movies={data.results} />
    </main>
  )
}
