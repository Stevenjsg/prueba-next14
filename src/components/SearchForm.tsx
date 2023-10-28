/* eslint-disable @typescript-eslint/no-misused-promises */
import { findMovie } from "@/services/Movies"
import { stringToSlug } from "@/services/utils"
import { redirect } from "next/navigation"

export default function SearchForm() {
  async function create(formData: FormData): Promise<void> {
    "use server"
    const query = formData.get("query")
    if (query === null) {
      return redirect("/")
    }
    const newQuery = stringToSlug(query as string)
    return redirect(`/search/${newQuery}`)
  }
  return (
    <form method="POST" action={create}>
      <input
        className="mx-2 rounded border px-2 py-2 placeholder:text-black/30 dark:border-none dark:placeholder:text-white/30"
        type="text"
        name="query"
        placeholder="Matrix, Interstellar..."
      />
      <button className="rounded  bg-slate-200 px-2 py-1 hover:bg-slate-50/25  dark:bg-slate-50/10">
        Buscar
      </button>
    </form>
  )
}
