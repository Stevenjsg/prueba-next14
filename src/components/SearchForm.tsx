/* eslint-disable @typescript-eslint/no-misused-promises */
import SearchIcon from "@/icon/searchIcon";
import { stringToSlug } from "@/services/utils";
import { redirect } from "next/navigation";

export default function SearchForm() {
  async function create(formData: FormData): Promise<void> {
    "use server";
    const query = formData.get("query");
    if (query === null) {
      return redirect("/");
    }
    const newQuery = stringToSlug(query as string);
    return redirect(`/search/${newQuery}`);
  }
  return (
    <form action={create} className="inline-flex items-center mx-2">
      <input
        className="w-auto rounded border p-2 me-2 placeholder:text-black/30 dark:border-none dark:placeholder:text-white/30 hidden sm:block"
        type="text"
        name="query"
        placeholder="Matrix, Interstellar..."
      />
      <button className="rounded  bg-slate-200 p-2 hover:bg-slate-50/25  hover:text-red-300 dark:bg-slate-50/10">
        <SearchIcon />
      </button>
    </form>
  );
}
