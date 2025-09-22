import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: string
  image_url: string
  category: string
  rating?: number
  affiliate_url?: string
}

interface ServerProductCardProps {
  product: Product
  priority?: boolean
  className?: string
}

/**
 * Server Product Card Component
 *
 * Product card rendered on the server for optimal performance.
 * Displays product information with SEO optimisation.
 *
 * Features:
 * - Server-side rendering for SEO
 * - Optimised image loading
 * - Price formatting
 * - Structured data support
 *
 * @param product - Product data
 * @param priority - Whether to prioritise image loading
 * @param className - Additional CSS classes
 */
export default function ServerProductCard({
  product,
  priority = false,
  className = ''
}: ServerProductCardProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(price)
  }

  const renderStars = (rating?: number) => {
    if (!rating) return null

    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-star">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#half-star)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }

    return <div className="flex items-center space-x-1">{stars}</div>
  }

  return (
    <article
      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 ${className}`}
      itemScope
      itemType="https://schema.org/Product"
    >
      {/* Product Image */}
      <div className="aspect-square relative overflow-hidden bg-gray-50">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover hover:scale-105 transition-transform duration-200"
          priority={priority}
          itemProp="image"
        />
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-2">
        <div className="space-y-1">
          <h3
            className="font-semibold text-gray-900 line-clamp-2 text-sm"
            itemProp="name"
          >
            {product.name}
          </h3>
          <p
            className="text-gray-600 text-xs line-clamp-2"
            itemProp="description"
          >
            {product.description}
          </p>
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center space-x-2" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
            {renderStars(product.rating)}
            <span className="text-xs text-gray-500" itemProp="ratingValue">{product.rating}</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <span
            className="font-bold text-lg text-gray-900"
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <span itemProp="price">{formatPrice(product.price, product.currency)}</span>
            <meta itemProp="priceCurrency" content={product.currency.toUpperCase()} />
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {product.affiliate_url ? (
            <a
              href={product.affiliate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 block text-center"
            >
              View Product
            </a>
          ) : (
            <Link
              href={`/products/${product.id}`}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 block text-center"
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}