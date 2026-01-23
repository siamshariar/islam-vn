"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import Image from "next/image"

const knowledgeCards = [
  {
    id: "quran",
    title: "Quran.vn",
    description: "Explore the Holy Quran in Vietnamese with translations, tafsir, and audio recitations.",
    href: "https://quran.vn",
    logo: "/images/quran-logo.png",
    gradient: "from-emerald/20 via-emerald/10 to-transparent",
    hoverGradient: "group-hover:from-emerald/30 group-hover:via-emerald/20",
    accentColor: "emerald",
  },
  {
    id: "hadith",
    title: "Hadith.vn",
    description: "Discover authentic Hadith collections with Vietnamese translations and explanations.",
    href: "https://hadith.vn",
    logo: "/images/hadith-logo.png",
    gradient: "from-gold/20 via-orange/10 to-transparent",
    hoverGradient: "group-hover:from-gold/30 group-hover:via-orange/20",
    accentColor: "gold",
  },
]

export function KnowledgeSection() {
  return (
    <section className="py-16 px-4 lg:px-8">
      {/* Section Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald/10 text-emerald text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Deepen Your Knowledge</span>
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
          <span className="text-foreground">Explore the </span>
          <span className="bg-gradient-to-r from-emerald via-gold to-orange bg-clip-text text-transparent">
            Primary Sources
          </span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Access the Quran and Hadith in Vietnamese - the two foundational texts of Islamic knowledge.
        </p>
      </motion.div>

      {/* Mega Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {knowledgeCards.map((card, index) => (
          <motion.a
            key={card.id}
            href={card.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-3xl bg-card border border-border/50 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Glassmorphism background gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.gradient} ${card.hoverGradient} transition-all duration-500`}
            />

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles className={`w-24 h-24 ${card.accentColor === "emerald" ? "text-emerald" : "text-gold"}`} />
            </div>

            {/* Content */}
            <div className="relative p-8 lg:p-10 min-h-[280px] flex flex-col">
              {/* Logo */}
              <div className="mb-6">
                <Image
                  src={card.logo || "/placeholder.svg"}
                  alt={card.title}
                  width={160}
                  height={48}
                  className="h-12 w-auto"
                />
              </div>

              {/* Description - revealed on hover */}
              <div className="flex-1 flex flex-col justify-end">
                <motion.p
                  className="text-muted-foreground mb-6 text-base lg:text-lg leading-relaxed"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 1 }}
                >
                  {card.description}
                </motion.p>

                {/* CTA Button */}
                <div
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 w-fit ${
                    card.accentColor === "emerald"
                      ? "bg-emerald/10 text-emerald group-hover:bg-emerald group-hover:text-white"
                      : "bg-gold/10 text-gold group-hover:bg-gold group-hover:text-white"
                  }`}
                >
                  <span>Read Now</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Hover border glow effect */}
            <div
              className={`absolute inset-0 rounded-3xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                card.accentColor === "emerald" ? "border-emerald/30" : "border-gold/30"
              }`}
            />
          </motion.a>
        ))}
      </div>
    </section>
  )
}
