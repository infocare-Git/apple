"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button, Card, Chip, Empty, Note, Page } from "@/components/ui";
import { useLang } from "@/components/useLang";
import { useNow } from "@/components/useNow";
import { orderStatus, orderTotal, update, useStore, type OrderStatus } from "@/lib/store";
import { productById } from "@/lib/data/catalog";
import { COLLECTION_POINTS } from "@/lib/data/world";
import { bsDate, digits, npr } from "@/lib/format";
import type { Key } from "@/lib/i18n";

const STEPS: { id: OrderStatus; key: Key; icon: string }[] = [
  { id: "ordered", key: "st_ordered", icon: "📝" },
  { id: "confirmed", key: "st_confirmed", icon: "✅" },
  { id: "on_the_way", key: "st_on_the_way", icon: "🚚" },
  { id: "at_cp", key: "st_at_cp", icon: "📍" },
];

export default function OrdersPage() {
  return (
    <Suspense>
      <Orders />
    </Suspense>
  );
}

function Orders() {
  const { t, tr, lang } = useLang();
  const now = useNow(15000);
  const fresh = useSearchParams().get("new");
  const orders = useStore((s) => s.orders);

  return (
    <Page title={t("my_orders")} back="/shop">
      {fresh && <Card tone="success">✅ {t("order_sent")}</Card>}
      <Note tone="info">ℹ️ {t("demo_status")}</Note>
      {orders.length === 0 && <Empty>{t("cart_empty")}</Empty>}
      {orders.map((o) => {
        const st = orderStatus(o, now);
        const idx = st === "received" ? 4 : STEPS.findIndex((s) => s.id === st);
        const cp = COLLECTION_POINTS.find((c) => c.id === o.collectionPointId);
        return (
          <Card key={o.id} className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold leading-snug">{o.items.map((i) => `${tr(productById(i.productId)?.name ?? { ne: "?", en: "?" })} × ${digits(i.qty, lang)}`).join(", ")}</p>
                <p className="text-[16px]">{bsDate(new Date(o.createdAt), lang)} · 📍 {cp ? tr(cp.name) : ""}</p>
              </div>
              <p className="font-bold">{npr(orderTotal(o), lang)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {o.mode === "group" && <Chip>👥 {t("order_group")}</Chip>}
              <Chip>💵 {t("cod")}</Chip>
              {o.demo && <Chip tone="warn">{t("demo")}</Chip>}
            </div>
            {st === "received" ? (
              <Chip tone="success">✓ {t("st_received")}</Chip>
            ) : (
              <ol className="grid grid-cols-4 gap-1" aria-label={t(STEPS[idx].key)}>
                {STEPS.map((s, i) => (
                  <li key={s.id} className="flex flex-col items-center text-center">
                    <span className={`grid size-11 place-items-center rounded-full text-[20px] ${i <= idx ? "bg-leafdeep text-white" : "border-2 border-line bg-card opacity-60"}`} aria-hidden>{s.icon}</span>
                    <span className={`mt-1 text-[14px] leading-tight ${i === idx ? "font-bold" : ""}`}>{t(s.key)}</span>
                  </li>
                ))}
              </ol>
            )}
            {st === "at_cp" && (
              <Button tone="success" icon="📦" onClick={() => update((s) => ({ ...s, orders: s.orders.map((x) => (x.id === o.id ? { ...x, receivedAt: Date.now() } : x)) }))}>
                {t("confirm_receipt")}
              </Button>
            )}
          </Card>
        );
      })}
    </Page>
  );
}
