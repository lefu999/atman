'use client'

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-400 mb-2">Thank you for your purchase.</p>
        <p className="text-gray-400 mb-8">
          You will receive an email confirmation shortly with your order details.
        </p>
        
        <div className="bg-gray-900 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
          <h2 className="text-white font-semibold mb-3">What's Next?</h2>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>• Check your email for order confirmation</li>
            <li>• You'll receive tracking info once your order ships</li>
            <li>• Estimated delivery: 5-7 business days</li>
          </ul>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/shop"
            className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  )
}