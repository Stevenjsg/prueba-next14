import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import NavBar from "@/components/NavBar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FilmsCenter",
  description:
    "Descubre el universo del cine en FilmsCenter. Explora las últimas películas, críticas y trailers. ¡Tu centro de películas para los amantes del séptimo arte!",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <h2 className={`py-8 text-center text-4xl font-bold tracking-tighter`}>
          <span className="text-6xl font-bold text-red-700">Films</span>Center
        </h2>
        <NavBar />
        {children}
      </body>
    </html>
  )
}
