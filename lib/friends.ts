export interface Friend {
  id: string
  name: string
  email: string
  image?: string | null
  addedAt: string
}

export interface AddFriendResponse {
  message: string
  friend: {
    id: string
    name: string
    email: string
  }
}

export interface GetFriendsResponse {
  message: string
  friends: Friend[]
  count: number
}

export const addFriend = async (email: string): Promise<AddFriendResponse> => {
  const response = await fetch('/api/friends/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to add friend')
  }

  return response.json()
}

export const getFriends = async (): Promise<GetFriendsResponse> => {
  const response = await fetch('/api/friends', {
    method: 'GET',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to get friends')
  }

  return response.json()
}
