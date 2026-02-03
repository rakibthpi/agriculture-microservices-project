'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, User, Menu, X, Search, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const itemsCount = useCartStore((state) => state.items.length);

  return (
    <header className="sticky top-0 z-50 w-full glass shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition-transform">
            <span className="text-xl font-bold">A</span>
          </div>
          <span className="text-xl font-bold text-gray-900 hidden sm:block">
            Agri<span className="text-primary-600">Market</span>
          </span>
        </Link>

        {/* Search - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md relative group">
          <Input
            placeholder="Search products..."
            className="pl-10 group-hover:border-primary-400 transition-colors"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link
            href="/products"
            className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
          >
            Products
          </Link>
          <Link
            href="/categories"
            className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
          >
            Categories
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative hover:text-primary-600">
              <ShoppingCart className="h-6 w-6" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </Button>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 ml-2">
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
                  <User className="h-4 w-4" />
                  <span>{user?.name}</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="hover:text-accent-600"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'lg:hidden absolute top-16 left-0 w-full bg-white border-b shadow-lg transition-all duration-300 ease-in-out',
          isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none',
        )}
      >
        <div className="flex flex-col p-4 gap-4">
          <div className="relative">
            <Input placeholder="Search..." className="w-full pl-10" />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <Link href="/products" className="text-lg font-medium p-2 hover:bg-gray-50 rounded-lg">
            Products
          </Link>
          <Link href="/categories" className="text-lg font-medium p-2 hover:bg-gray-50 rounded-lg">
            Categories
          </Link>
          <hr />
          {isAuthenticated ? (
            <>
              <Link href="/profile" className="text-lg font-medium p-2 hover:bg-gray-50 rounded-lg">
                Profile
              </Link>
              <button
                onClick={logout}
                className="text-lg font-medium p-2 text-left text-red-600 hover:bg-red-50 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="w-full">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
