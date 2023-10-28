"use client"
import { useRouter } from "next/navigation"

interface Props {
  children?: React.ReactNode
  className?: string
}

export default function BackButtom({ children, className = "" }: Props) {
  const router = useRouter()
  function handleClick() {
    router.back()
  }
  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  )
}
