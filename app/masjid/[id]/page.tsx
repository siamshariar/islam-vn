"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useLayoutEffect } from "react"
import { ArrowLeft, MapPin, Phone, Mail, Clock, Globe, Navigation, ExternalLink } from "lucide-react"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Button } from "@/components/ui/button"

const SCROLL_RESTORE_FLAG = "masjid_scroll_restore_flag"

const masjidData: Record<string, {
  name: string; address: string; phone: string; email: string; hours: string; website: string; description: string;
  mainImage: string; galleryImages: string[]; mapEmbedUrl: string; googleMapsUrl: string;
}> = {
  "1": {
    name: "Jamiul Muslimin Masjid",
    address: "52 Đ. Nguyễn Văn Trỗi, Cầu Kiệu, Hồ Chí Minh, Vietnam",
    phone: "+84 28 3824 6543", email: "contact@jamiulmuslimin.vn", hours: "4:15 AM - 10:00 PM Daily", website: "www.jamiulmuslimin.vn",
    description: "Jamiul Muslimin Masjid is one of the oldest and most prominent mosques in Ho Chi Minh City. Established in the early 20th century by Indian Muslim traders, it serves as a spiritual and community center for Muslims in the area. The mosque offers daily prayers, Friday Jummah, Quran classes, and various Islamic educational programs. Located on Nguyễn Văn Trỗi Street, it's easily accessible for both locals and tourists visiting the city center.",
    mainImage: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFSoYkpscFEThiJ374-kyhqsvmoho1skdbvIXPUCd2pKsxrZpcpUYnZKX_voE7WdgnbNDRzGok4Yawe5sboi_0PigKSJMI0dJcLfY31uAexqy6qW1RjD5I_-738soCndmQVK4Wd7OQ53Mb2=s1360-w1360-h1020-rw",
    galleryImages: [], mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.3!2d106.695!3d10.79!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x5147ddf222a3ee7b!2sJamiul%20Muslimin%20Masjid!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s",
    googleMapsUrl: "https://www.google.com/maps/place/Jamiul+Muslimin+Masjid/data=!4m2!3m1!1s0x0:0x5147ddf222a3ee7b?sa=X&ved=1t:2428&ictx=111",
  },
  "2": {
    name: "Saigon Central Mosque (Masjid Al-Rahim)",
    address: "459 Trần Hưng Đạo, District 5, Ho Chi Minh City, Vietnam",
    phone: "+84 28 3836 2149", email: "info@saigoncentralmosque.vn", hours: "5:00 AM - 9:00 PM Daily", website: "www.saigoncentralmosque.vn",
    description: "Saigon Central Mosque, also known as Masjid Al-Rahim, is a beautiful mosque built in 1935 by South Indian Muslims. It serves the diverse Muslim community in Ho Chi Minh City, including Malaysian, Indonesian, and Indian Muslims. The mosque features stunning architecture with a blend of South Asian and local Vietnamese design elements.",
    mainImage: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAH2-MWag-sgPWnch6SxxR8V0SUajSjQUgDAKYJ75nSEQv4V5BDCBQYJ5EmfKoWJsfvjYPLz2YdNFhxkr3lbTFgfpDfGos-vYIrmIZjRUXokL2mFhQlw0LrIeYSPM22I3UlooStcoQ=s1360-w1360-h1020-rw",
    galleryImages: [], mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5!2d106.7013389!3d10.7699972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4060024acb%3A0x105a87b0ea06ff48!2sAl%20Rahim%20Masjid!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s",
    googleMapsUrl: "https://www.google.com/maps/place/Al+Rahim+Masjid/",
  },
  "3": {
    name: "Masjid Jamiul Azhar Mosque",
    address: "Tổ 8, ấp Châu Giang, Xã Châu Phong, An Giang Province, Vietnam",
    phone: "+84 941 852 762", email: "info@jamuilazhar.vn", hours: "Open 24 hours", website: "www.jamuilazhar.vn",
    description: "Masjid Jamiul Azhar Mosque is a prominent Islamic center serving the Cham Muslim community in An Giang Province. Located in Châu Giang village along the Hau River in the Mekong Delta, it features traditional Islamic architecture adapted to the tropical environment.",
    mainImage: "https://file3.qdnd.vn/data/images/3/2019/02/26/hieu_ta/1%2025.jpg?dpi=150&quality=100&w=500",
    galleryImages: [], mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.4!2d105.132!3d10.528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x4dd84b2d04009de8!2sJamuil%20Azhar%20Mosque!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s",
    googleMapsUrl: "https://www.google.com/maps/place/Jamuil+Azhar+Mosque/",
  },
  "4": {
    name: "Masjid Mubarak (Cham Mosque)",
    address: "Châu Giang Village, An Giang Province, Vietnam",
    phone: "+84 296 3861 234", email: "info@masjidmubarak.vn", hours: "Open 24 hours", website: "www.masjidmubarak.vn",
    description: "Masjid Mubarak is a beautiful Cham mosque located in Chau Giang Village, An Giang Province. It represents the rich Islamic heritage of the Cham people in the Mekong Delta.",
    mainImage: "https://evivatour.com/wp-content/uploads/2021/09/Masjid-Jamiul-Azhar-Mosque-An-Giang.jpg",
    galleryImages: [], mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.5!2d105.135!3d10.53!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xabcdef1234567890!2sMasjid%20Mubarak!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s",
    googleMapsUrl: "https://www.google.com/maps/search/masjid+mubarak+vietnam/",
  },
  "5": {
    name: "Da Nang Mosque (Masjid Al-Akbar)",
    address: "123 Nguyễn Văn Linh, Da Nang, Vietnam",
    phone: "+84 236 3823 789", email: "info@danangmosque.vn", hours: "5:30 AM - 9:30 PM Daily", website: "www.danangmosque.vn",
    description: "Da Nang Mosque, also known as Masjid Al-Akbar, serves the growing Muslim community in central Vietnam's largest city. The mosque welcomes both local Muslims and international visitors.",
    mainImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtL7fOkALJi-tchGSfuqS96W3ngPl2m_bbyw&s",
    galleryImages: [], mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.2!2d107.996563!3d15.994938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x7167034678468850957!2sDa%20Nang%20Mosque!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s",
    googleMapsUrl: "https://www.google.com/maps?ll=15.994938,107.996563&z=14",
  },
  "6": {
    name: "Hanoi Muslim Community Center",
    address: "45 Hàng Lược, Hoàn Kiếm, Hanoi, Vietnam",
    phone: "+84 24 3826 1234", email: "info@hanoimuslim.vn", hours: "6:00 AM - 9:00 PM Daily", website: "www.hanoimuslim.vn",
    description: "The Hanoi Muslim Community Center, also known as Masjid Al-Noor, is the main Islamic center in Vietnam's capital. Located in the historic Old Quarter, it serves Hanoi's Muslim residents and visitors.",
    mainImage: "https://img2.beritasatu.com/cache/jakartaglobe/960x620-3/2015/01/DSC_1892.jpg",
    galleryImages: [], mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.9!2d105.8489907!3d21.0386046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xabcdef1234567890!2sHanoi%20Mosque!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s",
    googleMapsUrl: "https://www.google.com/maps/search/Hanoi+Muslim+Community+Center/",
  },
}

