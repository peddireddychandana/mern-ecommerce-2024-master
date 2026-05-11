import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNewOrder, confirmUPIPayment } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import { QRCodeSVG } from "qrcode.react";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { orderId } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [orderCreated, setOrderCreated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const UPI_ID = "125006216930@cnrb";
  const BUSINESS_NAME = "SRI RAMAKRISHNA TEXTILES";
  const PHONE_NUMBERS = ["7702123357", "7013820268"];

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  function getUPILink() {
    return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(BUSINESS_NAME)}&mc=5137&tr=${orderId}&am=${totalCartAmount}&cu=INR&tn=${orderId}&refUrl=http://npci.org/upi/schema/`;
  }

  function getUPIQRValue() {
    return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(BUSINESS_NAME)}&mc=5137&tr=${orderId}&am=${totalCartAmount}&cu=INR&refUrl=http://npci.org/upi/schema/`;
  }

  function handlePlaceOrder() {
    if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod,
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      setIsProcessing(false);
      if (data?.payload?.success) {
        setOrderCreated(true);
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(data.payload.orderId)
        );
        toast({
          title: "Order created! Please complete the payment.",
        });
      } else {
        toast({
          title: "Failed to create order. Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  function handlePayWithUPI() {
    const upiLink = getUPILink();
    window.location.href = upiLink;
  }

  function handleConfirmPayment() {
    setIsConfirming(true);
    const storedOrderId = JSON.parse(
      sessionStorage.getItem("currentOrderId")
    );

    dispatch(
      confirmUPIPayment({
        orderId: storedOrderId,
        transactionRef: "UPI-" + Date.now(),
      })
    ).then((data) => {
      setIsConfirming(false);
      if (data?.payload?.success) {
        setPaymentConfirmed(true);
        sessionStorage.removeItem("currentOrderId");
        toast({
          title: "Payment submitted for admin verification.",
        });
      } else {
        toast({
          title: "Payment confirmation failed. Please contact support.",
          variant: "destructive",
        });
      }
    });
  }

  if (paymentConfirmed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-md w-full text-center">
          <div className="text-4xl sm:text-6xl mb-4">&#10003;</div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            Payment Submitted for Verification
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Your payment is being verified by the admin. You will receive a confirmation once approved.
          </p>
          <p className="text-sm text-gray-500 mb-4 sm:mb-6 break-all">
            Order ID: {orderId}
          </p>
          <Button
            onClick={() => navigate("/shop/account")}
            className="w-full"
          >
            View Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative h-[120px] sm:h-[200px] md:h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 mt-4 sm:mt-5 p-3 sm:p-5 max-w-7xl mx-auto w-full">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-3 sm:gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent key={item.productId} cartItem={item} />
              ))
            : null}

          <div className="mt-4 sm:mt-8 space-y-3 sm:space-y-4">
            <div className="flex justify-between text-base sm:text-lg">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>

          {!orderCreated && (
            <div className="mt-3 sm:mt-4 space-y-3">
              <div className="space-y-2">
                <label className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border rounded-md cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2">
                    <span className="font-medium text-sm sm:text-base">Pay via UPI</span>
                    <span className="text-xs sm:text-sm text-gray-500">
                      (Google Pay / PhonePe / Paytm / BHIM)
                    </span>
                  </div>
                </label>
                <label className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border rounded-md cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="phonepe"
                    checked={paymentMethod === "phonepe"}
                    onChange={() => setPaymentMethod("phonepe")}
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2">
                    <span className="font-medium text-sm sm:text-base">Pay via Phone Number</span>
                    <span className="text-xs sm:text-sm text-gray-500">
                      (GPay / PhonePe)
                    </span>
                  </div>
                </label>
              </div>

              <Button
                onClick={handlePlaceOrder}
                className="w-full text-sm sm:text-base py-2 sm:py-3"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </Button>
            </div>
          )}

          {orderCreated && !paymentConfirmed && (
            <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4 p-3 sm:p-4 border rounded-md bg-blue-50">
              <p className="text-xs sm:text-sm font-semibold text-blue-800 text-center">
                Pay <span className="text-base sm:text-lg">${totalCartAmount}</span> using any UPI app:
              </p>

              <div className="flex justify-center">
                <div className="bg-white p-2 sm:p-3 rounded-lg">
                  <QRCodeSVG value={getUPIQRValue()} size={160} className="w-full max-w-[160px] sm:max-w-[180px]" />
                </div>
              </div>

              <div className="bg-white rounded-md p-2 sm:p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Or pay to Phone Number</p>
                {PHONE_NUMBERS.map((num) => (
                  <div key={num} className="flex items-center justify-center gap-1 sm:gap-2">
                    <p className="text-base sm:text-lg font-bold text-gray-800 select-all text-xs sm:text-sm">{num}</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(num);
                        toast({ title: `Phone number ${num} copied!` });
                      }}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>

              <ol className="text-xs sm:text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Open your UPI app and send payment to the scanned QR or phone number</li>
                <li>Complete the payment in the app</li>
                <li>Return here and click "I have paid"</li>
              </ol>

              <Button
                onClick={handleConfirmPayment}
                className="w-full text-sm sm:text-base py-2 sm:py-3"
                disabled={isConfirming}
              >
                {isConfirming ? "Confirming..." : "I have paid"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
