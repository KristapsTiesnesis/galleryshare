import MediaCard from '@/components/MediaCard'

export default function Galleries() {
  const sampleGalleries = [
    {
      id: 1,
      name: "Modern Art Gallery",
      location: "New York, NY",
      description: "Contemporary art from emerging and established artists",
      image: "/api/placeholder/400/300"
    },
    {
      id: 2,
      name: "Classical Masters",
      location: "Paris, France",
      description: "Timeless works from the great masters of art history",
      image: "/api/placeholder/400/300"
    },
    {
      id: 3,
      name: "Digital Art Space",
      location: "Tokyo, Japan",
      description: "Cutting-edge digital and interactive art installations",
      image: "/api/placeholder/400/300"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Featured Galleries</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing galleries from around the world
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleGalleries.map((gallery) => (
            <div key={gallery.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <MediaCard url={gallery.image} type={'image'} className="h-48" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{gallery.name}</h3>
                <p className="text-gray-600 mb-2">{gallery.location}</p>
                <p className="text-gray-500 text-sm">{gallery.description}</p>
                <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors">
                  View Gallery
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
