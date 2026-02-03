'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  imageUrl: string;
  category: { name: string };
  stock: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Card className="group overflow-hidden border-none shadow-none hover:shadow-xl transition-all h-full bg-white flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={
            product.imageUrl ||
            'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=300'
          }
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full shadow-lg bg-white/90 text-primary-600 hover:bg-white"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>
        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute bottom-3 left-3 bg-accent-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-md">
            Only {product.stock} left
          </div>
        )}
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="text-[10px] font-bold text-primary-600 uppercase tracking-wider mb-1">
          {product.category?.name || 'Uncategorized'}
        </div>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mt-1 text-accent-500">
          <Star className="h-3 w-3 fill-current" />
          <span className="text-xs font-bold text-gray-500">4.5</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2">
        <div>
          <span className="text-lg font-bold text-gray-900">৳{product.price}</span>
          <span className="text-[10px] text-gray-500 ml-1">/{product.unit}</span>
        </div>
        <Button
          size="sm"
          className="rounded-full shadow-md"
          onClick={() => addItem({ ...product, quantity: 1 })}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}
