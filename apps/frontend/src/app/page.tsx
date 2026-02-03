'use client';

import Link from 'next/link';
import { ArrowRight, Leaf, ShieldCheck, Truck, Zap } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';

const mockProducts = [
  {
    id: '1',
    name: 'Basmati Rice Premium',
    price: 120,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400',
    category: { name: 'Rice' },
    stock: 50,
  },
  {
    id: '2',
    name: 'Organic Red Chili',
    price: 450,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1597362243411-a8d672ea4e66?q=80&w=400',
    category: { name: 'Spices' },
    stock: 5,
  },
  {
    id: '3',
    name: 'Pure Mustard Oil',
    price: 280,
    unit: 'L',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=400',
    category: { name: 'Oils' },
    stock: 20,
  },
  {
    id: '4',
    name: 'Fresh Red Pomegranate',
    price: 320,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?q=80&w=400',
    category: { name: 'Fruits' },
    stock: 15,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center bg-gray-100 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary-100/80 text-primary-700 px-4 py-2 rounded-full mb-6 font-semibold shadow-sm">
                <Leaf className="h-4 w-4" />
                <span>100% Organic & Fresh Products</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6">
                Fresh Farm Products <br />
                <span className="text-primary-600">to Your Door</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Connect directly with local farmers. Get access to the freshest vegetables, fruits,
                and grains without any middlemen.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button
                    size="lg"
                    className="rounded-full h-14 px-10 shadow-xl shadow-primary-500/20 text-lg"
                  >
                    Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full h-14 px-10 text-lg border-2"
                  >
                    How it Works
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          {/* Hero Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center -z-10"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1600')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent"></div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 hover:bg-primary-50 transition-colors group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
                  <Truck className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
                <p className="text-sm text-gray-500">
                  Scheduled delivery to your doorstep within 24 hours.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 hover:bg-primary-50 transition-colors group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Quality Assured</h3>
                <p className="text-sm text-gray-500">
                  Every product undergoes strict quality control checks.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 hover:bg-primary-50 transition-colors group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
                  <Leaf className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">100% Organic</h3>
                <p className="text-sm text-gray-500">
                  Direct from local farms without harmful chemicals.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 hover:bg-primary-50 transition-colors group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Fair Price</h3>
                <p className="text-sm text-gray-500">
                  Direct farmer-to-door pricing for best value.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Featured <span className="text-primary-600">Products</span>
                </h2>
                <p className="text-gray-500 max-w-xl">
                  Browse our top-rated fresh products direct from our most trusted local farmers.
                </p>
              </div>
              <Link
                href="/products"
                className="hidden sm:flex items-center gap-2 text-primary-600 font-bold hover:underline"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
              {mockProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-12 text-center sm:hidden">
              <Link href="/products">
                <Button variant="outline" className="w-full h-12">
                  View All Products
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
