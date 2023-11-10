import ProfileIcon from "@/icon/profile"
import { getCreditsToIdMovie } from "@/services/Movies"
import { type Cast, type Credits } from "@/types/credits"

interface Props {
  id: number
}

async function CardsCredits({ id }: Props) {
  const { cast } = await getCreditsToIdMovie(id)
  if (cast === undefined) {
    return
  }
  const filteredCast: Cast[] = cast
    .filter((item) => item.known_for_department === "Acting")
    .slice(0, 10) // Limitar a 10 registros
  return (
    <section className="mt-8 flex h-fit w-full gap-1 overflow-x-auto overflow-y-hidden p-2">
      {filteredCast.map((castItem) => (
        <div
          className="min-w-[128px] rounded-md bg-neutral-500"
          key={castItem.cast_id}
        >
          <picture className="relative block h-36 w-full rounded-t-md">
            {castItem.profile_path !== null ? (
              <img
                className="absolute inset-0 h-full w-full rounded-t-md object-cover object-top"
                src={`https://image.tmdb.org/t/p/w500/${castItem.profile_path}`}
                alt={castItem.original_name}
              />
            ) : (
              <ProfileIcon className="absolute inset-0 h-full w-full object-cover" />
            )}
          </picture>
          <div className="flex flex-col items-center justify-center">
            <p className="w-full text-center text-white">
              {castItem.original_name}
            </p>
            <span className="text-balance p-0.5 text-center text-sm font-semibold text-neutral-300">
              {castItem.character}
            </span>
          </div>
        </div>
      ))}
    </section>
  )
}

export default CardsCredits
