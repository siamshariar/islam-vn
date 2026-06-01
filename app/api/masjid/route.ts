import { NextRequest, NextResponse } from 'next/server'

const masjids = [
  { id: "1", name: "Jamiul Muslimin Masjid", address: "52 Đ. Nguyễn Văn Trỗi, Cầu Kiệu, Hồ Chí Minh", phone: "+84 28 3824 6543", hours: "4:15 AM - 10:00 PM", image: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFSoYkpscFEThiJ374-kyhqsvmoho1skdbvIXPUCd2pKsxrZpcpUYnZKX_voE7WdgnbNDRzGok4Yawe5sboi_0PigKSJMI0dJcLfY31uAexqy6qW1RjD5I_-738soCndmQVK4Wd7OQ53Mb2=s1360-w1360-h1020-rw" },
  { id: "2", name: "Saigon Central Mosque (Masjid Al-Rahim)", address: "459 Trần Hưng Đạo, District 5, Ho Chi Minh City", phone: "+84 28 3836 2149", hours: "5:00 AM - 9:00 PM", image: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAH2-MWag-sgPWnch6SxxR8V0SUajSjQUgDAKYJ75nSEQv4V5BDCBQYJ5EmfKoWJsfvjYPLz2YdNFhxkr3lbTFgfpDfGos-vYIrmIZjRUXokL2mFhQlw0LrIeYSPM22I3UlooStcoQ=s1360-w1360-h1020-rw" },
  { id: "3", name: "Masjid Jamiul Azhar Mosque", address: "Tổ 8, ấp Châu Giang, Xã Châu Phong, An Giang Province", phone: "+84 941 852 762", hours: "Open 24 hours", image: "https://file3.qdnd.vn/data/images/3/2019/02/26/hieu_ta/1%2025.jpg?dpi=150&quality=100&w=500" },
  { id: "4", name: "Masjid Mubarak (Cham Mosque)", address: "Châu Giang Village, An Giang Province", phone: "+84 296 3861 234", hours: "Open 24 hours", image: "https://evivatour.com/wp-content/uploads/2021/09/Masjid-Jamiul-Azhar-Mosque-An-Giang.jpg" },
  { id: "5", name: "Da Nang Mosque (Masjid Al-Akbar)", address: "123 Nguyễn Văn Linh, Da Nang", phone: "+84 236 3823 789", hours: "5:30 AM - 9:30 PM", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtL7fOkALJi-tchGSfuqS96W3ngPl2m_bbyw&s" },
  { id: "6", name: "Hanoi Muslim Community Center", address: "45 Hàng Lược, Hoàn Kiếm, Hanoi", phone: "+84 24 3826 1234", hours: "6:00 AM - 9:00 PM", image: "https://img2.beritasatu.com/cache/jakartaglobe/960x620-3/2015/01/DSC_1892.jpg" },
]

const PAGE_SIZE = 10

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')

    const totalItems = masjids.length
    const totalPages = Math.ceil(totalItems / PAGE_SIZE)
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    const paginatedItems = masjids.slice(start, end)

    return NextResponse.json({
      masjids: paginatedItems,
      currentPage: page,
      totalPages,
      totalItems,
      hasMore: page < totalPages
    })
  } catch (error) {
    console.error("Error in masjid API:", error)
    return NextResponse.json({ error: 'Failed to fetch masjids' }, { status: 500 })
  }
}