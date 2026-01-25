"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, MapPin, Phone, Clock, ChevronRight } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Input } from "@/components/ui/input"

const masjids = [
  {
    id: "1",
    name: "Masjid Jamiul Muslimin",
    address: "66 Dong Du, District 1, Ho Chi Minh City",
    phone: "+84 28 3824 6543",
    hours: "5:00 AM - 10:00 PM",
    image: "/placeholder.svg?height=200&width=350",
  },
  {
    id: "2",
    name: "Saigon Central Mosque",
    address: "459 Tran Hung Dao, District 5, Ho Chi Minh City",
    phone: "+84 28 3836 2149",
    hours: "5:00 AM - 9:00 PM",
    image: "/placeholder.svg?height=200&width=350",
  },
  {
    id: "3",
    name: "An Giang Mosque",
    address: "Chau Giang, Chau Phu, An Giang Province",
    phone: "+84 296 3861 234",
    hours: "5:00 AM - 8:00 PM",
    image: "/placeholder.svg?height=200&width=350",
  },
  {
    id: "4",
    name: "Ninh Thuan Cham Mosque",
    address: "Phan Rang, Ninh Thuan Province",
    phone: "+84 259 3822 456",
    hours: "5:00 AM - 9:00 PM",
    image: "/placeholder.svg?height=200&width=350",
  },
  {
    id: "5",
    name: "Da Nang Mosque",
    address: "123 Nguyen Van Linh, Da Nang",
    phone: "+84 236 3823 789",
    hours: "5:30 AM - 9:30 PM",
    image: "/placeholder.svg?height=200&width=350",
  },
  {
    id: "6",
    name: "Hanoi Muslim Community Center",
    address: "45 Hang Luoc, Hoan Kiem, Hanoi",
    phone: "+84 24 3826 1234",
    hours: "6:00 AM - 9:00 PM",
    image: "/placeholder.svg?height=200&width=350",
  },
]

export default function MasjidPage() {
  const [search, setSearch] = useState("")

  const filteredMasjids = masjids.filter(
    (masjid) =>
      masjid.name.toLowerCase().includes(search.toLowerCase()) ||
      masjid.address.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="px-4 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald mb-2">Masjid Directory</h1>
            <p className="text-muted-foreground">Find mosques and prayer spaces in Vietnam</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search masjids..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMasjids.map((masjid, index) => (
            <CardWrapper key={masjid.id} delay={index * 0.05}>
              <Link href={`/masjid/${masjid.id}`}>
                <div className="aspect-video relative">
                  <img
                    src={masjid.image || "/placeholder.svg"}
                    alt={masjid.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-3">{masjid.name}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 text-emerald flex-shrink-0" />
                      <span className="line-clamp-2">{masjid.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald" />
                      <span>{masjid.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald" />
                      <span>{masjid.hours}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-emerald font-medium text-sm">
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            </CardWrapper>
          ))}
        </div>
      </div>
    )
}
