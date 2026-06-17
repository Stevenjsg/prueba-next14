import { type Genre, type ProductionCompany } from "@/types/movie.type"
import React from "react"

interface Props {
  data: Genre[] | ProductionCompany[]
}

function TagComponents({ data }: Props) {
  if (data.length === 0) return null
  const isCompany = (data[0] as ProductionCompany).origin_country !== undefined && data.length > 1
  const color = isCompany ? "bg-accent" : "bg-accent-soft"

  return (
    <>
      {data.map((genre) => (
        <span key={genre.id} className={`${color} mx-1 h-fit w-fit rounded px-2 py-1 text-xs font-bold text-white`}>
          {genre.name}
        </span>
      ))}
    </>
  )
}

export default TagComponents
