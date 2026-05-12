import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import { formatPrice } from "@/lib/format-price";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const [loadingAction, setLoadingAction] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const itemPrice = cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price;
  const itemSavings = cartItem?.salePrice > 0
    ? (cartItem?.price - cartItem?.salePrice) * cartItem?.quantity
    : 0;

  const COLOR_HEX = {
    Red: "#DC2626", Blue: "#2563EB", Black: "#1F2937", White: "#F9FAFB", Green: "#16A34A",
  };

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (loadingAction) return;
    if (typeOfAction == "plus") {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId && item.selectedSize === (getCartItem?.selectedSize || "") && item.selectedColor === (getCartItem?.selectedColor || "")
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );
        const getTotalStock = getCurrentProductIndex >= 0 ? productList[getCurrentProductIndex].totalStock : 999;

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getQuantity} quantity can be added for this item`,
              variant: "destructive",
            });

            return;
          }
        }
      }
    }

    setLoadingAction(typeOfAction);
    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
        selectedSize: getCartItem?.selectedSize,
        selectedColor: getCartItem?.selectedColor,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is updated successfully",
        });
      }
    }).finally(() => setLoadingAction(null));
  }

  function handleCartItemDelete(getCartItem) {
    if (deleting) return;
    setDeleting(true);
    dispatch(
      deleteCartItem({
        userId: user?.id,
        productId: getCartItem?.productId,
        selectedSize: getCartItem?.selectedSize,
        selectedColor: getCartItem?.selectedColor,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is deleted successfully",
        });
      }
    }).finally(() => setDeleting(false));
  }

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="size-14 sm:size-20 rounded object-cover shrink-0"
      />
      <div className="min-w-0 flex-1">
        <h3 className="font-extrabold text-sm sm:text-base truncate">{cartItem?.title}</h3>
        {(cartItem?.selectedSize || cartItem?.selectedColor) && (
          <div className="flex items-center gap-2 mt-0.5">
            {cartItem?.selectedSize && (
              <span className="text-[11px] font-medium text-gray-500">Size: {cartItem.selectedSize}</span>
            )}
            {cartItem?.selectedColor && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-gray-500">
                Color:
                <span
                  className="inline-block w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: COLOR_HEX[cartItem.selectedColor] || cartItem.selectedColor }}
                />
                {cartItem.selectedColor}
              </span>
            )}
          </div>
        )}
        {cartItem?.salePrice > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="line-through">{formatPrice(cartItem?.price)}</span>
            <span className="text-green-600 font-medium">Save {formatPrice(cartItem?.price - cartItem?.salePrice)}</span>
          </div>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          <Button
            variant="outline"
            className="size-8 sm:size-9 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1 || !!loadingAction}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
            loading={loadingAction === "minus"}
            loadingText=""
          >
            <Minus className="size-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold min-w-[1.5rem] text-center">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="size-8 sm:size-9 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
            disabled={!!loadingAction}
            loading={loadingAction === "plus"}
            loadingText=""
          >
            <Plus className="size-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end shrink-0">
        <p className="font-semibold text-sm sm:text-base whitespace-nowrap">
          {formatPrice(itemPrice * cartItem?.quantity)}
        </p>
        <button
          onClick={() => handleCartItemDelete(cartItem)}
          className="mt-1.5 p-1.5 hover:bg-destructive/10 rounded-full transition-colors"
          aria-label="Delete item"
          disabled={deleting}
        >
          {deleting ? <span className="size-4 sm:size-5 block" /> : <Trash className="size-4 sm:size-5 text-destructive" />}
        </button>
      </div>
    </div>
  );
}

export default UserCartItemsContent;
