'use client';

import { User, Mail, Phone, Shield, Settings, Bell, Package, MapPin } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-4">
              <Card className="border-none shadow-sm overflow-hidden">
                <div className="h-24 bg-primary-600"></div>
                <CardContent className="p-6 -mt-12 text-center">
                  <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4 border-4 border-white overflow-hidden">
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-600 text-3xl font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                  <p className="text-sm text-gray-500 mb-6">{user?.email}</p>
                  <Button variant="outline" size="sm" className="w-full rounded-xl">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <nav className="bg-white rounded-2xl shadow-sm p-4 space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 bg-primary-50 text-primary-700 font-bold hover:bg-primary-50"
                >
                  <User className="h-5 w-5" /> Account Information
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-gray-600 hover:text-primary-600"
                >
                  <Package className="h-5 w-5" /> My Orders
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-gray-600 hover:text-primary-600"
                >
                  <Bell className="h-5 w-5" /> Notifications
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-gray-600 hover:text-primary-600"
                >
                  <Shield className="h-5 w-5" /> Security
                </Button>
              </nav>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  Dashboard <span className="text-primary-600">Overview</span>
                </h1>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <Settings className="h-4 w-4 mr-2" /> Global Settings
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-primary-600 text-white overflow-hidden relative">
                  <div className="absolute -right-4 -bottom-4 opacity-10">
                    <Package className="w-32 h-32" />
                  </div>
                  <CardContent className="p-6">
                    <p className="text-primary-100 text-xs font-bold uppercase tracking-wider mb-2">
                      Total Orders
                    </p>
                    <h3 className="text-4xl font-bold">12</h3>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white overflow-hidden relative">
                  <CardContent className="p-6">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                      Ongoing Delivery
                    </p>
                    <h3 className="text-4xl font-bold text-gray-900">2</h3>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white overflow-hidden relative">
                  <CardContent className="p-6">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                      Account Status
                    </p>
                    <h3 className="text-4xl font-bold text-green-600 flex items-center gap-2">
                      Active <ShieldCheck className="h-8 w-8" />
                    </h3>
                  </CardContent>
                </Card>
              </div>

              {/* Information Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-gray-400">
                          Email Address
                        </div>
                        <div className="font-semibold text-gray-700">{user?.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-gray-400">
                          Phone Number
                        </div>
                        <div className="font-semibold text-gray-700">
                          {user?.phone || '+880 1XXX XXX XXX'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Default Shipping</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 text-sm max-w-[200px]">
                      You haven't set a default primary shipping address yet.
                    </p>
                    <Button size="sm" variant="secondary" className="rounded-xl px-8">
                      Add Address
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
