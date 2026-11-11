"use client";

import { useSyncExternalStore } from "react";
import type { Lang } from "./format";
import type { Grade } from "./types";
import { BUYERS, GRADE_FACTOR, REFERENCE_PRICE } from "./data/world";
import { productById } from "./data/catalog";

// Phase 1 keeps the farmer's data on the device (localStorage). Every record
// gets a client-generated UUID so it can later be pushed to the server
// idempotently when the shared backend (Supabase) is connected.

export type Profile = {
  name: string;
  phone: string;
  palikaId: string;
  ward: number;
  size: "small" | "medium" | "large";
  varieties: string[];
  groupId: string | null;
  contentPack: boolean;
  createdAt: number;
};

export type OrderItem = { productId: string; qty: number; priceNpr: number };
export type Order = {
  id: string;
  items: OrderItem[];
  collectionPointId: string;
  mode: "alone" | "group";
  createdAt: number;
  receivedAt?: number;
  demo?: boolean;
};

export type Question = {
  id: string;
  text: string;
  createdAt: number;
  ai: { text: string; sources: string[]; known: boolean };
  expert: { status: "none" | "waiting" | "answered"; reply?: string; askedAt?: number };
  demo?: boolean;
};

export type Diagnosis = {
  id: string;
  thumbs: string[];
  voiceNote?: string;
  symptomId: string;
  confidence: number;
  sentToExpert: boolean;
  createdAt: number;
};

export type Lot = {
  id: string;
  varietyId: string;
  grade: Grade;
  quantity: number;
  unit: "crate" | "kg";
  readyAt: number;
  thumbs: string[];
  collectionPointId: string;
  mode: "alone" | "group";
  createdAt: number;
  acceptedOfferId?: string;
  pickupKg?: number;
  paidAt?: number;
  demo?: boolean;
};

export type Offer = { id: string; lotId: string; buyerId: string; pricePerKg: number; createdAt: number; seen?: boolean };

export type CartLine = { productId: string; qty: number };

export type State = {
  v: 1;
  lang: Lang;
  profile: Profile | null;
  cart: CartLine[];
  orders: Order[];
  questions: Question[];
  diagnoses: Diagnosis[];
  lots: Lot[];
  offers: Offer[];
  /** Last good weather forecast, shown when offline. */
  weatherCache?: { at: number; data: unknown };
};

const KEY = "syau-sathi:v1";
const INITIAL: State = { v: 1, lang: "ne", profile: null, cart: [], orders: [], questions: [], diagnoses: [], lots: [], offers: [] };

let state: State = INITIAL;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as State;
      if (parsed.v === 1) state = { ...INITIAL, ...parsed };
    }
  } catch {
    /* storage blocked or corrupt: start fresh, app still works in memory */
  }
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Quota exceeded (photos) or storage blocked. Drop old thumbnails and retry once.
    try {
      state = { ...state, diagnoses: state.diagnoses.map((d, i) => (i < 3 ? d : { ...d, thumbs: [] })) };
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* keep running from memory */
    }
  }
}

export function getState(): State {
  load();
  return state;
}

export function update(fn: (s: State) => State) {
  load();
  state = fn(state);
  persist();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      loaded = false;
      load();
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * Server render and first client render both see INITIAL; then the stored state.
 * The selector must return a stable value (a slice of state or a primitive).
 * Never filter or map inside it: a new array each call makes React loop.
 */
export function useStore<T>(select: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => select(getState()), () => select(INITIAL));
}

export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

export const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      });

export function resetAll() {
  update(() => ({ ...INITIAL, lang: state.lang }));
}

// ── Derived values ──────────────────────────────────────────────────────

export type OrderStatus = "ordered" | "confirmed" | "on_the_way" | "at_cp" | "received";

/**
 * Phase 1 demo: with no supplier console yet, an order's status moves on by
 * itself (2 min → confirmed, 5 min → on the way, 10 min → at collection point).
 */
export function orderStatus(o: Order, now = Date.now()): OrderStatus {
  if (o.receivedAt) return "received";
  const mins = (now - o.createdAt) / 60000;
  if (mins < 2) return "ordered";
  if (mins < 5) return "confirmed";
  if (mins < 10) return "on_the_way";
  return "at_cp";
}

export const orderTotal = (o: Order) => o.items.reduce((s, i) => s + i.qty * i.priceNpr, 0);

export type LotStatus = "open" | "sold" | "picked" | "paid";
export function lotStatus(l: Lot): LotStatus {
  if (l.paidAt) return "paid";
  if (l.pickupKg) return "picked";
  if (l.acceptedOfferId) return "sold";
  return "open";
}

export const KG_PER_CRATE = 20;
export const lotKg = (l: Pick<Lot, "quantity" | "unit">) => (l.unit === "crate" ? l.quantity * KG_PER_CRATE : l.quantity);

