import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { confirmUPIPayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function UpiConfirmationPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrderId = sessionStorage.getItem("currentOrderId");

    if (storedOrderId) {
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
      <CardHeader>
        <CardTitle>Submitting Payment for Verification...</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default UpiConfirmationPage;
