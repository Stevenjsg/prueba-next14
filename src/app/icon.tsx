import { ImageResponse } from "next/og"
import { Inter } from "next/font/google"

// Route segment config

// Image metadata
const inter = Inter({ subsets: ["latin"] })
export const size = {
  width: 64,
  height: 64,
}
export const contentType = "image/png"

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        className={inter.className}
        style={{
          fontSize: 30,
          fontWeight: 400,
          borderRadius: "30%",
          background: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <span
          style={{
            fontSize: 50,
            color: "rgb(185 28 28)",
            fontWeight: 700,
          }}
        >
          F
        </span>
        C
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    },
  )
}
