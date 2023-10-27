import { type Movie } from "@/app/movie.type"
import { getMovisById } from "@/services/Movies"
import { Average } from "next/font/google"
import Image from "next/image"

import React from "react"

const average = Average({ weight: "400", subsets: ["latin"] })

interface Props {
  params: {
    id: string
  }
}

async function MoviPage({ params }: Props) {
  const { id } = params
  const data = (await getMovisById({ movieId: id })) as Movie
  return (
    <main className="flex flex-col place-content-center py-4">
      <section className="relative mx-auto grid h-screen w-[80%] grid-cols-1 gap-x-2  md:grid-cols-2">
        <aside className="relative overflow-hidden md:sticky">
          <picture className="relative mt-4 block h-full w-auto border-b border-black/20 py-36 md:h-[50%]">
            <Image
              fill
              className=" bg-center object-cover md:object-contain"
              src={`https://image.tmdb.org/t/p/w500/${data.poster_path}`}
              alt={data.title}
            />
          </picture>
          <article className="absolute bottom-1 z-10 mx-auto flex w-[50%] flex-1 place-content-center  p-1.5  md:static">
            <div className="mx-auto flex md:flex-col md:gap-y-2">
              {data.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="mx-1 rounded bg-green-500 px-2 py-1 text-xs font-bold text-white"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            <div className="mx-auto hidden gap-y-2 md:flex md:flex-col ">
              {data.production_companies.map((company) => (
                <span
                  key={company.id}
                  className="mx-1 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white"
                >
                  {company.name}
                </span>
              ))}
            </div>
            <div className="mx-auto hidden gap-y-2 md:flex md:flex-col ">
              {data.production_countries.map((country) => (
                <span
                  key={country.iso_3166_1}
                  className="mx-1 rounded bg-blue-500 px-2 py-1 text-xs font-bold text-white"
                >
                  {country.name}
                </span>
              ))}
            </div>
          </article>
        </aside>
        <article className="flex flex-col items-center gap-y-2 px-2">
          <h1 className="text-4xl font-bold">{data.title}</h1>
          <p className={`${average.className} text-balance text-lg lg:text-xl`}>
            {data.overview}
          </p>
        </article>
      </section>
    </main>
  )
}

export default MoviPage
