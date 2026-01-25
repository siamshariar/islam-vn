"use client"

import { Share2, Facebook, Twitter, Link2, Copy, CheckCircle } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { useState } from "react"

export default function SharePage() {
  const [copied, setCopied] = useState(false)
  const siteUrl = "https://islam.vn"

  const handleCopy = () => {
    navigator.clipboard.writeText(siteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="px-4 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald to-gold flex items-center justify-center mx-auto mb-6">
              <Share2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-emerald mb-4">Share Islam VN</h1>
            <p className="text-muted-foreground text-lg">
              Help spread authentic Islamic knowledge by sharing Islam VN with your friends and family.
            </p>
          </motion.div>

          <CardWrapper className="mb-8">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">Share via Social Media</h2>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-14 rounded-xl justify-start bg-transparent">
                  <Facebook className="w-5 h-5 mr-3 text-blue-600" />
                  Facebook
                </Button>
                <Button variant="outline" className="h-14 rounded-xl justify-start bg-transparent">
                  <Twitter className="w-5 h-5 mr-3 text-sky-500" />
                  Twitter
                </Button>
              </div>
            </div>
          </CardWrapper>

          <CardWrapper>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Copy Link</h2>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={siteUrl} readOnly className="pl-9 rounded-xl bg-muted" />
                </div>
                <Button onClick={handleCopy} className="bg-emerald hover:bg-emerald-light text-white rounded-xl">
                  {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </Button>
              </div>
              {copied && <p className="text-sm text-emerald mt-2">Link copied to clipboard!</p>}
            </div>
          </CardWrapper>
        </div>
      </div>
    )
}

