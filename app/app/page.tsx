"use client"

import { Smartphone, Download, Star, CheckCircle } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const features = [
  "Access all videos offline",
  "Prayer time notifications",
  "Qibla direction finder",
  "Daily Quran verses",
  "Bookmarks and favorites",
  "Dark mode support",
]

export default function AppPage() {
  return (
    <MainLayout>
      <div className="px-4 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald to-emerald-light flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Smartphone className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-emerald mb-4">Islam VN Mobile App</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Take Islam VN with you everywhere. Download our mobile app for the best experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <CardWrapper>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">App Features</h2>
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardWrapper>

            <CardWrapper>
              <div className="aspect-[9/16] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <div className="text-center">
                  <Smartphone className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">App Preview</p>
                </div>
              </div>
            </CardWrapper>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-black hover:bg-black/90 text-white rounded-xl h-14 px-8">
              <Download className="w-5 h-5 mr-2" />
              Download for iOS
            </Button>
            <Button size="lg" className="bg-emerald hover:bg-emerald-light text-white rounded-xl h-14 px-8">
              <Download className="w-5 h-5 mr-2" />
              Download for Android
            </Button>
          </div>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-gold fill-gold" />
              ))}
            </div>
            <p className="text-muted-foreground">4.9 rating • 10,000+ downloads</p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
