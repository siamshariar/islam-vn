"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <MainLayout>
      <div className="px-4 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-emerald mb-4">Contact Us</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions about Islam or need assistance? We're here to help. Reach out to us through the form below
              or use our contact information.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <CardWrapper>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="What is this about?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Write your message here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="min-h-[150px] rounded-xl"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-emerald hover:bg-emerald-light text-white rounded-xl h-12"
                    disabled={submitted}
                  >
                    {submitted ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Message Sent!
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardWrapper>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <CardWrapper>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald/10 flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-emerald" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Email Us</h3>
                  <p className="text-muted-foreground text-sm mb-2">We'll respond within 24 hours</p>
                  <a href="mailto:contact@islam.vn" className="text-emerald font-medium hover:underline">
                    contact@islam.vn
                  </a>
                </div>
              </CardWrapper>

              <CardWrapper>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mb-4">
                    <Phone className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Call Us</h3>
                  <p className="text-muted-foreground text-sm mb-2">Mon-Fri from 8am to 6pm</p>
                  <a href="tel:+84283826543" className="text-emerald font-medium hover:underline">
                    +84 28 382 6543
                  </a>
                </div>
              </CardWrapper>

              <CardWrapper>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-orange/10 flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-orange" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Visit Us</h3>
                  <p className="text-muted-foreground text-sm">
                    66 Dong Du Street, District 1<br />
                    Ho Chi Minh City, Vietnam
                  </p>
                </div>
              </CardWrapper>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
