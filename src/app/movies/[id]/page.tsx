import { type Movie } from "@/app/movie.type"
import TagComponents from "@/components/TagComponents"
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
        <aside className="relative flex flex-col overflow-hidden md:sticky">
          <picture className="relative mt-4 block h-full w-auto border-b border-black/20 py-36 md:h-[50%]">
            <Image
              fill
              className=" bg-center object-cover md:object-contain"
              src={`https://image.tmdb.org/t/p/w500/${data.poster_path}`}
              alt={data.title}
            />
          </picture>
          <article className="absolute bottom-1 left-6 z-10 mx-auto flex w-full flex-1 place-content-center p-1.5  md:static  lg:w-[50%]">
            <div className="mx-auto flex md:flex-col md:gap-y-2">
              <TagComponents data={data.genres} />
            </div>
            <div className="mx-auto hidden gap-y-2 md:flex md:flex-col ">
              <TagComponents data={data.production_companies} />
            </div>
          </article>
        </aside>
        <article className="flex flex-col items-center gap-y-2 px-2">
          <h1 className="text-4xl font-bold">{data.title}</h1>
          <h2 className="text-balance text-center text-sm font-bold text-white/40 md:text-2xl">
            {data.tagline}
          </h2>
          <p className={`${average.className} text-base md:text-lg lg:text-xl`}>
            {data.overview}
          </p>
        </article>
      </section>
    </main>
  )
}

export default MoviPage
