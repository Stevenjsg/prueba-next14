export default function Menu({
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
      fill={color}
      width={size}
    >
      <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
    </svg>
  )
}
