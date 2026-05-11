import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-6 sm:p-10 text-center">
        <CardHeader className="p-0">
          <CardTitle className="text-xl sm:text-4xl">Payment Submitted Successfully!</CardTitle>
        </CardHeader>
        <Button className="mt-5 w-full sm:w-auto" onClick={() => navigate("/shop/account")}>
          View Orders
        </Button>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;
