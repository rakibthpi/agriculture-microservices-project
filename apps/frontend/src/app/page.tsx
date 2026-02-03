export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">🌾 Agriculture Marketplace</h1>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Fresh farm products delivered directly from farmers to your doorstep. Quality produce at fair prices.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/products"
                className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
              >
                Browse Products
              </a>
              <a
                href="/auth/register"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-700 transition"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-primary-50">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Fresh & Organic</h3>
              <p className="text-gray-600">Direct from farms, ensuring freshness and quality in every product.</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-accent-50">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable delivery to your doorstep.</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-primary-50">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Fair Prices</h3>
              <p className="text-gray-600">Competitive prices with no middleman markup.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Preview */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {name: "Rice & Grains", emoji: "🍚", color: "bg-amber-100"},
              {name: "Vegetables", emoji: "🥬", color: "bg-green-100"},
              {name: "Fruits", emoji: "🍎", color: "bg-red-100"},
              {name: "Spices", emoji: "🌶️", color: "bg-orange-100"},
            ].map((cat) => (
              <div
                key={cat.name}
                className={`${cat.color} rounded-xl p-6 text-center hover:shadow-lg transition cursor-pointer`}
              >
                <div className="text-5xl mb-3">{cat.emoji}</div>
                <h3 className="font-semibold text-gray-800">{cat.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2024 Agriculture Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
