'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface SearchResultFriend { id: string; name: string; email: string; image?: string | null }
interface SearchResultGallery { id: string; name: string }

interface SearchBarProps {
  placeholder?: string
  onSelectFriend?: (friend: SearchResultFriend) => void
  onSelectGallery?: (gallery: SearchResultGallery) => void
}

export default function SearchBar({ placeholder = 'Search friends and galleries...', onSelectFriend, onSelectGallery }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ friends: SearchResultFriend[]; galleries: SearchResultGallery[] }>({ friends: [], galleries: [] })
  const [loading, setLoading] = useState(false)
  const debounced = useDebouncedValue(query, 300)

  useEffect(() => {
    const run = async () => {
      if (!debounced.trim()) {
        setResults({ friends: [], galleries: [] })
        return
      }
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debounced)}`)
        if (res.ok) {
          setResults(await res.json())
        }
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [debounced])

  return (
    <div className="w-full max-w-xl">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {(results.friends.length > 0 || results.galleries.length > 0) && (
        <Card className="mt-2">
          <CardContent className="p-2 divide-y">
            {results.friends.length > 0 && (
              <div className="py-2">
                <div className="text-xs uppercase text-gray-500 px-2 mb-1">Friends</div>
                <ul>
                  {results.friends.map((f) => (
                    <li key={f.id}>
                      <button
                        type="button"
                        className="w-full text-left px-2 py-2 hover:bg-gray-50 rounded"
                        onClick={() => onSelectFriend?.(f)}
                      >
                        <div className="font-medium">{f.name}</div>
                        <div className="text-xs text-gray-500">{f.email}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {results.galleries.length > 0 && (
              <div className="py-2">
                <div className="text-xs uppercase text-gray-500 px-2 mb-1">Galleries</div>
                <ul>
                  {results.galleries.map((g) => (
                    <li key={g.id}>
                      <button
                        type="button"
                        className="w-full text-left px-2 py-2 hover:bg-gray-50 rounded"
                        onClick={() => onSelectGallery?.(g)}
                      >
                        <div className="font-medium">{g.name}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {loading && <div className="py-2 px-2 text-sm text-gray-500">Searching…</div>}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(t)
  }, [value, delayMs])
  return debounced
}


