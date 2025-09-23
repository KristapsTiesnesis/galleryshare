import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Get all friends for the current user
    const friendships = await prisma.friend.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          }
        }
      },
      orderBy: {
        user: {
          name: 'asc'
        }
      }
    })

    // Transform the data to return friend information
    const friends = friendships.map(friendship => ({
      id: friendship.user.id,
      name: friendship.user.name,
      email: friendship.user.email,
      image: friendship.user.image,
      addedAt: friendship.user.createdAt,
    }))

    return NextResponse.json(
      {
        message: "Friends retrieved successfully",
        friends,
        count: friends.length
      },
      { status: 200 }
    )

  } catch (error) {
    console.error("Get friends error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
