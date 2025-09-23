'use client'

import { useState, useRef } from 'react'
import { uploadFile, validateFile } from '@/lib/upload'

interface FileUploadProps {
  onUploadSuccess?: (media: any) => void
  onUploadError?: (error: string) => void
  galleryId?: string
  className?: string
}

export default function FileUpload({ 
  onUploadSuccess, 
  onUploadError, 
  galleryId,
  className = ''
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      onUploadError?.(validation.error || 'Invalid file')
      return
    }

    setUploading(true)
    try {
      const result = await uploadFile(file, galleryId)
      onUploadSuccess?.(result.media)
    } catch (error) {
      onUploadError?.(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    
    const file = files[0] // Handle only first file for now
    handleFile(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    handleFiles(e.target.files)
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,video/*"
          onChange={handleChange}
          disabled={uploading}
        />
        
        <div className="space-y-4">
          <div className="text-gray-600">
            {uploading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span>Uploading...</span>
              </div>
            ) : (
              <>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-lg font-medium">Upload images or videos</p>
                <p className="text-sm">Drag and drop files here, or click to select</p>
                <p className="text-xs text-gray-500">Max file size: 50MB</p>
              </>
            )}
          </div>
          
          {!uploading && (
            <button
              type="button"
              onClick={onButtonClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              Choose Files
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
