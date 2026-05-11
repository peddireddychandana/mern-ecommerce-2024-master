import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
  deleteOrder,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";
import { formatPrice } from "@/lib/format-price";

function ShoppingOrders() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleFetchOrderDetails = (id) => {
    dispatch(getOrderDetails(id));
    setOpenDetailsDialog(true);
  };

  const handleDeleteOrder = (id) => {
    if (deletingId) return;
    setDeletingId(id);
    dispatch(deleteOrder(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getAllOrdersByUserId(user?.id));
      }
    }).finally(() => setDeletingId(null));
  };

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllOrdersByUserId(user?.id));
    }
  }, [dispatch, user?.id]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">
          Order History
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ================= TABLE VIEW (DESKTOP) ================= */}
        <div className="hidden md:block w-full overflow-x-auto">
          <Table className="min-w-[600px] w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orderList?.map((orderItem) => (
                <TableRow key={orderItem?._id}>
                  <TableCell className="truncate max-w-[120px]">
                    {orderItem?._id}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {orderItem?.orderDate?.split("T")[0]}
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={`px-3 py-1 text-xs ${
                        orderItem?.orderStatus === "confirmed"
                          ? "bg-green-500"
                          : orderItem?.orderStatus === "rejected"
                          ? "bg-red-600"
                          : "bg-black"
                      }`}
                    >
                      {orderItem?.orderStatus}
                    </Badge>
                  </TableCell>

                  <TableCell className="font-medium">
                    {formatPrice(orderItem?.totalAmount)}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleFetchOrderDetails(orderItem?._id)
                        }
                      >
                        View
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        loading={deletingId === orderItem?._id}
                        loadingText="Deleting..."
                        onClick={() => handleDeleteOrder(orderItem?._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ================= MOBILE VIEW (CARDS) ================= */}
        <div className="grid gap-4 md:hidden">
          {orderList?.map((orderItem) => (
            <div
              key={orderItem?._id}
              className="border rounded-lg p-4 space-y-3 w-full"
            >
              {/* Header */}
              <div className="flex justify-between items-start gap-2">
                <p className="text-xs text-gray-500 break-all">
                  {orderItem?._id}
                </p>

                <Badge
                  className={`text-xs px-2 py-1 ${
                    orderItem?.orderStatus === "confirmed"
                      ? "bg-green-500"
                      : orderItem?.orderStatus === "rejected"
                      ? "bg-red-600"
                      : "bg-black"
                  }`}
                >
                  {orderItem?.orderStatus}
                </Badge>
              </div>

              {/* Info */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date</span>
                <span>
                  {orderItem?.orderDate?.split("T")[0]}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Price</span>
                <span className="font-medium">
                  {formatPrice(orderItem?.totalAmount)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    handleFetchOrderDetails(orderItem?._id)
                  }
                >
                  View
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  loading={deletingId === orderItem?._id}
                  loadingText="Deleting..."
                  onClick={() => handleDeleteOrder(orderItem?._id)}
                >
                  Delete
                </Button>
              </div>
              
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog
        open={openDetailsDialog}
        onOpenChange={(open) => {
          if (!open) {
            setOpenDetailsDialog(false);
            dispatch(resetOrderDetails());
          }
        }}
      >
        {orderDetails && <ShoppingOrderDetailsView orderDetails={orderDetails} />}
      </Dialog>
    </Card>
  );
}

export default ShoppingOrders;