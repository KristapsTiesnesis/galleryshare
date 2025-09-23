import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const galleryId = params.id

    // Validate gallery ID
    if (!galleryId) {
      return NextResponse.json(
        { error: "Gallery ID is required" },
        { status: 400 }
      )
    }

    // Get the gallery with media
    const gallery = await prisma.gallery.findUnique({
      where: {
        id: galleryId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        media: {
          include: {
            uploader: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!gallery) {
      return NextResponse.json(
        { error: "Gallery not found" },
        { status: 404 }
      )
    }

    // Check if user has access to this gallery
    // For now, only the owner can view their gallery
    // Later you might want to add sharing functionality
    if (gallery.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Access denied. You can only view your own galleries." },
        { status: 403 }
      )
    }

    return NextResponse.json(
      {
        message: "Gallery retrieved successfully",
        gallery: {
          id: gallery.id,
          name: gallery.name,
          owner: gallery.owner,
          mediaCount: gallery.media.length,
          media: gallery.media.map(media => ({
            id: media.id,
            url: media.url,
            type: media.type,
            uploader: media.uploader,
            createdAt: media.createdAt,
          })),
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error("Get gallery error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
