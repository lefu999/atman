import Link from 'next/link'
import { Twitter, Instagram, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">ATMAN</h3>
            <p className="text-gray-400">
              专注于潮流街头文化，为现代都市青年打造独特的穿搭风格。
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">客户服务</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/contact" className="hover:text-white">联系我们</Link></li>
              <li><Link href="/shipping" className="hover:text-white">配送信息</Link></li>
              <li><Link href="/returns" className="hover:text-white">退换货政策</Link></li>
              <li><Link href="/size-guide" className="hover:text-white">尺码指南</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">关于我们</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white">品牌故事</Link></li>
              <li><Link href="/sustainability" className="hover:text-white">可持续发展</Link></li>
              <li><Link href="/careers" className="hover:text-white">加入我们</Link></li>
              <li><Link href="/press" className="hover:text-white">媒体资讯</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">支付方式</h4>
            <p className="text-gray-400 mb-4">
              支持微信支付、支付宝、信用卡等多种支付方式
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ATMAN. 版权所有</p>
        </div>
      </div>
    </footer>
  )
}