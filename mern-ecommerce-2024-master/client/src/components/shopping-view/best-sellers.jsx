import { Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import img1 from "../../assets/pexels1.jpg"
import img2 from "../../assets/pexels2.jpg"
import img3 from "../../assets/pexels3.jpg"
import img4 from "../../assets/yellow.jpg"

const bestSellers = [
  {
    id: 1,
    name: "Pure Kanchipattu Silk Saree",
    category: "Sarees",
    price: 4999,
    image: img1,
    rating: 5,
    reviews: 128,
  },
  {
    id: 2,
    name: "Premium Cotton Formal Shirt",
    category: "Men's Shirts",
    price: 1299,
    image: img3,
    rating: 4,
    reviews: 96,
  },
  {
    id: 3,
    name: "Festival Dress Material",
    category: "Dress Materials",
    price: 2499,
    image: img2,
    rating: 5,
    reviews: 204,
  },
  {
    id: 4,
    name: "Superfine Cotton Fabric",
    category: "Fabrics",
    price: 799,
    image: img4,
    rating: 4,
    reviews: 312,
  },
]

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  )
}

function BestSellers() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-sm tracking-[4px] uppercase text-[#6B1E2E] font-medium">
            Best Sellers
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">
            Most Loved by Customers
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-[#6B1E2E] to-yellow-500 mx-auto mt-4" />
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Our top-selling products trusted by thousands of happy customers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[200px] sm:h-[280px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge className="absolute top-3 left-3 bg-[#6B1E2E] text-white text-xs font-semibold px-3 py-1">
                  Best Seller
                </Badge>
              </div>

              <div className="p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  {product.category}
                </p>
                <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 mb-2">
                  <StarRating rating={product.rating} />
                  <span className="text-xs text-gray-400">
                    ({product.reviews})
                  </span>
                </div>

                <p className="text-lg font-bold text-[#6B1E2E] mb-3">
                  ₹{product.price.toLocaleString()}
                </p>

                <Button className="w-full bg-[#6B1E2E] hover:bg-[#5a1927] text-white text-sm gap-2 transition-all duration-300">
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BestSellers
