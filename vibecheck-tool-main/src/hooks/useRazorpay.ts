import { toast } from "sonner";

// ---------------------------------------------------------------------------
// TEST MODE: Razorpay is initialised directly on the frontend.
// Replace this with your actual Razorpay Test Key ID from the dashboard.
// ---------------------------------------------------------------------------
const RAZORPAY_TEST_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID ?? "rzp_test_XXXXXXXXXXXXXXXX";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount?: number;
  currency?: string;
  name?: string;
  description?: string;
  order_id?: string; // optional — omitted in frontend-only test mode
  handler: (response: RazorpaySuccessResponse) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open(): void;
  on(event: string, handler: () => void): void;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface RazorpayCheckoutParams {
  auctionId: number;
  amount: number; // in INR (rupees)
  title: string;
  description?: string;
  userName?: string;
  userEmail?: string;
}

export async function openRazorpayCheckout({
  amount,
  title,
  description,
  userName,
  userEmail,
}: RazorpayCheckoutParams): Promise<void> {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    toast.error("Failed to load payment gateway. Please try again.");
    return;
  }

  // Frontend-only test mode: no Edge Function needed.
  // amount must be in paise (multiply INR × 100).
  const options: RazorpayOptions = {
    key: RAZORPAY_TEST_KEY_ID,
    amount: amount * 100,
    currency: "INR",
    name: "Artevia",
    description: description ?? title,
    prefill: {
      name: userName ?? "",
      email: userEmail ?? "",
    },
    theme: { color: "#7c3aed" },
    handler: (response: RazorpaySuccessResponse) => {
      // In test mode we skip backend verification.
      // Replace this handler with an Edge Function call when deploying.
      toast.success(`Payment successful! ID: ${response.razorpay_payment_id}`);
    },
    modal: {
      ondismiss: () => {
        toast.info("Payment cancelled.");
      },
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.on("payment.failed", () => {
    toast.error("Payment failed. Please try again.");
  });
  rzp.open();
}
