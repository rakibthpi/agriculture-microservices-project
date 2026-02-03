'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/stores/cartStore';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Your Shopping <span className="text-primary-600">Cart</span>
          </h1>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden border-none shadow-sm animate-fade-in transition-all hover:shadow-md"
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={
                            item.imageUrl ||
                            'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200'
                          }
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          ৳{item.price} / {item.unit}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>

                      <div className="text-right min-w-[80px]">
                        <p className="font-bold text-gray-900">৳{item.price * item.quantity}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="flex justify-between items-center pt-4">
                  <Button variant="ghost" className="text-gray-500" onClick={clearCart}>
                    Clear Cart
                  </Button>
                  <Link href="/products">
                    <Button variant="link" className="text-primary-600 font-bold">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24 border-none shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>৳{totalPrice}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Delivery Fee</span>
                        <span className="text-primary-600 font-medium">FREE</span>
                      </div>
                      <hr />
                      <div className="flex justify-between text-xl font-bold text-gray-900">
                        <span>Total</span>
                        <span>৳{totalPrice}</span>
                      </div>
                    </div>

                    <Link href="/checkout">
                      <Button className="w-full h-14 rounded-xl text-lg font-bold shadow-xl shadow-primary-500/30">
                        Checkout Now <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>

                    <p className="text-center text-xs text-gray-400 mt-4">
                      Taxes calculated at checkout. Safe & secure payment.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200 animate-fade-in">
              <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-12 w-12 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                Looks like you haven't added anything to your cart yet. Explore our fresh products!
              </p>
              <Link href="/products">
                <Button size="lg" className="rounded-full px-10">
                  Start Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