export default function MasjidDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const masjid = masjidData[id] || masjidData["1"]

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    const prevScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = "manual"
    document.documentElement.style.scrollBehavior = "auto"
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    return () => {
      window.history.scrollRestoration = prevScrollRestoration
      document.documentElement.style.scrollBehavior = ""
    }
  }, [])

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault()
    sessionStorage.setItem(SCROLL_RESTORE_FLAG, "true")
    if (window.history.length > 2) {
      router.back()
    } else {
      router.push('/masjid')
    }
  }

  return (
    <div className="px-4 lg:px-8 py-8">
      <a href="/masjid" onClick={handleBack} className="inline-flex items-center gap-2 text-emerald hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Directory
      </a>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CardWrapper>
            <div className="aspect-video overflow-hidden bg-gray-100">
              <img
                src={masjid.mainImage}
                alt={masjid.name}
                className="w-full h-full object-cover"
                onError={(e) => { const t = e.target as HTMLImageElement; t.onerror = null; t.src = `https://placehold.co/1200x600/059669/FFFFFF?text=${encodeURIComponent(masjid.name)}` }}
              />
            </div>
            <div className="p-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-emerald mb-4">{masjid.name}</h1>
              <p className="text-muted-foreground leading-relaxed">{masjid.description}</p>
            </div>
          </CardWrapper>

          <CardWrapper className="mt-6">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald" />
                Location & Directions
              </h2>
            </div>
            <div className="aspect-video w-full bg-gray-100">
              <iframe src={masjid.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`${masjid.name} Location Map`} className="w-full h-full" />
            </div>
            <div className="p-4 flex justify-center">
              <Button className="bg-emerald hover:bg-emerald-light text-white rounded-xl" onClick={() => window.open(masjid.googleMapsUrl, '_blank')}>
                <Navigation className="w-4 h-4 mr-2" /> Get Directions <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardWrapper>
        </div>

        <div>
          <CardWrapper>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-4">
                {[
                  { icon: MapPin, label: "Address", value: masjid.address },
                  { icon: Phone, label: "Phone", value: masjid.phone, href: `tel:${masjid.phone}` },
                  { icon: Mail, label: "Email", value: masjid.email, href: `mailto:${masjid.email}` },
                  { icon: Clock, label: "Operating Hours", value: masjid.hours },
                  { icon: Globe, label: "Website", value: masjid.website, href: `https://${masjid.website}` },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-emerald/5 rounded-xl hover:bg-emerald/10 transition-colors">
                    <item.icon className="w-5 h-5 text-emerald mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm text-muted-foreground hover:text-emerald">{item.value}</a>
                      ) : (
                        <p className="text-sm text-muted-foreground">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardWrapper>

          <CardWrapper className="mt-6">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Prayer Times Today</h2>
              <div className="space-y-2">
                {[
                  { name: "Fajr", time: "4:30 AM" }, { name: "Dhuhr", time: "11:45 AM" }, { name: "Asr", time: "3:15 PM" },
                  { name: "Maghrib", time: "6:10 PM" }, { name: "Isha", time: "7:30 PM" },
                ].map((prayer, index) => (
                  <div key={prayer.name} className={`flex justify-between p-2.5 ${index % 2 === 0 ? 'bg-emerald/5' : ''} rounded-lg`}>
                    <span className="font-medium">{prayer.name}</span>
                    <span className="text-emerald font-medium">{prayer.time}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">* Prayer times are approximate. Please confirm with the masjid.</p>
            </div>
          </CardWrapper>
        </div>
      </div>
    </div>
  )
}