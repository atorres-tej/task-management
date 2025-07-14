import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { TasksProvider } from "@/contexts/TasksContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Task Manager - Secure Task Management",
  description: "Manage your tasks efficiently with Microsoft authentication",
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
          <TasksProvider>
            {children}
          </TasksProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
