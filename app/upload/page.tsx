'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import FileUpload from '@/components/FileUpload'
import MediaCard from '@/components/MediaCard'
import SearchBar from '@/components/SearchBar'
import { shareMedia } from '@/lib/gallery'
import { useToast } from '@/components/ui/toast'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const { data: session, status } = useSession()
  const [uploadedMedia, setUploadedMedia] = useState<any[]>([])
  const [error, setError] = useState('')
  const router = useRouter()
  const { show } = useToast()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to upload files.
          </p>
          <button
            onClick={() => router.push('/auth/signin')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  const handleUploadSuccess = (media: any) => {
    setUploadedMedia(prev => [media, ...prev])
    setError('')
  }

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Upload Media
            </h1>
            <p className="text-gray-600">
              Upload images and videos to your gallery
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <FileUpload
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </div>

          {uploadedMedia.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Share Latest Upload</h2>
              <div className="mb-4">
                <SearchBar
                  placeholder="Search your friends to share..."
                  onSelectFriend={async (friend) => {
                    const latest = uploadedMedia[0]
                    try {
                      await shareMedia(latest.id, friend.id)
                      show({ title: 'Shared', description: `Sent to ${friend.name}`, type: 'success' })
                    } catch (e) {
                      show({ title: 'Share failed', description: e instanceof Error ? e.message : 'Error', type: 'error' })
                    }
                  }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="text-red-800">{error}</div>
            </div>
          )}

          {uploadedMedia.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recently Uploaded
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uploadedMedia.map((media) => (
                  <div key={media.id}>
                    <MediaCard url={media.url} type={media.type} className="h-48" />
                    <div className="px-2 py-2">
                      <p className="text-sm text-gray-600">
                        {media.type === 'image' ? 'Image' : 'Video'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(media.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
