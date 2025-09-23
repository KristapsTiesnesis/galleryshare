export interface Gallery {
  id: string
  name: string
  owner: {
    id: string
    name: string
    email: string
  }
  mediaCount: number
  media: Media[]
}

export interface Media {
  id: string
  url: string
  type: 'image' | 'video'
  uploader: {
    id: string
    name: string
    email: string
  }
  createdAt: string
}

export interface CreateGalleryResponse {
  message: string
  gallery: {
    id: string
    name: string
    owner: {
      id: string
      name: string
      email: string
    }
    mediaCount: number
    media: Media[]
    createdAt: string
  }
}

export interface GetGalleryResponse {
  message: string
  gallery: Gallery
}

export interface UploadToGalleryResponse {
  message: string
  media: {
    id: string
    url: string
    type: 'image' | 'video'
    uploader: {
      id: string
      name: string
      email: string
    }
    gallery: {
      id: string
      name: string
    }
    createdAt: string
  }
}

export interface ShareMediaResponse {
  message: string
  share: {
    id: string
    mediaId: string
    senderId: string
    recipientId: string
  }
}

export const createGallery = async (name: string): Promise<CreateGalleryResponse> => {
  const response = await fetch('/api/gallery', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create gallery')
  }

  return response.json()
}

export const getGallery = async (id: string): Promise<GetGalleryResponse> => {
  const response = await fetch(`/api/gallery/${id}`, {
    method: 'GET',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to get gallery')
  }

  return response.json()
}

export const uploadToGallery = async (galleryId: string, file: File): Promise<UploadToGalleryResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`/api/gallery/${galleryId}/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to upload to gallery')
  }

  return response.json()
}

export const shareMedia = async (mediaId: string, recipientId: string): Promise<ShareMediaResponse> => {
  const response = await fetch('/api/share', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mediaId, recipientId }),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to share media')
  }
  return response.json()
}
