"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Video, BookOpen, FileText, HelpCircle } from "lucide-react"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/videos", label: "Videos", icon: Video },
  { href: "/books", label: "Books", icon: BookOpen },
  { href: "/articles", label: "Articles", icon: FileText },
  { href: "/qa", label: "Q&A", icon: HelpCircle },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border z-40 pb-safe">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200",
                isActive ? "text-emerald" : "text-muted-foreground hover:text-emerald",
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "fill-emerald/20")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
