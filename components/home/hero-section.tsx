"use client"

import { BookOpen, PlayCircle, HelpCircle, Star, Moon, Heart } from "lucide-react"

export function HeroSection() {
  return (
    <section className="py-7 px-4 lg:px-8">
      <div
        className="relative overflow-hidden rounded-2xl px-6 py-12 md:px-12 md:py-16"
        style={{
          background: "linear-gradient(90deg, var(--hbnc1) 0%, var(--hbnc2) 50%, var(--hbnc2) 50%, var(--hbnc1) 100%)",
        }}
      >
        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Star className="absolute top-10 left-10 h-6 w-6 text-accent/30 animate-float" />
          <Moon className="absolute top-20 right-20 h-8 w-8 text-primary/20 animate-float-delayed" />
          <BookOpen className="absolute bottom-20 left-20 h-7 w-7 text-primary/25 animate-float" />
          <Heart className="absolute bottom-10 right-10 h-5 w-5 text-accent/35 animate-float-delayed" />
          <Star className="absolute top-1/2 left-1/4 h-4 w-4 text-accent/20 animate-pulse-glow" />
          <Moon className="absolute bottom-1/3 right-1/4 h-5 w-5 text-primary/15 animate-pulse-glow" />
        </div>

        <div className="relative z-10 mx-auto">
        {/* Animated Text */}
        <div className="mb-4 overflow-hidden">
          <p className="text-sm font-medium text-primary uppercase tracking-wider animate-slide-up">
            Welcome to
          </p>
        </div>

        <h1 className="text-3xl font-bold text-foreground md:text-5xl mb-4">
          <span className="text-primary">Islam</span>
          <span className="bg-gradient-to-r from-accent to-yellow-500 bg-clip-text text-transparent">.VN</span>
        </h1>

        <p className="text-lg text-muted-foreground md:text-xl max-w-2xl leading-relaxed">
          Explore a wealth of Islamic resources in Vietnamese. Videos, books, articles, and more – all for you.
        </p>

        {/* Feature highlights */}
        <div className="mt-8 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-sm">
            <PlayCircle className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Educational videos</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-sm">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Book library</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-sm">
            <HelpCircle className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Q&A</span>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}
