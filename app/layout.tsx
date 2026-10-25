import type React from "react"
import type { Metadata } from "next"
import { Inter, Merriweather, Fraunces } from "next/font/google"
import "./globals.css"
import "./themes.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})
const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
  variable: "--font-merriweather",
})

const fraunces = Fraunces({ subsets: ["latin"], axes: ["SOFT", "WONK"], display: "swap", variable: "--font-fraunces" })

export const metadata: Metadata = {
  title: "TFBD Events",
  description: "Global hub for Tribal Fusion Belly Dance events",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-theme="bloom"
      className={`${inter.variable} ${merriweather.variable} ${fraunces.variable} antialiased`}
    >
      <body className="bg-(--color-cream) text-(--color-brand) font-sans">
        {children}
      </body>
    </html>
  )
}
