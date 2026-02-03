'use client';

import { useQuery } from '@tanstack/react-query';
import { Package, Clock, CheckCircle, Truck, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api-client';
import { cn } from '@/lib/utils';

export default function OrdersPage() {
  const { user } = useAuthStore();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await api.get('/orders');
      return data;
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-5 w-5 text-accent-500" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-primary-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'delivered':
        return <Package className="h-5 w-5 text-green-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-accent-50 text-accent-700 border-accent-100';
      case 'confirmed':
        return 'bg-primary-50 text-primary-700 border-primary-100';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Order <span className="text-primary-600">History</span>
            </h1>
            <div className="text-sm text-gray-500">
              Welcome back, <span className="font-bold text-gray-900">{user?.name}</span>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : orders?.length > 0 ? (
            <div className="space-y-6 animate-fade-in">
              {orders.map((order: any) => (
                <Card
                  key={order.id}
                  className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden group"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Order info */}
                      <div className="p-6 md:w-2/3 border-b md:border-b-0 md:border-r border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                              Order ID
                            </div>
                            <div className="font-bold text-gray-900">#{order.orderNumber}</div>
                          </div>
                          <div
                            className={cn(
                              'px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2',
                              getStatusColor(order.status),
                            )}
                          >
                            {getStatusIcon(order.status)}
                            {order.status.toUpperCase()}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
                          <div>
                            <div className="text-gray-400 mb-1">Date</div>
                            <div className="font-medium text-gray-900">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">Items</div>
                            <div className="font-medium text-gray-900">
                              {order.items?.length || 0} Products
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">Shipping To</div>
                            <div className="font-medium text-gray-900 truncate max-w-[150px]">
                              {order.shippingAddress?.city}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Summary actions */}
                      <div className="p-6 md:w-1/3 bg-gray-50/50 flex flex-col justify-between items-end">
                        <div className="text-right">
                          <div className="text-gray-400 text-[10px] uppercase font-bold mb-1">
                            Total Amount
                          </div>
                          <div className="text-2xl font-bold text-primary-600">
                            ৳{order.totalAmount}
                          </div>
                        </div>
                        <Link href={`/orders/${order.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white group-hover:bg-primary-600 group-hover:text-white transition-all rounded-full px-6"
                          >
                            View Details <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-10 w-10 text-gray-300" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
              <p className="text-gray-500 mb-6">Start shopping to see your order history here.</p>
              <Link href="/products">
                <Button className="rounded-full px-8">Browse Products</Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
