/**
 * twoFactor.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Demo TOTP (Time-based One-Time Password) utilities.
 *
 * DEMO MODE — deterministic FNV-1a hash seeded with the user ID and the
 * current 30-second time window.  NOT cryptographically secure.  Suitable
 * only for UI/UX prototyping.
 *
 * PRODUCTION — replace with a proper TOTP library (e.g. `otpauth`) backed by
 * a randomly-generated per-user base32 secret stored server-side.  Display
 * the secret as a QR code (RFC 3548 / KeyUri format) so users can enrol in
 * Google Authenticator, Authy, or any RFC 6238-compliant app.
 *
 * Example production endpoint:
 *   POST /functions/v1/totp-setup   → { secret, qrDataUrl }
 *   POST /functions/v1/totp-verify  { token } → { valid: boolean }
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Length of each TOTP window in milliseconds (RFC 6238 default is 30 s). */
export const TOTP_WINDOW_MS = 30_000;

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * FNV-1a 32-bit hash — deterministic, avalanche-friendly.
 * Used only for demo code generation; not cryptographically secure.
 */
function fnv1a(str: string): number {
  let hash = 2_166_136_261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16_777_619) >>> 0;
  }
  return hash;
}

/** Returns the 6-digit code for `userId` in a specific time `window`. */
function codeForWindow(userId: string, window: number): string {
  return String((fnv1a(`${userId}:${window}`) % 900_000) + 100_000);
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns the current 6-digit demo TOTP code for the given user.
 * This is the value that a real authenticator app would display right now.
 */
export function generateTOTP(userId: string): string {
  return codeForWindow(userId, Math.floor(Date.now() / TOTP_WINDOW_MS));
}

/**
 * Returns milliseconds remaining until the current TOTP window expires.
 * Use this to drive a countdown ring / progress bar in the UI.
 */
export function msUntilNextTOTP(): number {
  return TOTP_WINDOW_MS - (Date.now() % TOTP_WINDOW_MS);
}

/**
 * Returns true when `code` matches the current or immediately preceding window.
 * The one-window grace period handles clock skew and slow typists.
 */
export function verifyTOTP(userId: string, code: string): boolean {
  const now = Math.floor(Date.now() / TOTP_WINDOW_MS);
  return [0, -1].some(offset => codeForWindow(userId, now + offset) === code.trim());
}
