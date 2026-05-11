import { useState } from "react";
import CommonForm from "../common/form";
import { Dialog, DialogContent } from "../ui/dialog";
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
import { CheckCircle, XCircle, ZoomIn, X } from "lucide-react";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const [actionLoading, setActionLoading] = useState(false);
  const [zoomImage, setZoomImage] = useState(false);
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
    <>
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
                <div
                  className="relative rounded-md overflow-hidden border bg-gray-50 cursor-pointer group"
                  onClick={() => setZoomImage(true)}
                >
                  <img
                    src={orderDetails?.paymentScreenshot}
                    alt="Payment screenshot"
                    className="w-full max-h-[300px] object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                      <ZoomIn className="h-5 w-5 text-gray-700" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  {orderDetails?.orderUpdateDate && (
                    <span className="text-xs text-muted-foreground">
                      Submitted: {new Date(orderDetails?.orderUpdateDate).toLocaleString()}
                    </span>
                  )}
                  <button
                    onClick={() => setZoomImage(true)}
                    className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    <ZoomIn className="h-3 w-3" />
                    Click to enlarge
                  </button>
                </div>
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

      {orderDetails?.paymentScreenshot && (
        <Dialog open={zoomImage} onOpenChange={setZoomImage}>
          <DialogContent className="max-w-[90vw] max-h-[90vh] p-1 bg-black/95 border-0">
            <div className="relative flex items-center justify-center w-full h-full min-h-[50vh]">
              <button
                onClick={() => setZoomImage(false)}
                className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 rounded-full p-1.5 transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
              <img
                src={orderDetails?.paymentScreenshot}
                alt="Payment screenshot enlarged"
                className="max-w-full max-h-[85vh] object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default AdminOrderDetailsView;
