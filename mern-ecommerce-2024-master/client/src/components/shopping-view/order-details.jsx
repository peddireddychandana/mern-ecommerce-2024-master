import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { formatPrice } from "@/lib/format-price";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogContent className="sm:max-w-[600px] max-w-[95vw] p-4 sm:p-6">
      <div className="grid gap-4 sm:gap-6">
        <div className="grid gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
            <p className="font-medium text-sm sm:text-base">Order ID</p>
            <Label className="text-sm sm:text-base break-all">{orderDetails?._id}</Label>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
            <p className="font-medium text-sm sm:text-base">Order Date</p>
            <Label className="text-sm sm:text-base">{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
            <p className="font-medium text-sm sm:text-base">Order Price</p>
            <Label className="text-sm sm:text-base">{formatPrice(orderDetails?.totalAmount)}</Label>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
            <p className="font-medium text-sm sm:text-base">Payment method</p>
            <Label className="text-sm sm:text-base">{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
            <p className="font-medium text-sm sm:text-base">Payment Status</p>
            <Label className="text-sm sm:text-base">{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
            <p className="font-medium text-sm sm:text-base">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 text-xs sm:text-sm ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-black"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item) => (
                    <li className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 p-2 bg-muted/30 rounded-md">
                      <span className="text-sm">Title: {item.title}</span>
                      
                      <span className="text-sm">Qty: {item.quantity}</span>
                      <span className="text-sm font-medium">Price: {formatPrice(item.price)}</span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
