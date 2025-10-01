import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    const userId = (session as any)?.user?.id as string | undefined
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { name } = await request.json()

    // Validate input
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Gallery name is required" },
        { status: 400 }
      )
    }

    if (name.trim().length > 100) {
      return NextResponse.json(
        { error: "Gallery name must be less than 100 characters" },
        { status: 400 }
      )
    }

    // Create the gallery
    const gallery = await prisma.gallery.create({
      data: {
        name: name.trim(),
        ownerId: userId,
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
          select: {
            id: true,
            url: true,
            type: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    return NextResponse.json(
      {
        message: "Gallery created successfully",
        gallery: {
          id: gallery.id,
          name: gallery.name,
          owner: gallery.owner,
          mediaCount: gallery.media.length,
          media: gallery.media,
          createdAt: gallery.id, // Using ID as timestamp proxy
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Create gallery error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
