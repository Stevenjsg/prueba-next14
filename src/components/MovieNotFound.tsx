import React from "react"
interface Props {
  title?: string
}
export default function MovieNotFound({ title }: Props) {
  return (
    <section className="grid h-screen place-content-center">
      <div className="flex flex-col items-center justify-center">
        <p className="text-4xl font-bold text-red-600">Error 404</p>
        {title !== undefined && (
          <>
            <p className="text-2xl font-bold text-red-900 opacity-60">
              No se ha encontrado resultados para:
            </p>
            <span className="text-lg font-semibold text-gray-400 opacity-60">
              {title}
            </span>
          </>
        )}
      </div>
    </section>
  )
}
