import BackButtom from "./BackButtom"
import SearchForm from "./SearchForm"

export default function NavBar() {
  return (
    <nav className="mx-auto w-[80%] flex-1">
      <ul className="flex items-center justify-between">
        <li className="opacity-40 transition-all duration-150 hover:opacity-100">
          <BackButtom>
            <span className="inline-flex items-center">
              <span className="text-2xl">⬅️</span>back
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
