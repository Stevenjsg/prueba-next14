import type { Metadata, ResolvingMetadata } from "next"
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
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = params
  const results = (await getMovisById({ movieId: id })) as Movie

  return {
    title: results.title,
    description: results.overview,
  }
}

async function MoviPage({ params }: Props) {
  const { id } = params
  const data = (await getMovisById({ movieId: id })) as Movie
  const year = new Date(data.release_date).getFullYear()
  return (
    <main className="flex flex-col place-content-center py-4">
      <section className="relative mx-auto grid w-[80%]  grid-cols-1 gap-x-2 overflow-y-hidden md:grid-cols-2">
        <aside className="relative flex flex-col">
          <picture className="animate-fade-in relative block h-[500px] w-auto lg:h-[600px]">
            <Image
              fill
              sizes="100vw"
              style={{ objectFit: "contain" }}
              src={`https://image.tmdb.org/t/p/w500/${data.poster_path}`}
              alt={data.title}
            />
          </picture>
          <article className="absolute bottom-0 z-10 mx-auto flex w-full flex-1 place-content-center p-1.5  lg:static lg:w-[50%]">
            <div className="mx-auto flex md:flex-col md:gap-y-2">
              <TagComponents data={data.genres} />
            </div>
            <div className="mx-auto hidden gap-y-2 md:flex md:flex-col ">
              <TagComponents data={data.production_companies} />
            </div>
          </article>
        </aside>
        <article className="flex flex-col items-center gap-y-2 px-2">
          <h1 className="text-balance text-4xl font-bold">{data.title}</h1>
          <h2 className="text-balance text-center text-2xl font-semibold tracking-tight text-black/40 dark:text-white/40 md:text-2xl">
            {data.tagline}
          </h2>
          <p className="font-semibold opacity-40">{year}</p>
          <p className={`${average.className} text-base md:text-lg lg:text-xl`}>
            {data.overview}
          </p>
        </article>
      </section>
    </main>
  )
}

export default MoviPage
