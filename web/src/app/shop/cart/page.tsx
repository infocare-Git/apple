"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Card, Empty, Page, PictureChoice, SectionTitle, Stepper } from "@/components/ui";
import { useLang } from "@/components/useLang";
import { cartTotal, uid, update, useStore, type Order } from "@/lib/store";
import { productById } from "@/lib/data/catalog";
import { COLLECTION_POINTS, FARMER_GROUPS } from "@/lib/data/world";
import { npr } from "@/lib/format";

export default function Cart() {
  const { t, tr, lang } = useLang();
  const router = useRouter();
  const cart = useStore((s) => s.cart);
  const profile = useStore((s) => s.profile);
  const lastCp = useStore((s) => s.orders[0]?.collectionPointId);
  const near = COLLECTION_POINTS.filter((c) => c.palikaId === profile?.palikaId);
  const points = near.length ? [...near, ...COLLECTION_POINTS.filter((c) => c.palikaId !== profile?.palikaId)] : COLLECTION_POINTS;
  const [cp, setCp] = useState<string>(lastCp ?? points[0].id);
  const [mode, setMode] = useState<"alone" | "group">(profile?.groupId ? "group" : "alone");
  const group = FARMER_GROUPS.find((g) => g.id === profile?.groupId);

  const setQty = (id: string, qty: number) =>
    update((s) => ({ ...s, cart: qty <= 0 ? s.cart.filter((l) => l.productId !== id) : s.cart.map((l) => (l.productId === id ? { ...l, qty } : l)) }));

  const place = () => {
    const order: Order = {
      id: uid(),
      items: cart.map((l) => ({ productId: l.productId, qty: l.qty, priceNpr: productById(l.productId)!.priceNpr })),
      collectionPointId: cp,
      mode,
      createdAt: Date.now(),
    };
    update((s) => ({ ...s, cart: [], orders: [order, ...s.orders] }));
    router.replace(`/shop/orders?new=${order.id}`);
  };

  if (cart.length === 0) {
    return (
      <Page title={t("cart")} back="/shop" action={<Button href="/shop">{t("shop_title")}</Button>}>
        <Empty>🛒 {t("cart_empty")}</Empty>
      </Page>
    );
  }

  return (
    <Page title={t("cart")} back="/shop" action={<Button onClick={place} icon="✓">{t("place_order")} · {npr(cartTotal(cart), lang)}</Button>}>
      {cart.map((l) => {
        const p = productById(l.productId);
        if (!p) return null;
        return (
          <Card key={l.productId} className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-[30px]" aria-hidden>{p.icon}</span>
              <p className="flex-1 font-bold leading-snug">{tr(p.name)}</p>
              <p className="font-bold">{npr(p.priceNpr * l.qty, lang)}</p>
            </div>
            <Stepper value={l.qty} onChange={(v) => setQty(l.productId, v)} min={0} label={t("qty")} />
          </Card>
        );
      })}

      <SectionTitle>{t("choose_cp")}</SectionTitle>
      <PictureChoice cols={2} value={cp} onChange={setCp} options={points.map((c) => ({ id: c.id, icon: "📍", label: tr(c.name) }))} />

      {group && (
        <>
          <SectionTitle>{t("order_how")}</SectionTitle>
          <PictureChoice
            cols={2}
            value={mode}
            onChange={(v) => setMode(v as "alone" | "group")}
            options={[
              { id: "group", icon: "👥", label: t("order_group"), hint: `${tr(group.name)} · ${t("order_group_hint")}` },
              { id: "alone", icon: "🧑‍🌾", label: t("order_alone") },
            ]}
          />
        </>
      )}

      <Card tone="success" className="flex items-center gap-3">
        <span className="text-[30px]" aria-hidden>💵</span>
        <p className="flex-1 font-bold">{t("cod")}</p>
      </Card>
      <div className="flex items-center justify-between text-[22px] font-bold">
        <span>{t("total")}</span>
        <span>{npr(cartTotal(cart), lang)}</span>
      </div>
    </Page>
  );
}
