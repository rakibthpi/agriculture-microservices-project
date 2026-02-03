'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ShoppingCart,
  Heart,
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import api from '@/lib/api-client';
import { useState } from 'react';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-white py-12">
        <div className="container mx-auto px-4">
          <Button variant="ghost" className="mb-8" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Section */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 shadow-inner group">
              <Image
                src={
                  product.imageUrl ||
                  'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800'
                }
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Info Section */}
            <div className="flex flex-col">
              <div className="mb-8">
                <div className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-2 px-2 py-1 bg-primary-50 inline-block rounded-md">
                  {product.category?.name}
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-accent-500">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="text-lg font-bold">4.8</span>
                    <span className="text-sm text-gray-400 ml-1 font-normal">(124 reviews)</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div
                    className={`text-sm font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {product.stock > 0
                      ? `In Stock (${product.stock} ${product.unit} left)`
                      : 'Out of Stock'}
                  </div>
                </div>
              </div>

              <div className="text-3xl font-bold text-gray-900 mb-8 flex items-baseline gap-2">
                ৳{product.price}
                <span className="text-sm text-gray-400 font-normal underline decoration-primary-300 underline-offset-4 decoration-2">
                  per {product.unit}
                </span>
              </div>

              <div className="text-gray-600 leading-relaxed mb-10 text-lg">
                <p>
                  {product.description ||
                    'Our high-quality fresh farm products are sourced directly from sustainable local farms in Bangladesh, ensuring pure quality and fresh taste delivered right to your table.'}
                </p>
              </div>

              {/* Add to Cart Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <div className="flex items-center border-2 border-gray-100 rounded-2xl p-1 bg-gray-50 w-full sm:w-auto h-16">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-full flex items-center justify-center hover:bg-white rounded-xl transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-16 text-center font-bold bg-transparent outline-none text-xl"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-full flex items-center justify-center hover:bg-white rounded-xl transition-colors"
                  >
                    +
                  </button>
                </div>
                <Button
                  size="lg"
                  className="flex-1 h-16 rounded-2xl text-xl font-bold shadow-xl shadow-primary-500/30"
                  onClick={() => addItem({ ...product, quantity })}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="mr-3 h-6 w-6" />
                  Add to Cart
                </Button>
                <Button size="lg" variant="outline" className="h-16 w-16 px-0 rounded-2xl border-2">
                  <Heart className="h-6 w-6" />
                </Button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-gray-100">
                <div className="flex flex-col items-center text-center">
                  <Truck className="h-8 w-8 text-primary-600 mb-2" />
                  <span className="text-xs font-bold text-gray-900">Swift Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center border-x border-gray-100">
                  <ShieldCheck className="h-8 w-8 text-primary-600 mb-2" />
                  <span className="text-xs font-bold text-gray-900">Secure Quality</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <RefreshCw className="h-8 w-8 text-primary-600 mb-2" />
                  <span className="text-xs font-bold text-gray-900">7-Day Return</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
