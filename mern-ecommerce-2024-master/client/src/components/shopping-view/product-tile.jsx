import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";

import { useState } from "react";
import { formatPrice } from "@/lib/format-price";

function getDiscountPercent(price, salePrice) {
  if (!salePrice || salePrice <= 0 || !price || price <= 0) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
  handleBuyNow,
}) {
  const [cartLoading, setCartLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const discount = getDiscountPercent(product?.price, product?.salePrice);

  function onAddToCart() {
    if (cartLoading) return;
    setCartLoading(true);
    const result = handleAddtoCart(product?._id, product?.totalStock);
    if (result && typeof result.finally === "function") {
      result.finally(() => setCartLoading(false));
    } else {
      setTimeout(() => setCartLoading(false), 2000);
    }
  }

  function onBuyNow() {
    if (buyLoading) return;
    setBuyLoading(true);
    const result = handleBuyNow(product?._id, product?.totalStock);
    if (result && typeof result.finally === "function") {
      result.finally(() => setBuyLoading(false));
    } else {
      setTimeout(() => setBuyLoading(false), 2000);
    }
  }

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[200px] sm:h-[300px] object-cover rounded-t-lg"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {discount > 0 ? `${discount}% OFF` : "Sale"}
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-3 sm:p-4">
          <h2 className="text-sm sm:text-lg md:text-xl font-bold mb-2 line-clamp-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm md:text-[16px] text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
              {product?.salePrice > 0 ? (
              <>
                <span className="text-sm sm:text-lg font-semibold text-primary">{formatPrice(product?.salePrice)}</span>
                <span className="text-xs sm:text-sm line-through text-muted-foreground">{formatPrice(product?.price)}</span>
                {discount > 0 && (
                  <span className="text-xs font-medium text-green-600">Save {formatPrice(product?.price - product?.salePrice)}</span>
                )}
              </>
            ) : (
              <span className="text-sm sm:text-lg font-semibold text-primary">{formatPrice(product?.price)}</span>
            )}
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-3 sm:p-4 pt-0">
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Out Of Stock
          </Button>
        ) : (
          <div className="flex gap-2 w-full">
            <Button
              onClick={onAddToCart}
              className="flex-1"
              variant="outline"
              loading={cartLoading}
              loadingText="Adding..."
            >
              Add to cart
            </Button>
            <Button
              onClick={onBuyNow}
              className="flex-1"
              loading={buyLoading}
              loadingText="Processing..."
            >
              Buy now
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
