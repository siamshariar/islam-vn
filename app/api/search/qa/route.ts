import { NextRequest, NextResponse } from 'next/server'
import { qaItems } from '@/lib/qa'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    if (!query.trim()) {
      return NextResponse.json({
        results: [],
        total: 0,
        query: ''
      })
    }

    const filteredQA = qaItems.filter(
      (item: any) =>
        item.question.toLowerCase().includes(query.toLowerCase()) ||
        item.answer.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    )

    return NextResponse.json({
      results: filteredQA,
      total: filteredQA.length,
      query
    })
  } catch (error) {
    console.error('Error searching Q&A:', error)
    return NextResponse.json(
      { error: 'Failed to search Q&A' },
      { status: 500 }
    )
  }
}