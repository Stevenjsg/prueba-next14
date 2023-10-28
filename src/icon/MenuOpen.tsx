export default function MenuOpen({
  className = "",
  size = 24,
  color = "currentColor",
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      height={size}
      viewBox="0 -960 960 960"
      width={size}
      fill={color}
    >
      <path d="M120-240v-80h520v80H120Zm664-40L584-480l200-200 56 56-144 144 144 144-56 56ZM120-440v-80h400v80H120Zm0-200v-80h520v80H120Z" />
    </svg>
  )
}
