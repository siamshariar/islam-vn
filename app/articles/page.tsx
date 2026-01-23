"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Clock, ChevronRight, Tag } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Input } from "@/components/ui/input"

export const articles = [
  {
    id: "1",
    title: "The Five Pillars of Islam: A Comprehensive Guide",
    category: "Basics",
    readTime: "8 min",
    publishedDate: "January 15, 2026",
    excerpt: "Discover the fundamental principles that form the foundation of Islamic faith and practice.",
    featureImage: "/islamic-prayer-guide.jpg",
    content: `The Five Pillars of Islam are the foundation of Muslim life and practice. These fundamental acts of worship define what it means to be a Muslim and connect believers to Allah and the global Muslim community.

## 1. Shahada: Declaration of Faith

The Shahada is the Islamic declaration of faith: "I bear witness that there is no deity but Allah, and I bear witness that Muhammad is the messenger of Allah." This simple yet profound statement is the entry point into Islam and the foundation upon which all other pillars rest.

## 2. Salah: The Five Daily Prayers

Muslims perform five obligatory prayers each day at prescribed times. These prayers serve as a direct link between the worshipper and Allah, providing moments of spiritual reflection and connection throughout the day.

## 3. Zakat: Charitable Giving

Zakat is the obligatory charitable contribution that purifies one's wealth. Muslims who meet certain financial thresholds must give 2.5% of their qualifying wealth annually to those in need.

## 4. Sawm: Fasting During Ramadan

During the holy month of Ramadan, Muslims fast from dawn to sunset, abstaining from food, drink, and other physical needs. This practice develops self-discipline, empathy for those less fortunate, and spiritual growth.

## 5. Hajj: Pilgrimage to Mecca

The Hajj is a pilgrimage to Mecca that every able-bodied Muslim who can afford it must undertake at least once in their lifetime. It occurs during the Islamic month of Dhul-Hijjah and brings together Muslims from around the world in a powerful display of unity and devotion.

## Conclusion

These five pillars work together to create a comprehensive spiritual practice that shapes every aspect of a Muslim's life. By fulfilling these obligations, Muslims strengthen their relationship with Allah and contribute to a more just and compassionate society.`,
  },
  {
    id: "2",
    title: "Understanding Islamic Ethics in Daily Life",
    category: "Lifestyle",
    readTime: "6 min",
    publishedDate: "January 10, 2026",
    excerpt: "Learn how Islamic principles can guide your everyday decisions and interactions.",
    featureImage: null,
    content: `Islamic ethics provide a comprehensive framework for living a purposeful and morally upright life. These principles, derived from the Quran and Sunnah, offer guidance for every aspect of daily existence.

## The Foundation of Islamic Ethics

At the heart of Islamic ethics lies the concept of Taqwa - consciousness of Allah in all actions. This awareness encourages Muslims to consider the moral implications of their choices and strive for excellence in character.

## Honesty and Truthfulness

Islam places tremendous emphasis on truthfulness in all dealings. The Prophet Muhammad (peace be upon him) said, "Truthfulness leads to righteousness, and righteousness leads to Paradise."

## Justice and Fairness

Muslims are commanded to uphold justice even if it goes against their own interests. The Quran states: "O you who believe! Stand out firmly for justice, as witnesses to Allah."

## Kindness and Compassion

Treating others with kindness and compassion is central to Islamic teaching. This extends to family, neighbors, strangers, and even animals.

## Practical Application

Implementing these ethics in daily life means being honest in business, fair in judgment, kind to those around you, and constantly aware of your accountability to Allah.`,
  },
  {
    id: "3",
    title: "The Importance of Seeking Knowledge in Islam",
    category: "Education",
    readTime: "5 min",
    publishedDate: "January 5, 2026",
    excerpt: "Explore the emphasis Islam places on learning and intellectual growth.",
    featureImage: "/islamic-lecture-mosque.jpg",
    content: `Islam places extraordinary emphasis on the pursuit of knowledge. The very first revelation to Prophet Muhammad (peace be upon him) began with the word "Read" (Iqra), establishing the central importance of learning in Islamic tradition.

## Knowledge as Worship

Seeking knowledge in Islam is considered an act of worship. The Prophet said, "Seeking knowledge is an obligation upon every Muslim." This obligation extends to both religious and worldly knowledge.

## Types of Knowledge

Islamic tradition recognizes various types of beneficial knowledge:
- Religious knowledge (Quran, Hadith, Fiqh)
- Scientific knowledge
- Practical skills and trades
- Arts and literature

## The Golden Age of Islamic Scholarship

During the Islamic Golden Age, Muslim scholars made groundbreaking contributions to mathematics, astronomy, medicine, and philosophy, demonstrating Islam's encouragement of intellectual pursuit.

## Continuous Learning

The pursuit of knowledge in Islam is a lifelong journey. The Prophet Muhammad said, "Seek knowledge from the cradle to the grave."`,
  },
  {
    id: "4",
    title: "Building a Strong Muslim Community in Vietnam",
    category: "Community",
    readTime: "7 min",
    publishedDate: "December 28, 2025",
    excerpt: "Strategies and insights for fostering unity among Muslims in Vietnam.",
    featureImage: null,
    content: `Building a strong Muslim community requires dedication, cooperation, and a shared vision. In Vietnam, where Muslims represent a minority population, community building takes on special importance.

## Understanding the Vietnamese Muslim Community

Muslims in Vietnam are diverse, including indigenous Cham Muslims, Vietnamese converts, and expatriate communities. This diversity is a strength that enriches community life.

## Establishing Prayer Spaces

Creating accessible prayer spaces is fundamental to community building. Mosques serve not only as places of worship but as community centers where Muslims gather, learn, and support each other.

## Education and Youth Development

Investing in Islamic education for youth ensures the continuation of faith across generations. Programs should balance religious instruction with secular education.

## Interfaith Dialogue

Building bridges with other religious communities promotes understanding and harmony. Muslims in Vietnam can serve as ambassadors of Islamic values through positive engagement.

## Social Services and Charity

Establishing charitable initiatives and social services demonstrates Islamic values in action and serves the broader society.`,
  },
  {
    id: "5",
    title: "The Role of Women in Islamic History",
    category: "History",
    readTime: "10 min",
    publishedDate: "December 20, 2025",
    excerpt: "Highlighting the significant contributions of women throughout Islamic civilization.",
    featureImage: "/islamic-art-calligraphy.jpg",
    content: `Throughout Islamic history, women have played crucial roles as scholars, leaders, warriors, and social reformers. Their contributions have profoundly shaped Islamic civilization.

## Khadijah bint Khuwaylid: The First Believer

Khadijah, the Prophet's first wife, was a successful businesswoman and the first person to embrace Islam. Her unwavering support during the early years of Islam was instrumental to the faith's survival.

## Aisha bint Abu Bakr: The Scholar

Aisha was one of the most prolific hadith narrators and a renowned scholar. She taught thousands of students and her legal opinions continue to influence Islamic jurisprudence.

## Fatima al-Fihri: Founder of the World's First University

In 859 CE, Fatima al-Fihri founded the University of al-Qarawiyyin in Fez, Morocco, which is recognized by UNESCO and Guinness World Records as the oldest continuously operating university in the world.

## Women Warriors and Leaders

From Nusaybah bint Ka'ab, who defended the Prophet in battle, to Sultana Razia of Delhi, who ruled one of the largest Muslim empires, women have demonstrated leadership and courage throughout Islamic history.

## Contemporary Muslim Women

Today, Muslim women continue this legacy as scientists, politicians, athletes, and activists, contributing to society while maintaining their Islamic identity.`,
  },
  {
    id: "6",
    title: "Ramadan: More Than Just Fasting",
    category: "Worship",
    readTime: "6 min",
    publishedDate: "December 15, 2025",
    excerpt: "Understanding the spiritual dimensions of the holy month of Ramadan.",
    featureImage: "/ramadan-moon-lanterns.jpg",
    content: `Ramadan is the ninth month of the Islamic calendar and holds special significance for Muslims worldwide. While fasting is its most visible aspect, Ramadan encompasses much more.

## The Spiritual Significance

Ramadan is the month in which the Quran was first revealed. It's a time for spiritual reflection, increased devotion, and worship.

## Fasting: Beyond Physical Abstinence

Fasting in Ramadan means abstaining not only from food and drink but also from negative behaviors, idle talk, and harmful actions. It's a comprehensive spiritual discipline.

## The Night of Power (Laylat al-Qadr)

One of the last ten nights of Ramadan is Laylat al-Qadr, described in the Quran as "better than a thousand months." Muslims seek this blessed night through increased worship.

## Community and Charity

Ramadan strengthens community bonds through shared iftar meals and increased charitable giving. It's a month when generosity flourishes.

## Eid al-Fitr: The Celebration

The month concludes with Eid al-Fitr, a joyous celebration marking the completion of the fast and expressing gratitude to Allah.`,
  },
  {
    id: "7",
    title: "Islamic Finance: Principles and Practice",
    category: "Finance",
    readTime: "9 min",
    publishedDate: "December 10, 2025",
    excerpt: "An introduction to halal financial practices and their modern applications.",
    featureImage: null,
    content: `Islamic finance is a financial system that operates according to Sharia (Islamic law). It prohibits practices considered harmful to society while promoting ethical and equitable financial dealings.

## Core Principles

### 1. Prohibition of Riba (Interest)
Islam prohibits charging or paying interest on loans. This principle aims to prevent exploitation and promote risk-sharing.

### 2. Prohibition of Gharar (Excessive Uncertainty)
Transactions must be clear and transparent, avoiding excessive speculation and ambiguity.

### 3. Prohibition of Haram Activities
Islamic finance doesn't support businesses involved in alcohol, gambling, pork, or other prohibited activities.

### 4. Asset-Backed Financing
All transactions must be linked to real economic activity and tangible assets.

## Modern Applications

Islamic financial products have evolved to meet contemporary needs while maintaining Sharia compliance:
- Murabaha: Cost-plus financing
- Ijara: Leasing arrangements
- Musharaka: Partnership financing
- Sukuk: Islamic bonds

## Global Growth

Islamic finance is one of the fastest-growing sectors in global finance, with assets estimated at over $3 trillion and growing presence in both Muslim-majority and Western countries.`,
  },
  {
    id: "8",
    title: "Raising Muslim Children in a Multicultural Society",
    category: "Family",
    readTime: "8 min",
    publishedDate: "December 1, 2025",
    excerpt: "Guidance for parents on nurturing faith while embracing diversity.",
    featureImage: null,
    content: `Raising Muslim children in a multicultural environment presents unique opportunities and challenges. Parents must balance maintaining Islamic identity with embracing the diversity of the broader society.

## Foundation of Faith at Home

The home is the primary place where children learn about Islam. Regular family prayers, Quran recitation, and Islamic stories create a strong foundation.

## Teaching Islamic Values

Focus on core Islamic values such as honesty, kindness, respect, and justice. These universal principles resonate across cultures.

## Embracing Diversity

Teach children that Islam celebrates diversity. The Quran states: "O mankind, indeed We have created you from male and female and made you peoples and tribes that you may know one another."

## Building Confidence in Islamic Identity

Help children develop pride in their Muslim identity while feeling comfortable in mainstream society. This dual identity is an asset, not a contradiction.

## Engaging with Schools and Communities

Actively participate in school activities and community events. This engagement helps children feel integrated while maintaining their values.

## Managing Peer Pressure

Equip children with the confidence and understanding to navigate peer pressure while staying true to their beliefs.

## Role Modeling

Children learn most from observing their parents. Model the behavior and values you wish to instill.`,
  },
]

const categories = ["All", "Basics", "Lifestyle", "Education", "Community", "History", "Worship", "Finance", "Family"]

export default function ArticlesPage() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredArticles = articles.filter(
    (article) =>
      (selectedCategory === "All" || article.category === selectedCategory) &&
      (article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(search.toLowerCase())),
  )

  return (
    <MainLayout>
      <div className="px-4 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-emerald mb-2">Articles</h1>
            <p className="text-muted-foreground">Read and learn from our collection of Islamic articles</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? "bg-emerald text-white"
                  : "bg-muted text-muted-foreground hover:bg-emerald/10 hover:text-emerald"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredArticles.map((article, index) => (
            <CardWrapper key={article.id} delay={index * 0.05}>
              <Link href={`/articles/${article.id}`} className="block p-5 hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald/10 text-emerald rounded-lg text-xs font-medium">
                        <Tag className="w-3 h-3" />
                        {article.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">{article.excerpt}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                </div>
              </Link>
            </CardWrapper>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
