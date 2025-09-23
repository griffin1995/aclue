/**
 * App Router Full Landing Page - Backup of Original Root Page
 *
 * This page serves as a backup of the original root page content.
 * Originally this was at / but has been moved to /landingpage-full
 * to make room for the newsletter signup page at the root.
 *
 * Features:
 * - Backup of original root page implementation
 * - Simple content display
 * - Can be restored if needed
 */

export default function FullLandingPageBackup() {
  console.log('🏠 Original root page backup rendered at /landingpage-full')

  // Original root page content preserved here
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-8">
            Welcome to aclue
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            AI-Powered Gift Discovery Platform
          </p>
          <p className="text-lg text-blue-200">
            Newsletter signup page is loading...
          </p>
          <div className="mt-8">
            <p className="text-sm text-blue-300">
              This is the backup of the original root page content.
              The full application is available at <a href="/landingpage" className="underline text-blue-400">/landingpage</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

/**
 * Metadata for the backup page
 */
export const metadata = {
  title: 'aclue - Original Root Page Backup',
  description: 'Backup of the original root page content for aclue platform.',
  robots: {
    index: false,
    follow: false,
  },
}