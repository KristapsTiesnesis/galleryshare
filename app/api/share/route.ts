import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { mediaId, recipientId } = await request.json()
    if (!mediaId || !recipientId) {
      return NextResponse.json({ error: 'mediaId and recipientId are required' }, { status: 400 })
    }

    const media = await prisma.media.findUnique({ where: { id: mediaId } })
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    // Only allow share if sender owns or uploaded the media
    if (media.uploaderId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized to share this media' }, { status: 403 })
    }

    const share = await prisma.share.create({
      data: {
        mediaId,
        senderId: session.user.id,
        recipientId,
      },
    })

    return NextResponse.json({ message: 'Shared successfully', share }, { status: 201 })
  } catch (error) {
    console.error('Share error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


