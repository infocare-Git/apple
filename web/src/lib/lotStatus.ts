import type { LotStatus } from "./store";
import type { Key } from "./i18n";

export const LOT_STATUS: Record<LotStatus, { key: Key; tone: "neutral" | "success" | "warn" | "red" }> = {
  open: { key: "lot_open", tone: "warn" },
  sold: { key: "lot_sold", tone: "red" },
  picked: { key: "lot_picked", tone: "warn" },
  paid: { key: "lot_paid", tone: "success" },
};
