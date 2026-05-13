import { Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { memo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchBestSellingProducts } from "@/store/shop/products-slice"
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice"
import { useToast } from "@/components/ui/use-toast"
import { categoryOptionsMap } from "@/config"
import { formatPrice } from "@/lib/format-price"

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < Math.round(rating || 0)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  )
}

function BestSellers() {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const { bestSellersList } = useSelector((state) => state.shopProducts)
  const { user } = useSelector((state) => state.auth)
  const [cartLoading, setCartLoading] = useState(false)

  useEffect(() => {
    if (bestSellersList?.length === 0) dispatch(fetchBestSellingProducts())
  }, [dispatch, bestSellersList?.length])

  function handleAddtoCart(productId) {
    if (cartLoading) return;
    if (!user?.id) {
      toast({ title: "Please login to add items to cart" })
      return
    }
    setCartLoading(true);
    dispatch(
      addToCart({
        userId: user?.id,
        productId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id))
        toast({ title: "Added to cart" })
      }
    }).finally(() => setCartLoading(false));
  }

  return (
    <section className="py-10 sm:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-sm tracking-[4px] uppercase text-[#6B1E2E] font-medium">
            Best Sellers
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 text-gray-900">
            Most Loved by Customers
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-[#6B1E2E] to-yellow-500 mx-auto mt-4" />
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Our top-selling products trusted by thousands of happy customers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellersList?.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative overflow-hidden bg-gray-50 aspect-[3/4]">
                <img
                  src={product.image}
                  alt={product.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge className="absolute top-3 left-3 bg-[#6B1E2E] text-white text-xs font-semibold px-3 py-1">
                  Best Seller
                </Badge>
              </div>

              <div className="p-3 sm:p-4">
                <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider mb-1">
                  {categoryOptionsMap[product.category] || product.category}
                </p>
                <h3 className="font-semibold text-gray-900 text-xs sm:text-sm leading-snug mb-2 line-clamp-2">
                  {product.title}
                </h3>

                <div className="flex items-center gap-2 mb-2">
                  <StarRating rating={product.averageReview} />
                  <span className="text-xs text-gray-400">
                    ({product.averageReview || 0})
                  </span>
                </div>

                <p className="text-base sm:text-lg font-bold text-[#6B1E2E] mb-3">
                  {formatPrice(product.salePrice || product.price)}
                  {product.salePrice && (
                    <span className="text-sm text-gray-400 line-through ml-2">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </p>

                <Button
                  onClick={() => handleAddtoCart(product._id)}
                  loading={cartLoading}
                  loadingText="Adding..."
                  className="w-full bg-[#6B1E2E] hover:bg-[#5a1927] text-white text-xs sm:text-sm gap-2 transition-all duration-300 min-h-[40px] sm:min-h-0"
                >
                  <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

export default memo(BestSellers)
