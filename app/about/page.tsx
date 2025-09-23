export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About Gallery Share</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Gallery Share is a platform dedicated to connecting art enthusiasts, 
              collectors, and gallery owners from around the world. We believe that 
              art should be accessible to everyone, and our mission is to make 
              discovering and sharing galleries easier than ever.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              To create a global community where art lovers can discover new galleries, 
              share their favorite collections, and connect with like-minded individuals 
              who appreciate the beauty and power of visual art.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Discover galleries from around the world</li>
              <li>Share your favorite collections</li>
              <li>Connect with fellow art enthusiasts</li>
              <li>Get recommendations based on your interests</li>
              <li>Follow galleries and artists you love</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
