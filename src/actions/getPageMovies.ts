"use server";
import {
  getTrendingFilms,
  getPopularFilms,
  getTopRatedFilms,
} from "@/services/Movies";
import { type typeCategory, type ResponseMovies } from "../types/movie.type";

const categoryData: Record<string, (page?: number) => Promise<ResponseMovies>> =
  {
    trending: getTrendingFilms,
    popular: getPopularFilms,
    torated: getTopRatedFilms,
  };

export async function loadMoreMovies(category: string, page: number) {
  const getFilms = categoryData[category] ?? getTrendingFilms;
  return await getFilms(page);
}
