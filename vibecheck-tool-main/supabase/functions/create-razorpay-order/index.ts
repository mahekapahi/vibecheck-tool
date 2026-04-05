import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { auction_id, amount } = await req.json();

    if (!auction_id || !amount || amount <= 0) {
      throw new Error("Invalid auction_id or amount");
    }

    const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay credentials not configured");
    }

    const credentials = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);

    const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // rupees → paise
        currency: "INR",
        receipt: `receipt_auction_${auction_id}_${Date.now()}`,
        notes: { auction_id: String(auction_id) },
      }),
    });

    if (!razorpayRes.ok) {
      const err = await razorpayRes.json();
      throw new Error(err?.error?.description || "Razorpay order creation failed");
    }

    const order = await razorpayRes.json();

    // Persist the pending payment record using service-role key
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Attempt to extract authenticated user
    let user_id: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabase.auth.getUser(token);
      user_id = data?.user?.id ?? null;
    }

    const { error: insertError } = await supabase.from("payments").insert({
      auction_id,
      user_id,
      razorpay_order_id: order.id,
      amount,
      currency: "INR",
      status: "created",
    });

    if (insertError) {
      console.error("Failed to insert payment record:", insertError);
      // Non-fatal: still return the order so the user can pay
    }

    return new Response(
      JSON.stringify({ order_id: order.id, key_id: RAZORPAY_KEY_ID }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
