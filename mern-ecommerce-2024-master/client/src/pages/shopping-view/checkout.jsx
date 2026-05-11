import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createNewOrder, uploadPaymentScreenshot, confirmUPIPayment } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import { QRCodeSVG } from "qrcode.react";
import { UploadCloudIcon, FileIcon, XIcon, Loader2 } from "lucide-react";

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
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [screenshotUrl, setScreenshotUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [fileError, setFileError] = useState("");
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const UPI_ID = "125006216930@cnrb";
  const BUSINESS_NAME = "SRI RAMAKRISHNA TEXTILES";
  const PHONE_NUMBERS = ["7702123357", "7013820268"];
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

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

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileError("");

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setFileError("Only JPG and PNG files are allowed");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError("File size must be less than 5MB");
      return;
    }

    setScreenshotFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setScreenshotPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveScreenshot() {
    setScreenshotFile(null);
    setScreenshotPreview(null);
    setScreenshotUrl(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    setFileError("");

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setFileError("Only JPG and PNG files are allowed");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError("File size must be less than 5MB");
      return;
    }

    setScreenshotFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setScreenshotPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  async function handleConfirmPayment() {
    setIsConfirming(true);

    const storedOrderId = JSON.parse(
      sessionStorage.getItem("currentOrderId")
    );

    try {
      let uploadedUrl = screenshotUrl;

      if (screenshotFile && !uploadedUrl) {
        setIsUploading(true);
        const uploadResult = await dispatch(uploadPaymentScreenshot(screenshotFile)).unwrap();
        if (uploadResult?.success) {
          uploadedUrl = uploadResult.screenshotUrl;
          setScreenshotUrl(uploadedUrl);
        } else {
          throw new Error("Screenshot upload failed");
        }
        setIsUploading(false);
      }

      const result = await dispatch(
        confirmUPIPayment({
          orderId: storedOrderId,
          transactionRef: transactionId || "UPI-" + Date.now(),
          screenshotUrl: uploadedUrl,
        })
      ).unwrap();

      if (result?.success) {
        setPaymentConfirmed(true);
        sessionStorage.removeItem("currentOrderId");
        toast({
          title: "Payment submitted for admin verification.",
        });
      } else {
        throw new Error("Payment confirmation failed");
      }
    } catch (error) {
      setIsConfirming(false);
      setIsUploading(false);
      toast({
        title: error?.message || "Payment confirmation failed. Please contact support.",
        variant: "destructive",
      });
    }
  }

  if (paymentConfirmed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            Payment Submitted Successfully!
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-2">
            Your payment is being verified by the admin.
          </p>
          <p className="text-sm font-medium text-amber-600 mb-4">
            Your payment will be verified within 5-10 minutes.
          </p>
          <p className="text-xs text-gray-500 mb-4 sm:mb-6 break-all">
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

              <div className="text-xs sm:text-sm text-blue-700 space-y-1">
                <p className="font-medium">Instructions:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Pay using any UPI app (Google Pay / PhonePe / Paytm)</li>
                  <li>After successful payment, upload your screenshot below</li>
                </ol>
              </div>

              <div className="border-2 border-dashed rounded-lg p-4 bg-white" onDragOver={handleDragOver} onDrop={handleDrop}>
                <Input
                  id="screenshot-upload"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  ref={inputRef}
                  onChange={handleFileChange}
                />
                {!screenshotFile ? (
                  <Label htmlFor="screenshot-upload" className="flex flex-col items-center justify-center min-h-[100px] cursor-pointer">
                    <UploadCloudIcon className="w-8 h-8 text-blue-500 mb-2" />
                    <span className="text-xs sm:text-sm text-gray-600">Upload payment screenshot (JPG/PNG, max 5MB)</span>
                  </Label>
                ) : screenshotPreview ? (
                  <div className="relative">
                    <img src={screenshotPreview} alt="Payment screenshot preview" className="w-full max-h-[200px] object-contain rounded-md" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={handleRemoveScreenshot}
                    >
                      <XIcon className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center min-w-0">
                      <FileIcon className="w-6 h-6 text-blue-500 mr-2 shrink-0" />
                      <p className="text-xs sm:text-sm font-medium truncate">{screenshotFile.name}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={handleRemoveScreenshot}>
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              {fileError && (
                <p className="text-xs text-red-600">{fileError}</p>
              )}

              <div className="space-y-1">
                <Label htmlFor="transactionId" className="text-xs text-blue-800">
                  Transaction ID (optional)
                </Label>
                <Input
                  id="transactionId"
                  type="text"
                  placeholder="Enter UPI transaction reference ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="text-sm"
                />
              </div>

              <Button
                onClick={handleConfirmPayment}
                className="w-full text-sm sm:text-base py-2 sm:py-3"
                disabled={!screenshotFile || isConfirming || isUploading}
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading screenshot...
                  </span>
                ) : isConfirming ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "I have paid"
                )}
              </Button>

              <p className="text-xs text-center text-blue-600">
                Your payment will be verified within 5-10 minutes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
