"use client"
import MenuOpen from "@/icon/MenuOpen"
import Menu from "@/icon/menu"
import Link from "next/link"
import { useState } from "react"

function ScrollMenu() {
  const [isOpen, setIsOpen] = useState(false)
  function handleClik() {
    setIsOpen((prev) => !prev)
  }
  const className = `${
    isOpen ? "block animate-fade-in" : "animate-fade-out hidden"
  } h-auto w-40 border border-white/20 bg-gray-900 rounded absolute z-10 py-2 px-0.5 bottom-o right-0 `
  return (
    <div className="relative mb-2">
      <button
        onClick={handleClik}
        className="flex h-10 w-10 items-center justify-center rounded bg-gray-400 text-black hover:text-white "
      >
        {isOpen ? <MenuOpen /> : <Menu />}
      </button>
      <div className={className}>
        <ul className="flex flex-col font-medium text-white ">
          <li className="rounded px-4 py-1 hover:bg-gray-50/20  hover:text-red-300">
            <Link href="/">Popular</Link>
          </li>
          <li className="rounded px-4  py-1 hover:bg-gray-50/20  hover:text-red-300">
            <Link href="/">Top Rated</Link>
          </li>
          <li className="rounded px-4 py-1 hover:bg-gray-50/20 hover:text-red-300 ">
            <Link href="/">Upcoming</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ScrollMenu
