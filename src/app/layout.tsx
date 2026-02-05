import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "next-themes"
import { Navbar } from "@/components/Navbar"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Witalij Rapicki – Portfolio",
  description: "Full-Stack • DevOps • TypeScript • AWS • Terraform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}