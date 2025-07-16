// This is the real app - the "alpha version" that users can access
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to prznt Alpha!</h1>
        <p className="text-lg text-gray-600 mb-8">
          This is your full prznt application. Navigate to the pages you want to show users.
        </p>
        <div className="space-x-4">
          <a 
            href="/dashboard" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </a>
          <a 
            href="/discover" 
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Discover Gifts
          </a>
        </div>
      </div>
    </div>
  );
}