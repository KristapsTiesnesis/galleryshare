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

    const { email } = await request.json()

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: "Friend's email is required" },
        { status: 400 }
      )
    }

    // Check if the friend exists
    const friend = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
      }
    })

    if (!friend) {
      return NextResponse.json(
        { error: "User with this email does not exist" },
        { status: 404 }
      )
    }

    // Check if trying to add yourself
    if (friend.id === userId) {
      return NextResponse.json(
        { error: "You cannot add yourself as a friend" },
        { status: 400 }
      )
    }

    // Check if friendship already exists
    const existingFriendship = await prisma.friend.findFirst({
      where: {
        userId: userId,
        friendId: friend.id,
      }
    })

    if (existingFriendship) {
      return NextResponse.json(
        { error: "This user is already your friend" },
        { status: 400 }
      )
    }

    // Create the friendship
    const newFriendship = await prisma.friend.create({
      data: {
        userId: userId,
        friendId: friend.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(
      {
        message: "Friend added successfully",
        friend: {
          id: friend.id,
          name: friend.name,
          email: friend.email,
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Add friend error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
