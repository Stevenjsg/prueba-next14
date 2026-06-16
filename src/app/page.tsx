import {
  getPopularFilms,
  getTrendingFilms,
  getTopRatedFilms,
} from "@/services/Movies";
import { type typeCategory, type ResponseMovies } from "../types/movie.type";
import ListMovies from "@/components/ListMovies";

interface Props {
  searchParams: {
    t?: typeCategory;
  };
}

const categoryData: Record<string, () => Promise<ResponseMovies>> = {
  trending: getTrendingFilms,
  popular: getPopularFilms,
  torated: getTopRatedFilms,
};

export default async function Home({ searchParams }: Props) {
  const category = searchParams.t?.toLowerCase() ?? "trending";
  const getFilms = categoryData[category] ?? getTrendingFilms;
  const title = category in categoryData ? category : "trending";

  const data = await getFilms();
  if (data === null) {
    return <div>Error 404</div>;
  }

  return (
    <main className="flex flex-col items-center justify-center py-2 ">
      <h1 className="my-4 text-4xl font-bold text-gray-500 opacity-80">
        <span className="mr-2 capitalize tracking-tight text-blue-500">
          {title}
        </span>
        movies
      </h1>
      <ListMovies dataMovies={data} />
    </main>
  );
}
