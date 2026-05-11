import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import { CheckCircle, XCircle, ExternalLink } from "lucide-react";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const [actionLoading, setActionLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
        });
      }
    });
  }

  function handleQuickAction(orderStatus) {
    setActionLoading(true);
    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus })
    ).then((data) => {
      setActionLoading(false);
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        toast({
          title: data?.payload?.message,
        });
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <div className="grid gap-6">
        <div className="grid gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 mt-6">
            <p className="font-medium text-sm sm:text-base">Order ID</p>
            <Label className="text-sm break-all">{orderDetails?._id}</Label>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
            <p className="font-medium text-sm sm:text-base">Order Date</p>
            <Label className="text-sm">{orderDetails?.orderDate?.split("T")[0]}</Label>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
            <p className="font-medium text-sm sm:text-base">Order Price</p>
            <Label className="text-sm">${orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
            <p className="font-medium text-sm sm:text-base">Payment method</p>
            <Label className="text-sm">{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
            <p className="font-medium text-sm sm:text-base">Payment Status</p>
            <Label className="text-sm">{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
            <p className="font-medium text-sm sm:text-base">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 text-xs sm:text-sm ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "awaiting_verification"
                    ? "bg-yellow-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-black"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
          {orderDetails?.paymentId && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
              <p className="font-medium text-sm sm:text-base">Transaction ID</p>
              <Label className="text-sm break-all">{orderDetails?.paymentId}</Label>
            </div>
          )}
        </div>

        {orderDetails?.paymentScreenshot && (
          <>
            <Separator />
            <div className="grid gap-2">
              <div className="font-medium">Payment Screenshot</div>
              <div className="relative rounded-md overflow-hidden border bg-gray-50">
                <img
                  src={orderDetails?.paymentScreenshot}
                  alt="Payment screenshot"
                  className="w-full max-h-[250px] object-contain"
                />
              </div>
              <a
                href={orderDetails?.paymentScreenshot}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                View full image
              </a>
            </div>
          </>
        )}

        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item, idx) => (
                    <li key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 py-2 border-b border-gray-100 last:border-0 text-sm">
                      <span>Title: {item.title}</span>
                      <span>Quantity: {item.quantity}</span>
                      <span>Price: ${item.price}</span>
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
              <span>{user?.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>

        {orderDetails?.orderStatus === "awaiting_verification" && (
          <>
            <Separator />
            <div className="grid gap-3">
              <div className="font-medium">Quick Actions</div>
              <div className="flex gap-3">
                <Button
                  variant="default"
                  className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                  onClick={() => handleQuickAction("confirmed")}
                  disabled={actionLoading}
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve Payment
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 gap-2"
                  onClick={() => handleQuickAction("rejected")}
                  disabled={actionLoading}
                >
                  <XCircle className="h-4 w-4" />
                  Reject Payment
                </Button>
              </div>
            </div>
          </>
        )}

        <Separator />
        <div>
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "awaiting_verification", label: "Awaiting Verification" },
                  { id: "confirmed", label: "Confirmed (Approve Payment)" },
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Update Order Status"}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
