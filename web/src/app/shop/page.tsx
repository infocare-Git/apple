"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button, Card, Chip, Page } from "@/components/ui";
import { useLang } from "@/components/useLang";
import { update, useStore } from "@/lib/store";
import { CATEGORIES, LISTED_PRODUCTS, productById } from "@/lib/data/catalog";
import { supplierById } from "@/lib/data/world";
import { digits, npr } from "@/lib/format";
import type { ProductCategory } from "@/lib/types";

export default function ShopPage() {
  return (
    <Suspense>
      <Shop />
    </Suspense>
  );
}

function Shop() {
  const { t, tr, lang } = useLang();
  const params = useSearchParams();
  const focus = params.get("add");
  const focused = focus ? productById(focus) : undefined;
  const [cat, setCat] = useState<ProductCategory>(focused?.category ?? "saplings");
  const cart = useStore((s) => s.cart);
  const count = cart.reduce((n, l) => n + l.qty, 0);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    if (focused) {
      setCat(focused.category);
      setTimeout(() => document.getElementById(`p-${focused.id}`)?.scrollIntoView({ block: "center" }), 50);
    }
  }, [focused]);

  const add = (id: string) => {
    update((s) => {
      const line = s.cart.find((l) => l.productId === id);
      return { ...s, cart: line ? s.cart.map((l) => (l.productId === id ? { ...l, qty: l.qty + 1 } : l)) : [...s.cart, { productId: id, qty: 1 }] };
    });
    setFlash(id);
    setTimeout(() => setFlash(null), 1500);
  };

  return (
    <Page title={t("shop_title")} action={<Button href="/shop/cart" disabled={count === 0} icon="🛒">{count ? t("view_cart", { n: digits(count, lang) }) : t("cart_empty")}</Button>}>
      <div className="grid grid-cols-2 gap-3">
        <Card href="/shop/orders" className="flex items-center gap-2 font-bold"><span className="text-[26px]" aria-hidden>🚚</span>{t("my_orders")}</Card>
        <Card href="/shop/directory" className="flex items-center gap-2 font-bold"><span className="text-[26px]" aria-hidden>📒</span>{t("directory")}</Card>
      </div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="tablist">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={cat === c.id}
            onClick={() => setCat(c.id)}
            className={`flex min-h-12 shrink-0 items-center gap-1 rounded-full border-2 px-4 text-[17px] font-bold ${cat === c.id ? "border-apple bg-apple text-white" : "border-line bg-card"}`}
          >
            <span aria-hidden>{c.icon}</span> {tr(c.name)}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {LISTED_PRODUCTS.filter((p) => p.category === cat).map((p) => {
          const inCart = cart.find((l) => l.productId === p.id)?.qty ?? 0;
          const restricted = p.regulatory === "restricted";
          return (
            <div key={p.id} id={`p-${p.id}`} className={`rounded-card border-2 bg-card p-4 ${focus === p.id ? "border-apple" : "border-line"}`}>
              <div className="flex gap-3">
                <span className="grid size-16 shrink-0 place-items-center rounded-card bg-greentint text-[32px]" aria-hidden>{p.icon}</span>
                <div className="flex-1">
                  <p className="text-[19px] font-bold leading-snug">{tr(p.name)}</p>
                  <p className="text-[16px]">{t("sold_by", { name: tr(supplierById(p.supplierId)!.name) })}</p>
                  <p className="mt-1 text-[20px] font-bold">
                    {npr(p.priceNpr, lang)} <span className="text-[16px] font-normal">{t("each", { unit: tr(p.unit) })}</span>
                  </p>
                </div>
              </div>
              {restricted ? (
                <div className="mt-3 space-y-2">
                  <Chip tone="warn">⚠️ {t("restricted")}</Chip>
                  <p className="text-[16px]">{t("restricted_block")}</p>
                  <Link href={`/doctor/ask?q=${encodeURIComponent(tr(p.name))}`} className="block min-h-14 rounded-card border-2 border-soil/30 px-4 py-3 text-center font-bold">👩‍🔬 {t("send_expert")}</Link>
                </div>
              ) : (
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1">
                    <Button tone={flash === p.id ? "success" : "primary"} onClick={() => add(p.id)}>{flash === p.id ? `✓ ${t("added")}` : t("add_to_cart")}</Button>
                  </div>
                  {inCart > 0 && <Chip tone="success">{t("in_cart", { n: digits(inCart, lang) })}</Chip>}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[16px]">⚠️ {t("prices_sample")}</p>
    </Page>
  );
}
