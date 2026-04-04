/**
 * aadhaarAuth.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Aadhaar OTP authentication service.
 *
 * Currently runs in DEMO MODE (no real API calls).
 * To go live, replace the two functions below with calls to a licensed
 * KYC / AUA (Authentication User Agency) provider such as:
 *
 *   • Surepass   – https://surepass.io/aadhaar-api/
 *   • IDfy       – https://idfy.com/aadhaar-verification/
 *   • AuthBridge – https://authbridge.com/
 *   • Signzy     – https://signzy.com/
 *
 * None of these providers (and UIDAI) allow direct client-side calls.
 * You MUST proxy through your own backend (Supabase Edge Function, Express, etc.)
 * so that your API keys are never exposed in the browser bundle.
 *
 * Example Supabase Edge Function endpoints to create:
 *   POST /functions/v1/aadhaar-send-otp   { aadhaar: string }
 *   POST /functions/v1/aadhaar-verify-otp { txnId: string, otp: string }
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface SendOtpResult {
  success: boolean;
  txnId?: string;   // transaction ID returned by provider; pass back to verifyOtp
  error?: string;
}

export interface VerifyOtpResult {
  success: boolean;
  error?: string;
}

// ─── Validation ──────────────────────────────────────────────────────────────

/** Returns true if the string is a structurally valid Aadhaar number. */
export const isValidAadhaarFormat = (raw: string): boolean =>
  /^[1-9][0-9]{11}$/.test(raw.replace(/\s/g, ""));

// ─── Send OTP ────────────────────────────────────────────────────────────────

/**
 * Request an OTP be sent to the mobile number linked with the given Aadhaar.
 *
 * DEMO MODE: always succeeds after a simulated delay.
 *
 * PRODUCTION: replace the body with a fetch() to your backend proxy.
 * Example:
 *
 *   const res = await fetch("/functions/v1/aadhaar-send-otp", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ aadhaar: aadhaarNumber }),
 *   });
 *   const data = await res.json();
 *   return { success: data.success, txnId: data.txnId, error: data.error };
 */
export const sendAadhaarOtp = async (aadhaarNumber: string): Promise<SendOtpResult> => {
  // ── DEMO ──
  void aadhaarNumber; // used in production call
  await delay(1300);
  return { success: true, txnId: `DEMO-TXN-${Date.now()}` };
};

// ─── Verify OTP ──────────────────────────────────────────────────────────────

/**
 * Verify the OTP entered by the user against the transaction started by sendAadhaarOtp.
 *
 * DEMO MODE: OTP "123456" always passes; anything else fails.
 *
 * PRODUCTION: replace the body with a fetch() to your backend proxy.
 * Example:
 *
 *   const res = await fetch("/functions/v1/aadhaar-verify-otp", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ txnId, otp }),
 *   });
 *   const data = await res.json();
 *   return { success: data.success, error: data.error };
 */
export const verifyAadhaarOtp = async (txnId: string, otp: string): Promise<VerifyOtpResult> => {
  // ── DEMO ──
  void txnId;
  await delay(1300);
  if (otp === "123456") return { success: true };
  return { success: false, error: "Invalid OTP. (Demo mode: use 123456)" };
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
