import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { confirmUPIPayment } from "@/store/shop/order-slice";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

function UpiConfirmationPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const submittedRef = useRef(false);

  useEffect(() => {
    const storedOrderId = sessionStorage.getItem("currentOrderId");

    if (storedOrderId && !submittedRef.current) {
      submittedRef.current = true;
      const orderId = JSON.parse(storedOrderId);

      dispatch(
        confirmUPIPayment({
          orderId,
          transactionRef: "UPI-" + Date.now(),
        })
      ).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          navigate("/shop/payment-success");
        } else {
          navigate("/shop/checkout");
        }
      });
    }
  }, [dispatch, navigate]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <CardTitle>Submitting Payment for Verification...</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default UpiConfirmationPage;
