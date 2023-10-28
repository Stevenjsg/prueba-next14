"use server"
import { TMDB_URL, auth } from "@/constant"

export async function getTrendingFilms() {
  const response = await fetch(`${TMDB_URL}trending/movie/day?language=es-Es`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: auth,
    },
    next: {
      revalidate: 3600 * 24,
    },
  })
  const data = await response.json()
  return data
}
export async function getPopularFilms() {
  const response = await fetch(`${TMDB_URL}/movie/popular?language=es-Es`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: auth,
    },
    next: {
      revalidate: 3600 * 24,
    },
  })
  const data = await response.json()
  return data
}
export async function getMovisById({ movieId }: { movieId: string }) {
  return await fetch(`${TMDB_URL}movie/${movieId}?language=es-Es`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: auth,
    },
  })
    .then(async (response) => await response.json())
    .catch((error) => {
      console.log(error)
    })
}
export async function findMovie({ query }: { query: string }) {
  return await fetch(
    `${TMDB_URL}search/movie?query=${query}&include_adult=false&language=es-ES&page=1`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: auth,
      },
    },
  )
    .then(async (response) => await response.json())
    .catch((error) => {
      console.log(error)
    })
}
