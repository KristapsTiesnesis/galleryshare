import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session as any)?.user?.id as string | undefined
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const q = (searchParams.get('q') || '').trim()
    if (!q) {
      return NextResponse.json({ friends: [], galleries: [] }, { status: 200 })
    }

    const friends = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: q } },
              { email: { contains: q } },
            ],
          },
          {
            // Only users who are already friends of the requester
            friends: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },
      select: { id: true, name: true, email: true, image: true },
      take: 10,
    })

    const galleries = await prisma.gallery.findMany({
      where: {
        AND: [
          { name: { contains: q } },
          { ownerId: userId },
        ],
      },
      select: { id: true, name: true },
      take: 10,
    })

    return NextResponse.json({ friends, galleries }, { status: 200 })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


