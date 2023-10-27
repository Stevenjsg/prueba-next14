"use client"
import { useRouter } from "next/navigation"

interface Props {
  children?: React.ReactNode
}

export default function BackButtom({ children }: Props) {
  const router = useRouter()
  function handleClick() {
    router.back()
  }
  return <button onClick={handleClick}>{children}</button>
}
