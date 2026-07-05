"use client"

import type React from "react"

import { useState } from "react"
import { NewSidebar } from "./new-sidebar"
import { Header } from "./header"
import { BottomNav } from "./bottom-nav"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <NewSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-72">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-8">{children}</main>
      </div>

      <BottomNav />
    </div>
  )
}
