import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const itemPrice = cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price;
  const itemSavings = cartItem?.salePrice > 0
    ? ((cartItem?.price - cartItem?.salePrice) * cartItem?.quantity).toFixed(2)
    : 0;

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction == "plus") {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );
        const getTotalStock = productList[getCurrentProductIndex].totalStock;

        console.log(getCurrentProductIndex, getTotalStock, "getTotalStock");

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

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is updated successfully",
        });
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is deleted successfully",
        });
      }
    });
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
        {cartItem?.salePrice > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="line-through">${cartItem?.price}</span>
            <span className="text-green-600 font-medium">Save ${((cartItem?.price - cartItem?.salePrice)).toFixed(2)}</span>
          </div>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          <Button
            variant="outline"
            className="size-8 sm:size-9 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
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
          >
            <Plus className="size-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end shrink-0">
        <p className="font-semibold text-sm sm:text-base whitespace-nowrap">
          ${(itemPrice * cartItem?.quantity).toFixed(2)}
        </p>
        <button
          onClick={() => handleCartItemDelete(cartItem)}
          className="mt-1.5 p-1.5 hover:bg-destructive/10 rounded-full transition-colors"
          aria-label="Delete item"
        >
          <Trash className="size-4 sm:size-5 text-destructive" />
        </button>
      </div>
    </div>
  );
}

export default UserCartItemsContent;
