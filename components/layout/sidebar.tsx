"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import {
  Home,
  Video,
  BookOpen,
  FileText,
  HelpCircle,
  MapPin,
  Mail,
  Heart,
  Smartphone,
  Share2,
  X,
  Users,
  UserPlus,
  Book,
  Library,
  ExternalLink,
  Newspaper,
} from "lucide-react"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/videos", label: "Videos", icon: Video },
  { href: "/books", label: "Books", icon: BookOpen },
  { href: "/articles", label: "Articles", icon: FileText },
  { href: "/qa", label: "Q&A", icon: HelpCircle },
  { href: "/new-muslim", label: "New Muslim", icon: UserPlus },
  { href: "/non-muslim", label: "Non-Muslim", icon: Users },
  { href: "/masjid", label: "Masjid Directory", icon: MapPin },
  { href: "/contact", label: "Contact", icon: Mail },
  { href: "/donate", label: "Donate", icon: Heart },
  { href: "/app", label: "Mobile App", icon: Smartphone },
  { href: "/share", label: "Share", icon: Share2 },
]

const externalLinks = [
  { href: "https://quran.vn", label: "Read Quran", icon: Book },
  { href: "https://hadith.vn", label: "Read Hadith", icon: Library },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-card border-r border-sidebar-border shadow-xl z-40">
        <div className="p-6 border-b border-sidebar-border">
          <Link href="/" className="block">
            <Image src="/images/islam.png" alt="Islam VN" width={140} height={50} className="h-10 w-auto" />
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200",
                  isActive
                    ? "bg-emerald text-white shadow-md"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-emerald",
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}

          <div className="mt-4 pt-4 border-t border-sidebar-border">
            <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              External Resources
            </p>
            {externalLinks.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent hover:text-emerald group"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium flex-1">{item.label}</span>
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              )
            })}
          </div>
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground text-center">
            Powered By - <span className="text-emerald font-medium">Islam VN</span>
          </p>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={onClose} />}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed left-0 top-0 h-full w-72 bg-card border-r border-sidebar-border shadow-xl z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <Link href="/" onClick={onClose}>
            <Image src="/images/islam.png" alt="Islam VN" width={120} height={40} className="h-8 w-auto" />
          </Link>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="overflow-y-auto py-4 px-3 h-[calc(100%-80px)] scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200",
                  isActive
                    ? "bg-emerald text-white shadow-md"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-emerald",
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}

          <div className="mt-4 pt-4 border-t border-sidebar-border">
            <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              External Resources
            </p>
            {externalLinks.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent hover:text-emerald group"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium flex-1">{item.label}</span>
                  <ExternalLink className="w-4 h-4 opacity-50" />
                </a>
              )
            })}
          </div>
        </nav>
      </aside>
    </>
  )
}
