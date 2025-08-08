'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import useCartStore from '../../store/cartStore'
import { ShippingAddress } from '../../types'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  CreditCard, 
  Smartphone, 
  Check,
  Truck,
  Zap,
  ShieldCheck,
  QrCode
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const router = useRouter()
  const { t, language } = useLanguage()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const total = getTotalPrice()
  const shipping = total > 299 ? 0 : 20 // 满299包邮
  const discount = total > 599 ? 50 : 0 // 满599减50
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
  })

  const [shippingMethod, setShippingMethod] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState('wechat')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [qrCodeType, setQRCodeType] = useState<'wechat' | 'alipay' | null>(null)

  // 计算运费
  const getShippingCost = () => {
    if (shippingMethod === 'express') return 35
    if (shippingMethod === 'overnight') return 68
    return shipping
  }

  const finalTotal = total + getShippingCost() - discount

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    })
  }

  const handlePayment = async () => {
    if (paymentMethod === 'wechat' || paymentMethod === 'alipay') {
      setQRCodeType(paymentMethod as 'wechat' | 'alipay')
      setShowQRCode(true)
      
      // 模拟等待支付
      setTimeout(() => {
        toast.success(language === 'zh' ? '支付成功！' : 'Payment successful!')
        clearCart()
        router.push('/order-success')
      }, 3000)
    } else if (paymentMethod === 'cod') {
      // 货到付款
      toast.success(language === 'zh' ? '订单已确认，货到付款' : 'Order confirmed, cash on delivery')
      clearCart()
      router.push('/order-success')
    } else {
      // 信用卡支付
      toast.success(language === 'zh' ? '正在跳转到支付页面...' : 'Redirecting to payment...')
      setTimeout(() => {
        clearCart()
        router.push('/order-success')
      }, 2000)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证手机号
    if (!/^1[3-9]\d{9}$/.test(shippingAddress.phone)) {
      toast.error(language === 'zh' ? '请输入有效的手机号' : 'Please enter a valid phone number')
      return
    }
    
    setIsProcessing(true)
    await handlePayment()
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            {language === 'zh' ? '购物车是空的' : 'Your cart is empty'}
          </h1>
          <Link
            href="/shop"
            className="inline-block bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            {language === 'zh' ? '继续购物' : 'Continue Shopping'}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/cart" className="text-gray-400 hover:text-white">
                {language === 'zh' ? '购物车' : 'Shopping Cart'}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-white">{language === 'zh' ? '结算' : 'Checkout'}</li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-white mb-8">
          {language === 'zh' ? '结算' : 'Checkout'}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* 收货信息 */}
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {language === 'zh' ? '收货信息' : 'Shipping Information'}
                </h2>
                
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 mb-2">
                        {language === 'zh' ? '收货人姓名' : 'Full Name'}
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        required
                        value={shippingAddress.full_name}
                        onChange={handleInputChange}
                        placeholder={language === 'zh' ? '请输入真实姓名' : 'Enter your name'}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-2">
                        {language === 'zh' ? '手机号码' : 'Phone Number'}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={shippingAddress.phone}
                        onChange={handleInputChange}
                        placeholder={language === 'zh' ? '请输入11位手机号' : 'Enter phone number'}
                        pattern="^1[3-9]\d{9}$"
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2">
                      {language === 'zh' ? '详细地址' : 'Address'}
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={shippingAddress.address}
                      onChange={handleInputChange}
                      placeholder={language === 'zh' ? '省市区街道门牌号' : 'Full address'}
                      className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-400 mb-2">
                        {language === 'zh' ? '城市' : 'City'}
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={shippingAddress.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2">
                        {language === 'zh' ? '省份' : 'State/Province'}
                      </label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={shippingAddress.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2">
                        {language === 'zh' ? '邮编' : 'Zip Code'}
                      </label>
                      <input
                        type="text"
                        name="zip_code"
                        required
                        value={shippingAddress.zip_code}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 配送方式 */}
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {language === 'zh' ? '配送方式' : 'Shipping Method'}
                </h2>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="shipping"
                        value="standard"
                        checked={shippingMethod === 'standard'}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex items-center gap-3">
                        <Truck size={20} className="text-gray-400" />
                        <div>
                          <p className="text-white font-medium">
                            {language === 'zh' ? '标准快递 (3-5天)' : 'Standard (3-5 days)'}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {language === 'zh' ? '满299元包邮' : 'Free on orders over ¥299'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className="text-white">
                      {shipping === 0 ? (language === 'zh' ? '免费' : 'Free') : `¥${shipping}`}
                    </span>
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="shipping"
                        value="express"
                        checked={shippingMethod === 'express'}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex items-center gap-3">
                        <Zap size={20} className="text-yellow-400" />
                        <div>
                          <p className="text-white font-medium">
                            {language === 'zh' ? '顺丰速运 (1-2天)' : 'Express (1-2 days)'}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {language === 'zh' ? '次日达服务' : 'Next day delivery available'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className="text-white">¥35</span>
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="shipping"
                        value="overnight"
                        checked={shippingMethod === 'overnight'}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex items-center gap-3">
                        <Zap size={20} className="text-red-400" />
                        <div>
                          <p className="text-white font-medium">
                            {language === 'zh' ? '同城闪送 (当日达)' : 'Same Day Delivery'}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {language === 'zh' ? '限北上广深' : 'Major cities only'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className="text-white">¥68</span>
                  </label>
                </div>
              </div>

              {/* 支付方式 */}
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {language === 'zh' ? '支付方式' : 'Payment Method'}
                </h2>
                
                <div className="grid md:grid-cols-2 gap-3">
                  {/* 微信支付 */}
                  <label className="flex items-center p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors border-2 border-transparent has-[:checked]:border-green-500">
                    <input
                      type="radio"
                      name="payment"
                      value="wechat"
                      checked={paymentMethod === 'wechat'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xl font-bold">微</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {language === 'zh' ? '微信支付' : 'WeChat Pay'}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {language === 'zh' ? '推荐' : 'Recommended'}
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* 支付宝 */}
                  <label className="flex items-center p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors border-2 border-transparent has-[:checked]:border-blue-500">
                    <input
                      type="radio"
                      name="payment"
                      value="alipay"
                      checked={paymentMethod === 'alipay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xl font-bold">支</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {language === 'zh' ? '支付宝' : 'Alipay'}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {language === 'zh' ? '花呗分期' : 'Installments available'}
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* 信用卡 */}
                  <label className="flex items-center p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors border-2 border-transparent has-[:checked]:border-gray-400">
                    <input
                      type="radio"
                      name="payment"
                      value="credit-card"
                      checked={paymentMethod === 'credit-card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex items-center gap-3">
                      <CreditCard size={24} className="text-gray-400" />
                      <div>
                        <p className="text-white font-medium">
                          {language === 'zh' ? '信用卡/借记卡' : 'Credit/Debit Card'}
                        </p>
                        <p className="text-gray-400 text-xs">Visa, Mastercard, UnionPay</p>
                      </div>
                    </div>
                  </label>

                  {/* 货到付款 */}
                  <label className="flex items-center p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors border-2 border-transparent has-[:checked]:border-yellow-500">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex items-center gap-3">
                      <Truck size={24} className="text-yellow-500" />
                      <div>
                        <p className="text-white font-medium">
                          {language === 'zh' ? '货到付款' : 'Cash on Delivery'}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {language === 'zh' ? '支持POS机刷卡' : 'POS available'}
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* 支付安全提示 */}
                <div className="mt-4 p-3 bg-gray-800 rounded-lg flex items-center gap-3">
                  <ShieldCheck size={20} className="text-green-400" />
                  <p className="text-gray-300 text-sm">
                    {language === 'zh' 
                      ? '您的支付信息将被加密传输，我们不会存储您的支付密码'
                      : 'Your payment information is encrypted and secure'}
                  </p>
                </div>
              </div>
            </div>

            {/* 订单摘要 */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-lg p-6 sticky top-20">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {language === 'zh' ? '订单摘要' : 'Order Summary'}
                </h2>
                
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="text-gray-300">
                        <p>{item.product.name}</p>
                        <p className="text-gray-500">
                          {item.size} / {item.color} × {item.quantity}
                        </p>
                      </div>
                      <span className="text-white">
                        ¥{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-800 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>{language === 'zh' ? '商品小计' : 'Subtotal'}</span>
                    <span>¥{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>{language === 'zh' ? '运费' : 'Shipping'}</span>
                    <span>
                      {getShippingCost() === 0 
                        ? (language === 'zh' ? '免费' : 'Free')
                        : `¥${getShippingCost()}`}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>{language === 'zh' ? '优惠' : 'Discount'}</span>
                      <span>-¥{discount}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-800 pt-4 mb-6">
                  <div className="flex justify-between text-white text-lg font-semibold">
                    <span>{language === 'zh' ? '总计' : 'Total'}</span>
                    <span>¥{finalTotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <p className="text-green-400 text-xs mt-1">
                      {language === 'zh' ? '已节省 ¥' : 'You saved ¥'}{discount}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing 
                    ? (language === 'zh' ? '处理中...' : 'Processing...')
                    : (language === 'zh' ? '确认支付' : 'Confirm Payment')}
                </button>

                <p className="text-gray-400 text-xs mt-4 text-center">
                  {language === 'zh' 
                    ? '下单即表示您同意我们的服务条款和隐私政策'
                    : 'By placing this order, you agree to our Terms and Privacy Policy'}
                </p>

                {/* 优惠提示 */}
                {total < 299 && (
                  <div className="mt-4 p-3 bg-orange-900/20 border border-orange-800 rounded-lg">
                    <p className="text-orange-400 text-xs">
                      {language === 'zh' 
                        ? `还差 ¥${(299 - total).toFixed(2)} 即可免运费`
                        : `Add ¥${(299 - total).toFixed(2)} for free shipping`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* 支付二维码弹窗 */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="mb-4">
                {qrCodeType === 'wechat' ? (
                  <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto">
                    <span className="text-white text-3xl font-bold">微</span>
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto">
                    <span className="text-white text-3xl font-bold">支</span>
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-2">
                {qrCodeType === 'wechat' 
                  ? (language === 'zh' ? '微信支付' : 'WeChat Pay')
                  : (language === 'zh' ? '支付宝' : 'Alipay')}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {language === 'zh' ? '请扫描二维码完成支付' : 'Scan QR code to complete payment'}
              </p>

              {/* 模拟二维码 */}
              <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <QrCode size={120} className="text-gray-400" />
              </div>

              <div className="text-2xl font-bold mb-6">
                ¥{finalTotal.toFixed(2)}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowQRCode(false)
                    setIsProcessing(false)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {language === 'zh' ? '取消' : 'Cancel'}
                </button>
                <button
                  onClick={() => {
                    toast.success(language === 'zh' ? '支付成功！' : 'Payment successful!')
                    clearCart()
                    router.push('/order-success')
                  }}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  {language === 'zh' ? '我已支付' : 'Payment Complete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}