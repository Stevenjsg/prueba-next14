import { type Genre, type ProductionCompany } from "@/types/movie.type"
import React from "react"

interface Props {
  data: Genre[] | ProductionCompany[]
}

function TagComponents({ data }: Props) {
  if (data.length === 0) return null
  const color =
    (data[0] as ProductionCompany).origin_country !== undefined &&
    data.length > 1
      ? "bg-blue-500"
      : "bg-green-500"

  return (
    <>
      {data.map((genre) => (
        <span
          key={genre.id}
          className={`${color} mx-1 h-fit w-fit rounded px-2 py-1 text-xs font-bold text-white`}
        >
          {genre.name}
        </span>
      ))}
    </>
  )
}

export default TagComponents
