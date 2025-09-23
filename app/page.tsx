export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Gallery Share
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover, share, and explore amazing galleries from around the world. 
            Connect with fellow art enthusiasts and showcase your favorite collections.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Explore Galleries
            </button>
            <button className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-6 rounded-lg border border-blue-600 transition-colors">
              Share Your Gallery
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
