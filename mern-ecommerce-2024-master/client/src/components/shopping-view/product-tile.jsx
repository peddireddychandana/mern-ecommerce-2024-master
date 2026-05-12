import { ShoppingCart, Eye, Star } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { categoryOptionsMap } from "@/config";
import { useRef, useState } from "react";
import { formatPrice } from "@/lib/format-price";

function getDiscountPercent(price, salePrice) {
  if (!salePrice || salePrice <= 0 || !price || price <= 0) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

function ShoppingProductTile({ product, handleGetProductDetails, handleAddtoCart, handleBuyNow }) {
  const [cartLoading, setCartLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const addingRef = useRef(false);
  const discount = getDiscountPercent(product?.price, product?.salePrice);
  const isOutOfStock = product?.totalStock === 0;
  const isLowStock = !isOutOfStock && product?.totalStock < 10;
  const hasSale = product?.salePrice > 0;

  const stockBadge = product?.totalStock > 50 ? (
    <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 shadow-sm">NEW</Badge>
  ) : product?.totalStock > 20 ? (
    <Badge className="bg-amber-500 hover:bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 shadow-sm">BESTSELLER</Badge>
  ) : null;

  function onAddToCart(e) {
    e.stopPropagation();
    if (addingRef.current || isOutOfStock) return;
    addingRef.current = true;
    setCartLoading(true);
    const r = handleAddtoCart(product?._id, product?.totalStock, "", "");
    if (r && typeof r.finally === "function") {
      r.finally(() => { addingRef.current = false; setCartLoading(false); });
    } else {
      setTimeout(() => { addingRef.current = false; setCartLoading(false); }, 2000);
    }
  }

  function onBuyNow(e) {
    e.stopPropagation();
    if (buyLoading || isOutOfStock) return;
    setBuyLoading(true);
    const r = handleBuyNow(product?._id, product?.totalStock, "", "");
    if (r && typeof r.finally === "function") r.finally(() => setBuyLoading(false));
    else setTimeout(() => setBuyLoading(false), 2000);
  }

  function onQuickView(e) {
    e.stopPropagation();
    handleGetProductDetails(product?._id);
  }

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* IMAGE */}
      <div
        onClick={() => handleGetProductDetails(product?._id)}
        className="relative overflow-hidden bg-gray-50 cursor-pointer aspect-[3/4]"
      >
        {!imgLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}
        <img
          src={product?.image}
          alt={product?.title}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imgLoaded ? "opacity-100 group-hover:scale-110" : "opacity-0"
          }`}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {hasSale && discount > 0 && (
            <Badge className="bg-red-500 hover:bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 shadow-sm">{discount}% OFF</Badge>
          )}
          {stockBadge}
          {isLowStock && (
            <Badge className="bg-amber-500 hover:bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 shadow-sm">
              Only {product?.totalStock} left
            </Badge>
          )}
        </div>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <span className="text-white font-bold text-sm bg-black/60 px-4 py-1.5 rounded-full">Out of Stock</span>
          </div>
        )}

        {/* Quick View on hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={onQuickView}
            className="w-full flex items-center justify-center gap-2 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium py-2.5 rounded-lg hover:bg-white transition-colors"
          >
            <Eye className="w-4 h-4" /> Quick View
          </button>
        </div>
      </div>

      {/* PRODUCT INFO */}
      <div className="p-3 sm:p-4">
        <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider mb-1">
          {categoryOptionsMap[product?.category] || product?.category || "General"}
        </p>

        <h3
          onClick={() => handleGetProductDetails(product?._id)}
          className="font-semibold text-gray-900 text-xs sm:text-sm leading-snug mb-1.5 line-clamp-2 cursor-pointer hover:text-[#6B1E2E] transition-colors"
        >
          {product?.title}
        </h3>

        {/* Star rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-semibold text-gray-700">
            {(product?.averageReview || 0).toFixed(1)}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 flex-wrap mb-3">
          <span className="text-sm sm:text-base font-bold text-[#6B1E2E]">
            {formatPrice(product?.salePrice > 0 ? product?.salePrice : product?.price)}
          </span>
          {hasSale && (
            <>
              <span className="text-xs sm:text-sm text-gray-400 line-through">{formatPrice(product?.price)}</span>
              {discount > 0 && (
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{discount}% OFF</span>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {isOutOfStock ? (
            <Button disabled className="w-full text-xs sm:text-sm opacity-60 cursor-not-allowed" variant="outline">Out of Stock</Button>
          ) : (
            <>
              <Button
                onClick={onAddToCart}
                variant="outline"
                className="flex-1 h-9 text-xs sm:text-sm gap-1.5 px-2"
                loading={cartLoading}
                loadingText=""
              >
                <ShoppingCart className="w-3.5 h-3.5 shrink-0" /> <span>Cart</span>
              </Button>
              <Button
                onClick={onBuyNow}
                className="flex-1 h-9 text-xs sm:text-sm bg-[#6B1E2E] hover:bg-[#5a1928] px-2"
                loading={buyLoading}
                loadingText=""
              >
                Buy Now
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShoppingProductTile;
