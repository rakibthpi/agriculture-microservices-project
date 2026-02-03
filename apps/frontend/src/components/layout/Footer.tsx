import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
                <span className="text-lg font-bold">A</span>
              </div>
              <span className="text-xl font-bold text-white">AgriMarket</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Connecting farmers directly with consumers. Fresh, organic, and locally sourced
              products delivered to your doorstep.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-primary-500">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-primary-500">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-500">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-primary-500">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-500">
                  Return & Refunds
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-500">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-500">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 text-primary-500 shrink-0" />
                <span>123 Farm Street, Agriville, BD 1205</span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-5 w-5 text-primary-500 shrink-0" />
                <span>+880 1712-345678</span>
              </li>
              <li className="flex gap-3">
                <Mail className="h-5 w-5 text-primary-500 shrink-0" />
                <span>support@agrimarket.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} AgriMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
