"use client"

import { Heart, CreditCard, Building, Smartphone, CheckCircle } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const donationTiers = [
  { amount: 100000, label: "100,000 VND", description: "Support educational materials" },
  { amount: 500000, label: "500,000 VND", description: "Fund a community event" },
  { amount: 1000000, label: "1,000,000 VND", description: "Sponsor a student" },
  { amount: 5000000, label: "5,000,000 VND", description: "Major project support" },
]

const impactItems = [
  "Produce educational videos in Vietnamese",
  "Translate Islamic books for local readers",
  "Support new Muslims in their journey",
  "Maintain and expand our digital resources",
  "Organize community gatherings and events",
]

export default function DonatePage() {
  return (
    <div className="px-4 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald to-gold flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-emerald mb-4">Support Islam VN</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Your generous contribution helps us spread authentic Islamic knowledge and support the Muslim community in
              Vietnam.
            </p>
          </motion.div>

          {/* Donation Tiers */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {donationTiers.map((tier, index) => (
              <CardWrapper key={tier.amount} delay={index * 0.1}>
                <button className="w-full p-5 text-center hover:bg-emerald/5 transition-colors">
                  <p className="text-2xl font-bold text-emerald mb-1">{tier.label}</p>
                  <p className="text-xs text-muted-foreground">{tier.description}</p>
                </button>
              </CardWrapper>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Methods */}
            <CardWrapper>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">Payment Methods</h2>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start h-14 rounded-xl bg-transparent">
                    <CreditCard className="w-5 h-5 mr-3 text-emerald" />
                    Credit / Debit Card
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-14 rounded-xl bg-transparent">
                    <Building className="w-5 h-5 mr-3 text-emerald" />
                    Bank Transfer
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-14 rounded-xl bg-transparent">
                    <Smartphone className="w-5 h-5 mr-3 text-emerald" />
                    MoMo / ZaloPay
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-emerald/5 rounded-xl">
                  <h3 className="font-semibold mb-2">Bank Transfer Details</h3>
                  <p className="text-sm text-muted-foreground">
                    Bank: Vietcombank
                    <br />
                    Account: 1234567890
                    <br />
                    Name: Islam VN Foundation
                  </p>
                </div>
              </div>
            </CardWrapper>

            {/* Impact */}
            <CardWrapper>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">Your Impact</h2>
                <p className="text-muted-foreground mb-4">Every donation, no matter the size, helps us:</p>
                <ul className="space-y-3">
                  {impactItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-4 bg-gold/10 rounded-xl">
                  <p className="text-sm text-gold font-medium">
                    "The example of those who spend their wealth in the way of Allah is like a seed which grows seven
                    spikes..." - Quran 2:261
                  </p>
                </div>
              </div>
            </CardWrapper>
          </div>
        </div>
      </div>
    )
}

