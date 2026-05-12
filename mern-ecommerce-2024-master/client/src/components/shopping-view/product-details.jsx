import { StarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import { formatPrice } from "@/lib/format-price";

function getDiscountPercent(price, salePrice) {
  if (!salePrice || salePrice <= 0 || !price || price <= 0) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

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

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    if (cartLoading) return;

    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
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

    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
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

    setRating(0);
    setReviewMsg("");
    setActiveImg(0);
  }

  function handleAddReview() {
    if (reviewLoading) return;

    setReviewLoading(true);

    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    )
      .then((data) => {
        if (data.payload.success) {
          setRating(0);
          setReviewMsg("");

          dispatch(getReviews(productDetails?._id));

          toast({
            title: "Review added successfully!",
          });
        }
      })
      .finally(() => setReviewLoading(false));
  }

  useEffect(() => {
    if (productDetails !== null)
      dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce(
          (sum, reviewItem) =>
            sum + reviewItem.reviewValue,
          0
        ) / reviews.length
      : 0;

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

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />
            </div>

            <span className="text-muted-foreground text-sm">
              ({averageReview.toFixed(2)})
            </span>

            {reviews?.length > 0 && (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Verified
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 sm:mt-5 mb-4 sm:mb-5">
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

          <Separator />

          {/* Reviews */}
          <div className="max-h-[300px] overflow-auto mt-4">
            <h2 className="text-lg font-bold mb-4">
              Reviews
            </h2>

            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div
                    className="flex gap-4"
                    key={reviewItem._id}
                  >
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">
                          {reviewItem?.userName}
                        </h3>

                        <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                          Verified Purchase
                        </span>
                      </div>

                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent
                          rating={
                            reviewItem?.reviewValue
                          }
                        />
                      </div>

                      <p className="text-muted-foreground">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1 className="text-sm text-gray-400">
                  No Reviews
                </h1>
              )}
            </div>

            {/* Write Review */}
            <div className="mt-6 flex-col flex gap-2 border rounded-lg p-4 bg-gray-50">
              <Label className="font-semibold">
                Write a review
              </Label>

              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={
                    handleRatingChange
                  }
                />
              </div>

              <Textarea
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) =>
                  setReviewMsg(event.target.value)
                }
                placeholder="Write a review..."
                className="min-h-[80px]"
              />

              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === ""}
                loading={reviewLoading}
                loadingText="Submitting..."
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;