import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import { formatPrice } from "@/lib/format-price";

function getDiscountPercent(price, salePrice) {
  if (!salePrice || salePrice <= 0 || !price || price <= 0) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [cartLoading, setCartLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  const { toast } = useToast();
  const navigate = useNavigate();

  const discount = getDiscountPercent(
    productDetails?.price,
    productDetails?.salePrice
  );

  const savings =
    productDetails?.salePrice > 0
      ? productDetails?.price - productDetails?.salePrice
      : 0;

  const images = productDetails?.images?.filter(Boolean)?.length
    ? productDetails.images.filter(Boolean)
    : productDetails?.image
    ? [productDetails.image]
    : [];

  const imageViews = images.map((url, i) => ({
    url,
    label: i === 0 ? "Front" : `View ${i + 1}`,
  }));

  const hasSizes = productDetails?.sizes?.length > 0;
  const hasColors = productDetails?.colors?.length > 0;
  const highlights = [
    productDetails?.fabric && { label: "Fabric", value: productDetails.fabric },
    productDetails?.length && { label: "Length", value: productDetails.length },
    productDetails?.typeOfPiece && { label: "Type", value: productDetails.typeOfPiece },
    productDetails?.occasion && { label: "Occasion", value: productDetails.occasion },
  ].filter(Boolean);

  function validateSelection() {
    if (hasSizes && !selectedSize) {
      toast({ title: "Please select a size", variant: "destructive" });
      return false;
    }
    if (hasColors && !selectedColor) {
      toast({ title: "Please select a color", variant: "destructive" });
      return false;
    }
    return true;
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    if (cartLoading) return;
    if (!validateSelection()) return;

    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId && item.selectedSize === selectedSize && item.selectedColor === selectedColor
      );

      if (indexOfCurrentItem > -1) {
        const getQuantity =
          getCartItems[indexOfCurrentItem].quantity;

        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }

    setCartLoading(true);

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
        selectedSize,
        selectedColor,
      })
    )
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id));

          toast({
            title: "Product is added to cart",
          });
        }
      })
      .finally(() => setCartLoading(false));
  }

  function handleBuyNow(getCurrentProductId, getTotalStock) {
    if (buyLoading) return;
    if (!validateSelection()) return;

    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId && item.selectedSize === selectedSize && item.selectedColor === selectedColor
      );

      if (indexOfCurrentItem > -1) {
        const getQuantity =
          getCartItems[indexOfCurrentItem].quantity;

        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }

    setBuyLoading(true);

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
        selectedSize,
        selectedColor,
      })
    )
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id));

          handleDialogClose();

          navigate("/shop/checkout");
        }
      })
      .finally(() => setBuyLoading(false));
  }

  function handleDialogClose() {
    setOpen(false);

    dispatch(setProductDetails());

    setActiveImg(0);
    setSelectedSize("");
    setSelectedColor("");
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 p-4 sm:p-8 max-w-[95vw] sm:max-w-[90vw] lg:max-w-[75vw] overflow-y-auto max-h-[90vh]">
        
        {/* LEFT COLUMN */}
        <div>
          <div className="relative overflow-hidden rounded-lg bg-gray-50 aspect-[3/4] sm:aspect-square mb-3">
            <img
              src={imageViews[activeImg]?.url}
              alt={`${productDetails?.title} - ${imageViews[activeImg]?.label}`}
              style={{
                filter:
                  imageViews[activeImg]?.filter || "none",
              }}
              className="w-full h-full object-cover transition-all duration-300"
            />

            {imageViews.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImg((p) =>
                      p > 0
                        ? p - 1
                        : imageViews.length - 1
                    )
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>

                <button
                  onClick={() =>
                    setActiveImg((p) =>
                      p < imageViews.length - 1
                        ? p + 1
                        : 0
                    )
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white shadow-sm"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 mb-4">
            {imageViews.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                  activeImg === i
                    ? "border-[#6B1E2E] ring-1 ring-[#6B1E2E]/30"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.label}
                  className="w-full h-full object-cover"
                  style={{
                    filter: img.filter || "none",
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <div>
            <h1 className="text-xl sm:text-3xl font-extrabold">
              {productDetails?.title}
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg mt-2 sm:mt-4">
              {productDetails?.description}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap mt-4">
            {productDetails?.salePrice > 0 ? (
              <>
                <p className="text-2xl sm:text-3xl font-bold text-[#6B1E2E]">
                  {formatPrice(
                    productDetails?.salePrice
                  )}
                </p>

                <p className="text-lg sm:text-xl line-through text-muted-foreground">
                  {formatPrice(productDetails?.price)}
                </p>

                {discount > 0 && (
                  <Badge className="bg-green-500 hover:bg-green-600 text-xs sm:text-sm">
                    {discount}% OFF
                  </Badge>
                )}
              </>
            ) : (
              <p className="text-2xl sm:text-3xl font-bold text-[#6B1E2E]">
                {formatPrice(productDetails?.price)}
              </p>
            )}
          </div>

          {savings > 0 && (
            <p className="text-sm font-medium text-green-600 mt-1">
              Save {formatPrice(savings)} on this item
            </p>
          )}

          {/* Highlights */}
          {highlights.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 mb-2">Product Highlights</h3>
              <div className="grid grid-cols-2 gap-2">
                {highlights.map((h) => (
                  <div key={h.label} className="flex items-center gap-1.5">
                    <span className="text-[11px] font-medium text-gray-400 uppercase min-w-[52px]">{h.label}:</span>
                    <span className="text-xs font-semibold text-gray-700">{h.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {hasSizes && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Size {selectedSize && <span className="text-[#6B1E2E]">: {selectedSize}</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {productDetails.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(selectedSize === s ? "" : s)}
                    className={`min-w-[40px] h-9 rounded-lg text-sm font-medium border transition-all ${
                      selectedSize === s
                        ? "bg-[#6B1E2E] text-white border-[#6B1E2E] shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#6B1E2E] hover:text-[#6B1E2E]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {hasColors && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Color {selectedColor && <span className="text-[#6B1E2E]">: {selectedColor}</span>}
              </p>
              <div className="flex flex-wrap gap-3">
                {productDetails.colors.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedColor(selectedColor === c.name ? "" : c.name)}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <span
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === c.name
                          ? "border-[#6B1E2E] ring-1 ring-[#6B1E2E]/30 scale-110"
                          : "border-gray-200 group-hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: c.value }}
                    />
                    <span className={`text-[10px] font-medium ${
                      selectedColor === c.name ? "text-[#6B1E2E]" : "text-gray-400"
                    }`}>
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-5 mb-4 sm:mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() =>
                    handleAddToCart(
                      productDetails?._id,
                      productDetails?.totalStock
                    )
                  }
                  loading={cartLoading}
                  loadingText="Adding..."
                >
                  Add to Cart
                </Button>

                <Button
                  className="flex-1"
                  onClick={() =>
                    handleBuyNow(
                      productDetails?._id,
                      productDetails?.totalStock
                    )
                  }
                  loading={buyLoading}
                  loadingText="Redirecting..."
                >
                  Buy now
                </Button>
              </div>
            )}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;