export function referencePrice(varietyId: string, grade: Grade): number {
  const ref = REFERENCE_PRICE[varietyId] ?? REFERENCE_PRICE.local;
  return Math.round(ref.kathmandu * GRADE_FACTOR[grade] * 0.7);
}

/** Phase 1 demo buyers: three sample offers around the reference price, deterministic per lot. */
export function sampleOffers(lot: Lot): Offer[] {
  const ref = referencePrice(lot.varietyId, lot.grade);
  let h = 0;
  for (const c of lot.id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const picks = [0, 1, 2].map((i) => BUYERS[(h + i * 3) % BUYERS.length]);
  const spreads = [-0.08, 0.03, 0.09];
  return picks.map((b, i) => ({
    id: `${lot.id}-offer-${i}`,
    lotId: lot.id,
    buyerId: b.id,
    pricePerKg: Math.max(10, Math.round(ref * (1 + spreads[(h + i) % 3]))),
    createdAt: lot.createdAt + (i + 1) * 60000,
  }));
}

export function cartTotal(cart: CartLine[]) {
  return cart.reduce((s, l) => s + (productById(l.productId)?.priceNpr ?? 0) * l.qty, 0);
}

/** Demo records in every status, created once when a farmer finishes onboarding. */
export function seedDemo(now = Date.now()): Pick<State, "orders" | "questions" | "lots" | "offers"> {
  const m = 60000;
  const orders: Order[] = [
    { id: uid(), demo: true, items: [{ productId: "fert-compost", qty: 2, priceNpr: 600 }], collectionPointId: "cp-khalanga", mode: "alone", createdAt: now - 1 * m },
    { id: uid(), demo: true, items: [{ productId: "prot-pheromone", qty: 4, priceNpr: 350 }], collectionPointId: "cp-khalanga", mode: "group", createdAt: now - 3 * m },
    { id: uid(), demo: true, items: [{ productId: "pack-carton-20", qty: 3, priceNpr: 950 }], collectionPointId: "cp-chandannath-6", mode: "group", createdAt: now - 7 * m },
    { id: uid(), demo: true, items: [{ productId: "tool-secateurs", qty: 1, priceNpr: 1200 }], collectionPointId: "cp-khalanga", mode: "alone", createdAt: now - 60 * m },
    { id: uid(), demo: true, items: [{ productId: "sap-fuji", qty: 10, priceNpr: 450 }], collectionPointId: "cp-khalanga", mode: "alone", createdAt: now - 3 * 24 * 60 * m, receivedAt: now - 2 * 24 * 60 * m },
  ];
  const lotOpen: Lot = { id: uid(), demo: true, varietyId: "red-delicious", grade: "A", quantity: 40, unit: "crate", readyAt: now + 3 * 24 * 60 * m, thumbs: [], collectionPointId: "cp-khalanga", mode: "group", createdAt: now - 90 * m };
  const lotSold: Lot = { id: uid(), demo: true, varietyId: "golden-delicious", grade: "B", quantity: 15, unit: "crate", readyAt: now, thumbs: [], collectionPointId: "cp-khalanga", mode: "alone", createdAt: now - 2 * 24 * 60 * m };
  const lotPicked: Lot = { id: uid(), demo: true, varietyId: "fuji", grade: "A", quantity: 600, unit: "kg", readyAt: now - 5 * 24 * 60 * m, thumbs: [], collectionPointId: "cp-chandannath-6", mode: "alone", createdAt: now - 6 * 24 * 60 * m, pickupKg: 588 };
  const lotPaid: Lot = { id: uid(), demo: true, varietyId: "royal-delicious", grade: "A", quantity: 30, unit: "crate", readyAt: now - 20 * 24 * 60 * m, thumbs: [], collectionPointId: "cp-khalanga", mode: "group", createdAt: now - 21 * 24 * 60 * m, pickupKg: 604, paidAt: now - 15 * 24 * 60 * m };
  const lots = [lotOpen, lotSold, lotPicked, lotPaid];
  const offers = lots.flatMap(sampleOffers);
  for (const l of [lotSold, lotPicked, lotPaid]) l.acceptedOfferId = offers.find((o) => o.lotId === l.id)!.id;
  const questions: Question[] = [
    {
      id: uid(), demo: true, text: "जाडोमा काटछाँट कहिले गर्ने?", createdAt: now - 2 * 24 * 60 * m,
      ai: { text: "", sources: ["winter-pruning"], known: true },
      expert: { status: "answered", askedAt: now - 2 * 24 * 60 * m, reply: "(नमूना) पुस–माघमा, पात झरेपछि र कोपिला फुल्नुअघि काट्नुहोस्।" },
    },
  ];
  return { orders, questions, lots, offers };
}
