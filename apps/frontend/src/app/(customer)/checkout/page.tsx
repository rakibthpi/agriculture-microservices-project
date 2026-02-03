'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Truck, ShieldCheck, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api-client';

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const { items, totalPrice, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [address, setAddress] = useState({
    street: '',
    city: '',
    phone: user?.phone || '',
    postalCode: '',
  });

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        shippingAddress: {
          ...address,
          name: user?.name,
          country: 'Bangladesh',
        },
      };

      const { data } = await api.post('/orders', orderData);
      setOrderId(data.orderNumber);
      setStep(3);
      clearCart();
    } catch (err) {
      console.error('Order failed', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && step !== 3) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                    step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > s ? <CheckCircle2 className="h-6 w-6" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 rounded ${step > s ? 'bg-primary-600' : 'bg-gray-200'}`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="animate-fade-in space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Shipping <span className="text-primary-600">Information</span>
              </h2>
              <Card className="border-none shadow-sm">
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-semibold text-gray-700">Street Address</label>
                    <Input
                      placeholder="e.g. 123 Farm Road"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">City</label>
                    <Input
                      placeholder="e.g. Dhaka"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Postal Code</label>
                    <Input
                      placeholder="e.g. 1205"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                    <Input
                      placeholder="+8801..."
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => router.back()}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
                </Button>
                <Button
                  size="lg"
                  disabled={!address.street || !address.city}
                  onClick={() => setStep(2)}
                >
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Payment <span className="text-primary-600">Method</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-2 border-primary-600 bg-primary-50/50 shadow-none cursor-pointer">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white">
                      <Truck className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Cash on Delivery</h4>
                      <p className="text-xs text-gray-500">Pay when you receive the product.</p>
                    </div>
                    <CheckCircle2 className="ml-auto h-6 w-6 text-primary-600" />
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm opacity-50 cursor-not-allowed">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-400">Online Payment</h4>
                      <p className="text-xs text-gray-400">bKash, Nagad or Cards (Coming Soon)</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gray-900 text-white border-none shadow-xl mt-8">
                <CardContent className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-400">Order Summary</span>
                    <span className="text-gray-400">{items.length} items</span>
                  </div>
                  <div className="flex justify-between items-center text-2xl font-bold mb-8">
                    <span>Total Amount</span>
                    <span className="text-primary-500">৳{totalPrice}</span>
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full h-14 rounded-xl text-lg font-bold"
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Place Order'}
                  </Button>
                  <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-gray-500 uppercase tracking-widest">
                    <ShieldCheck className="h-3 w-3" />
                    Secure Transaction Guaranteed
                  </div>
                </CardContent>
              </Card>
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shipping
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-20 bg-white rounded-3xl shadow-xl border-none animate-fade-in animate-slide-up">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 scale-125">
                <CheckCircle2 className="h-14 w-14 text-primary-600 animate-bounce" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                Thank you for your purchase. Your order number is{' '}
                <span className="font-bold text-gray-900">#{orderId}</span>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center px-6">
                <Link href="/orders">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto h-14 rounded-xl px-10"
                  >
                    Track Order
                  </Button>
                </Link>
                <Link href="/">
                  <Button size="lg" className="w-full sm:w-auto h-14 rounded-xl px-10">
                    Back to Shopping
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
