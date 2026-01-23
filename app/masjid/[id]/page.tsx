"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, Phone, Mail, Clock, Globe, Navigation } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Button } from "@/components/ui/button"

const masjidData: Record<
  string,
  {
    name: string
    address: string
    phone: string
    email: string
    hours: string
    website: string
    description: string
    image: string
  }
> = {
  "1": {
    name: "Masjid Jamiul Muslimin",
    address: "66 Dong Du, District 1, Ho Chi Minh City, Vietnam",
    phone: "+84 28 3824 6543",
    email: "contact@jamiulmuslimin.vn",
    hours: "5:00 AM - 10:00 PM Daily",
    website: "www.jamiulmuslimin.vn",
    description:
      "Masjid Jamiul Muslimin is one of the oldest and most prominent mosques in Ho Chi Minh City. Established in the early 20th century, it serves as a spiritual and community center for Muslims in the area. The mosque offers daily prayers, Friday Jummah, Quran classes, and various Islamic educational programs.",
    image: "/placeholder.svg?height=400&width=800",
  },
}

export default function MasjidDetailPage() {
  const params = useParams()
  const id = params.id as string
  const masjid = masjidData[id] || masjidData["1"]

  return (
    <MainLayout>
      <div className="px-4 lg:px-8 py-8">
        <Link href="/masjid" className="inline-flex items-center gap-2 text-emerald hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CardWrapper>
              <div className="aspect-video">
                <img
                  src={masjid.image || "/placeholder.svg"}
                  alt={masjid.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-emerald mb-4">{masjid.name}</h1>
                <p className="text-muted-foreground leading-relaxed">{masjid.description}</p>
              </div>
            </CardWrapper>

            {/* Map placeholder */}
            <CardWrapper className="mt-6">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-emerald mx-auto mb-2" />
                  <p className="text-muted-foreground">Google Maps integration</p>
                  <Button className="mt-4 bg-emerald hover:bg-emerald-light text-white rounded-xl">
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </div>
            </CardWrapper>
          </div>

          {/* Contact Info Card */}
          <div>
            <CardWrapper>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-emerald/5 rounded-xl">
                    <MapPin className="w-5 h-5 text-emerald mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{masjid.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-emerald/5 rounded-xl">
                    <Phone className="w-5 h-5 text-emerald mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{masjid.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-emerald/5 rounded-xl">
                    <Mail className="w-5 h-5 text-emerald mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{masjid.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-emerald/5 rounded-xl">
                    <Clock className="w-5 h-5 text-emerald mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Hours</p>
                      <p className="text-sm text-muted-foreground">{masjid.hours}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-emerald/5 rounded-xl">
                    <Globe className="w-5 h-5 text-emerald mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Website</p>
                      <p className="text-sm text-muted-foreground">{masjid.website}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardWrapper>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
