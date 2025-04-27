import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/Sidebar"
import { AuthProvider } from "@/context/AuthContext"
import { ChatProvider } from "@/context/ChatContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vibby App",
  description: "Find and be found",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ChatProvider>
            <div className="flex min-h-screen bg-black">
              <Sidebar />
              <div className="flex-1 ml-16">{children}</div>
            </div>
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
