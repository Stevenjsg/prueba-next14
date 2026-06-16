import BackButtom from "./BackButtom";
import ScrollMenu from "./ScrollMenu";
import SearchForm from "./SearchForm";

export default function NavBar() {
  return (
    <nav className="relative mx-auto flex w-[80%] items-center gap-y-2 md:w-[80%] flex-1 flex-row justify-between">
      <BackButtom
        className="rounded border border-slate-300 transition-all duration-150 hover:opacity-100 dark:border-slate-50/20 md:opacity-40 mx-2 p-2 inline-flex
      items-center md:hover:opacity-100"
      >
        <span className="mx-2 inline-flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="mr-2 h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          back
        </span>
      </BackButtom>
      <SearchForm />
      <ScrollMenu />
    </nav>
  );
}
