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
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
  deleteOrder,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { ImageIcon } from "lucide-react";

function getStatusBadge(orderStatus) {
  if (orderStatus === "confirmed") return "bg-green-500";
  if (orderStatus === "awaiting_verification") return "bg-yellow-500";
  if (orderStatus === "rejected") return "bg-red-600";
  return "bg-black";
}

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  function handleDeleteOrder(getId) {
    dispatch(deleteOrder(getId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getAllOrdersForAdmin());
      }
    });
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden sm:table-cell">Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
              <TableHead>
                <span className="sr-only">Delete</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
                  <TableRow key={orderItem?._id}>
                    <TableCell className="hidden sm:table-cell max-w-[100px] truncate">{orderItem?._id}</TableCell>
                    <TableCell className="whitespace-nowrap">{orderItem?.orderDate?.split("T")[0]}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {orderItem?.paymentScreenshot ? (
                          <ImageIcon className="h-3.5 w-3.5 text-blue-500" title="Screenshot available" />
                        ) : null}
                        <Badge variant="outline" className="text-xs">
                          {orderItem?.paymentStatus}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${getStatusBadge(orderItem?.orderStatus)}`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>${orderItem?.totalAmount}</TableCell>
                      <TableCell>
                        <Dialog
                          open={openDetailsDialog}
                          onOpenChange={() => {
                            setOpenDetailsDialog(false);
                            dispatch(resetOrderDetails());
                          }}
                        >
                          <Button
                            onClick={() =>
                              handleFetchOrderDetails(orderItem?._id)
                            }
                            size="sm"
                            className="whitespace-nowrap min-h-[44px] text-xs sm:text-sm px-2 sm:px-4"
                          >
                            View Details
                          </Button>
                          <AdminOrderDetailsView orderDetails={orderDetails} />
                        </Dialog>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteOrder(orderItem?._id)}
                          className="whitespace-nowrap min-h-[44px] text-xs sm:text-sm px-2 sm:px-4"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
