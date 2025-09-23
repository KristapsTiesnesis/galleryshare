export interface UploadResponse {
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
    gallery?: {
      id: string
      name: string
    } | null
    createdAt: string
  }
}

export const uploadFile = async (
  file: File,
  galleryId?: string
): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  
  if (galleryId) {
    formData.append('galleryId', galleryId)
  }

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Upload failed')
  }

  return response.json()
}

export const getFileType = (file: File): 'image' | 'video' => {
  return file.type.startsWith('image/') ? 'image' : 'video'
}

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size (50MB limit)
  if (file.size > 50 * 1024 * 1024) {
    return { valid: false, error: 'File too large. Maximum size is 50MB.' }
  }

  // Check file type
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
    return { 
      valid: false, 
      error: 'Invalid file type. Only images and videos are allowed.' 
    }
  }

  return { valid: true }
}
