import BackButtom from "./BackButtom"
import SearchForm from "./SearchForm"

export default function NavBar() {
  return (
    <nav className="mx-auto w-full md:w-[80%] md:flex-1">
      <ul className="flex flex-col items-center justify-between gap-y-4 md:flex-row">
        <li className="opacity-40 transition-all duration-150 hover:opacity-100">
          <BackButtom className="rounded border border-slate-300 p-1 dark:border-slate-50/20">
            <span className="mx-2 inline-flex items-center">
              <span className="mr-2 text-4xl">⬅️</span>back
            </span>
          </BackButtom>
        </li>
        <li>
          <SearchForm />
        </li>
      </ul>
    </nav>
  )
}
