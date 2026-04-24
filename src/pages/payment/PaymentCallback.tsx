import { useOrderStore } from "@/store/useOrderStore";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

export default function PaymentCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const {verifyPayment} = useOrderStore()

  useEffect(() => {
    const orderId = Number(params.get("orderId"));
    const trackId = params.get("trackId");

    if (!orderId || !trackId) {
      navigate("/cart");
      return;
    }

    verifyPayment({ orderId, trackId })
      .then(() => navigate(`/order/success/${orderId}`))
      .catch(() => navigate("/cart"));
  }, []);

  return <p>در حال تایید پرداخت...</p>;
}
