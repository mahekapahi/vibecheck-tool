/**
 * notificationService.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * In-app notification log + simulated email dispatch.
 * All state is stored in localStorage.
 *
 * PRODUCTION: Replace storage with Supabase real-time subscriptions and
 * trigger actual email sends via an Edge Function (Resend / SendGrid).
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type NotificationType = "bid_placed" | "outbid" | "auction_won";

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  auctionId: number;
  auctionTitle: string;
  amount?: number;
  read: boolean;
  createdAt: string; // ISO-8601
}

// ─── Storage ──────────────────────────────────────────────────────────────────

const NOTIFS_KEY = "artevia_notifications"; // AppNotification[]

function readAll(): AppNotification[] {
  try { return JSON.parse(localStorage.getItem(NOTIFS_KEY) ?? "[]"); }
  catch { return []; }
}
function writeAll(data: AppNotification[]) {
  try { localStorage.setItem(NOTIFS_KEY, JSON.stringify(data)); } catch {}
}

function makeId() {
  return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

// ─── Simulated email ──────────────────────────────────────────────────────────

function simulateEmail(to: string, subject: string, body: string) {
  console.group(`%c[Artevia Email] → ${to}`, "color: #c17b3a; font-weight: bold");
  console.log(`Subject : ${subject}`);
  console.log(`Body    :\n${body}`);
  console.groupEnd();
}

// ─── Write API ────────────────────────────────────────────────────────────────

/** Notify a user that their own bid was recorded. */
export function notifyBidPlaced(
  userId: string,
  userEmail: string,
  auctionId: number,
  auctionTitle: string,
  amount: number,
): void {
  const notif: AppNotification = {
    id: makeId(),
    userId,
    type: "bid_placed",
    title: "Bid placed",
    message: `Your bid of ₹${amount.toLocaleString("en-IN")} on "${auctionTitle}" was recorded.`,
    auctionId,
    auctionTitle,
    amount,
    read: false,
    createdAt: new Date().toISOString(),
  };
  writeAll([notif, ...readAll()]);

  simulateEmail(
    userEmail,
    `Bid confirmed — ${auctionTitle}`,
    `Hi,\n\nYour bid of ₹${amount.toLocaleString("en-IN")} on "${auctionTitle}" has been placed successfully.\n\nIf someone outbids you, we'll let you know immediately.\n\n— Artevia`,
  );
}

/** Notify the previous leader that they've been outbid. */
export function notifyOutbid(
  userId: string,
  userEmail: string,
  auctionId: number,
  auctionTitle: string,
  newAmount: number,
): void {
  const notif: AppNotification = {
    id: makeId(),
    userId,
    type: "outbid",
    title: "You've been outbid",
    message: `Someone bid ₹${newAmount.toLocaleString("en-IN")} on "${auctionTitle}". Place a higher bid to stay in the lead.`,
    auctionId,
    auctionTitle,
    amount: newAmount,
    read: false,
    createdAt: new Date().toISOString(),
  };
  writeAll([notif, ...readAll()]);

  simulateEmail(
    userEmail,
    `You've been outbid — ${auctionTitle}`,
    `Hi,\n\nSomeone placed a bid of ₹${newAmount.toLocaleString("en-IN")} on "${auctionTitle}", beating your previous bid.\n\nVisit the auction to place a higher bid before time runs out.\n\n— Artevia`,
  );
}

/** Notify the winner that they've won the auction. */
export function notifyAuctionWon(
  userId: string,
  userEmail: string,
  userName: string,
  auctionId: number,
  auctionTitle: string,
  amount: number,
): void {
  const notif: AppNotification = {
    id: makeId(),
    userId,
    type: "auction_won",
    title: "Congratulations — you won!",
    message: `You won "${auctionTitle}" with a winning bid of ₹${amount.toLocaleString("en-IN")}.`,
    auctionId,
    auctionTitle,
    amount,
    read: false,
    createdAt: new Date().toISOString(),
  };
  writeAll([notif, ...readAll()]);

  simulateEmail(
    userEmail,
    `You won "${auctionTitle}"! 🎉`,
    `Hi ${userName},\n\nCongratulations! You've won the auction for "${auctionTitle}" with a winning bid of ₹${amount.toLocaleString("en-IN")}.\n\nOur team will reach out within 48 hours to arrange delivery and payment.\n\nThank you for being part of Artevia.\n\n— The Artevia Team`,
  );
}

// ─── Read API ─────────────────────────────────────────────────────────────────

/** All notifications for a user, newest first. */
export function getNotifications(userId: string): AppNotification[] {
  return readAll().filter(n => n.userId === userId);
}

/** Number of unread notifications for a user. */
export function getUnreadCount(userId: string): number {
  return readAll().filter(n => n.userId === userId && !n.read).length;
}

/** Mark a single notification as read. */
export function markRead(id: string): void {
  writeAll(readAll().map(n => n.id === id ? { ...n, read: true } : n));
}

/** Mark all of a user's notifications as read. */
export function markAllRead(userId: string): void {
  writeAll(readAll().map(n => n.userId === userId ? { ...n, read: true } : n));
}
