import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-6 sm:p-10 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <CardHeader className="p-0">
          <CardTitle className="text-xl sm:text-2xl">Payment Submitted Successfully!</CardTitle>
        </CardHeader>
        <p className="text-sm text-gray-600 mt-2">
          Your payment is under verification and may take some time.
        </p>
        <Button className="mt-5 w-full sm:w-auto" onClick={() => navigate("/shop/account")}>
          View Orders
        </Button>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;
