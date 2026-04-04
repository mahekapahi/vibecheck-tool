/**
 * bidService.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Client-side bid management.  All state is stored in localStorage.
 *
 * PRODUCTION: Replace every read/write with server API calls (e.g. Supabase
 * real-time subscriptions so competing bids from other users are visible live).
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Bid {
  id: string;
  auctionId: number;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  placedAt: string; // ISO-8601
}

export interface WonAuction {
  auctionId: number;
  winnerId: string;
  winnerEmail: string;
  winnerName: string;
  amount: number;
  endedAt: string;
}

// ─── Storage ──────────────────────────────────────────────────────────────────

const BIDS_KEY = "artevia_bids";         // Record<auctionId, Bid[]>
const WINS_KEY = "artevia_won_auctions"; // WonAuction[]

function readBids(): Record<number, Bid[]> {
  try { return JSON.parse(localStorage.getItem(BIDS_KEY) ?? "{}"); }
  catch { return {}; }
}
function writeBids(data: Record<number, Bid[]>) {
  try { localStorage.setItem(BIDS_KEY, JSON.stringify(data)); } catch {}
}
function readWins(): WonAuction[] {
  try { return JSON.parse(localStorage.getItem(WINS_KEY) ?? "[]"); }
  catch { return []; }
}
function writeWins(data: WonAuction[]) {
  try { localStorage.setItem(WINS_KEY, JSON.stringify(data)); } catch {}
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Minimum bid increment (at least ₹100, at least 1 % of current bid). */
export function minBidIncrement(currentBid: number): number {
  return Math.max(100, Math.ceil(currentBid * 0.01) / 100 * 100); // round to ₹100
}

export function minNextBid(currentBid: number): number {
  return currentBid + minBidIncrement(currentBid);
}

// ─── Public read API ──────────────────────────────────────────────────────────

/** All bids for an auction, highest first. */
export function getAuctionBids(auctionId: number): Bid[] {
  return [...(readBids()[auctionId] ?? [])].sort((a, b) => b.amount - a.amount);
}

/** Current highest bid amount; falls back to the static starting price. */
export function getCurrentBid(auctionId: number, startingBid: number): number {
  const top = getAuctionBids(auctionId)[0];
  return top ? top.amount : startingBid;
}

/** The current leading bidder, or null. */
export function getLeader(auctionId: number): Bid | null {
  return getAuctionBids(auctionId)[0] ?? null;
}

/** Whether the given user is the current highest bidder. */
export function isUserLeading(auctionId: number, userId: string): boolean {
  return getLeader(auctionId)?.userId === userId;
}

/** All bids placed by a user across all auctions, newest first. */
export function getUserBids(userId: string): Bid[] {
  return Object.values(readBids())
    .flat()
    .filter(b => b.userId === userId)
    .sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
}

/** Auction IDs where the user is currently the highest bidder. */
export function getUserLeadingIds(userId: string): number[] {
  return Object.entries(readBids())
    .filter(([, bids]) => {
      const top = [...bids].sort((a, b) => b.amount - a.amount)[0];
      return top?.userId === userId;
    })
    .map(([id]) => Number(id));
}

/** Auctions this user has won. */
export function getUserWins(userId: string): WonAuction[] {
  return readWins().filter(w => w.winnerId === userId);
}

/** Whether a specific auction has been demo-ended. */
export function getAuctionWin(auctionId: number): WonAuction | null {
  return readWins().find(w => w.auctionId === auctionId) ?? null;
}

// ─── Public write API ─────────────────────────────────────────────────────────

export interface PlaceBidResult {
  success: boolean;
  error?: string;
  /** The previous leading bidder (for outbid notifications). */
  previousLeader?: Bid;
}

/**
 * Validates and records a new bid.
 * Returns the previous leader so the caller can fire outbid notifications.
 */
export function placeBid(
  auctionId: number,
  user: { id: string; email: string; name: string },
  amount: number,
  startingBid: number,
): PlaceBidResult {
  const current   = getCurrentBid(auctionId, startingBid);
  const minAmount = minNextBid(current);

  if (amount < minAmount) {
    return {
      success: false,
      error: `Minimum bid is ₹${minAmount.toLocaleString("en-IN")} (current + ₹${minBidIncrement(current).toLocaleString("en-IN")}).`,
    };
  }

  const all          = readBids();
  const existing     = all[auctionId] ?? [];
  const prevLeader   = [...existing].sort((a, b) => b.amount - a.amount)[0] as Bid | undefined;

  const newBid: Bid = {
    id:        `bid-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    auctionId,
    userId:    user.id,
    userEmail: user.email,
    userName:  user.name,
    amount,
    placedAt:  new Date().toISOString(),
  };

  all[auctionId] = [newBid, ...existing];
  writeBids(all);

  return {
    success: true,
    previousLeader: prevLeader?.userId !== user.id ? prevLeader : undefined,
  };
}

/**
 * Marks an auction as won by its current leader.
 * Safe to call multiple times — only writes on first call.
 */
export function markAuctionWon(auctionId: number): WonAuction | null {
  const wins = readWins();
  const existing = wins.find(w => w.auctionId === auctionId);
  if (existing) return existing;

  const leader = getLeader(auctionId);
  if (!leader) return null;

  const won: WonAuction = {
    auctionId,
    winnerId:    leader.userId,
    winnerEmail: leader.userEmail,
    winnerName:  leader.userName,
    amount:      leader.amount,
    endedAt:     new Date().toISOString(),
  };
  writeWins([...wins, won]);
  return won;
}
