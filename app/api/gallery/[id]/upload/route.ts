import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { uploadToS3 } from "@/lib/s3"

export async function POST(
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

    // Check if gallery exists and user has access
    const gallery = await prisma.gallery.findUnique({
      where: {
        id: galleryId,
      },
      select: {
        id: true,
        name: true,
        ownerId: true,
      }
    })

    if (!gallery) {
      return NextResponse.json(
        { error: "Gallery not found" },
        { status: 404 }
      )
    }

    // Check if user owns the gallery
    if (gallery.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Access denied. You can only upload to your own galleries." },
        { status: 403 }
      )
    }

    // Parse the form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/x-msvideo'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images and videos are allowed." },
        { status: 400 }
      )
    }

    // Check file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 50MB." },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Generate unique filename
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    // Upload to S3
    const s3Url = await uploadToS3(
      buffer,
      fileName,
      file.type
    )

    // Determine media type
    const mediaType = file.type.startsWith('image/') ? 'image' : 'video'

    // Store in database with gallery association
    const media = await prisma.media.create({
      data: {
        url: s3Url,
        type: mediaType,
        uploaderId: session.user.id,
        galleryId: galleryId,
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        gallery: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    return NextResponse.json({
      message: 'File uploaded to gallery successfully',
      media: {
        id: media.id,
        url: media.url,
        type: media.type,
        uploader: media.uploader,
        gallery: media.gallery,
        createdAt: media.createdAt,
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Gallery upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file to gallery' },
      { status: 500 }
    )
  }
}
