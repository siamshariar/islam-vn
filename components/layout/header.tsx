"use client"

import Image from "next/image"
import Link from "next/link"
import { Menu, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-background">
      <div className="flex items-center justify-between px-4 lg:px-8 py-3">
        {/* Mobile Menu Button */}
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors">
          <Menu className="w-6 h-6 text-emerald" />
        </button>

        {/* Logo for mobile */}
        <Link href="/" className="lg:hidden">
          <Image src="/images/islam.png" alt="Islam VN" width={100} height={35} className="h-8 w-auto" />
        </Link>

        {/* Slogan - Desktop only */}
        <div className="hidden lg:block flex-1">
          <p className="text-sm text-muted-foreground">
            <span className="text-emerald font-medium">Islam VN</span> - Spreading the light of Islam in Vietnam
          </p>
        </div>

        {/* Contribute Button */}
        <Button
          asChild
          className="bg-gradient-to-r from-emerald to-emerald-light hover:from-emerald-light hover:to-emerald text-white rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <Link href="/donate">
            <Heart className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Contribute</span>
          </Link>
        </Button>
      </div>

      {/* Marquee Slogan - Mobile */}
      <div className="lg:hidden overflow-hidden bg-emerald/5 py-2">
        <div className="animate-marquee whitespace-nowrap flex">
          <span className="mx-4 text-sm text-emerald">
            ✨ Spreading the light of Islam in Vietnam • Learn • Share • Grow Together ✨
          </span>
          <span className="mx-4 text-sm text-emerald">
            ✨ Spreading the light of Islam in Vietnam • Learn • Share • Grow Together ✨
          </span>
        </div>
      </div>
    </header>
  )
}
