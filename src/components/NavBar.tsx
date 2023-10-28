import BackButtom from "./BackButtom"
import ScrollMenu from "./ScrollMenu"
import SearchForm from "./SearchForm"

export default function NavBar() {
  return (
    <nav className="relative mx-auto flex w-[80%] flex-col items-center gap-y-2 md:w-[80%] md:flex-1 md:flex-row md:justify-between">
      <BackButtom className="rounded border border-slate-300 p-1 transition-all duration-150 hover:opacity-100 dark:border-slate-50/20 md:opacity-40">
        <span className="mx-2 inline-flex items-center">
          <span className="mr-2 text-4xl">⬅️</span>back
        </span>
      </BackButtom>
      <SearchForm />
      <ScrollMenu />
    </nav>
  )
}
