const API_KEY = process.env.TMDB_API_KEY

export const MenuCategories = {
  POPULAR: "Popular",
  TORATED: "To rated",
  UPCOMING: "Upcoming",
}
export const TMDB_URL = "https://api.themoviedb.org/3/"
export const auth = `Bearer ${API_KEY}`
