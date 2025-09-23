'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface MediaItemProps {
  url: string
  type: 'image' | 'video'
  className?: string
}

export default function MediaCard({ url, type, className = '' }: MediaItemProps) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-0">
        {type === 'image' ? (
          <img src={url} alt="media" className="w-full h-full object-cover" />
        ) : (
          <video controls src={url} className="w-full h-full" />
        )}
      </CardContent>
    </Card>
  )
}


