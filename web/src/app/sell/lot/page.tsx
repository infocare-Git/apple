"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button, Card, Chip, Empty, Note, Page, SectionTitle } from "@/components/ui";
import { useLang } from "@/components/useLang";
import { lotKg, lotStatus, referencePrice, update, useStore, type Offer } from "@/lib/store";
import { LOT_STATUS } from "@/lib/lotStatus";
import { BUYER_KIND, COLLECTION_POINTS, buyerById, varietyById } from "@/lib/data/world";
import { bsDate, digits, npr, num, qty } from "@/lib/format";

export default function LotPage() {
  return (
    <Suspense>
      <LotView />
    </Suspense>
  );
}

function LotView() {
  const { t, tr, lang } = useLang();
  const params = useSearchParams();
  const id = params.get("id");
  const isNew = params.get("new") === "1";
  const lot = useStore((s) => s.lots.find((l) => l.id === id));
  const allOffers = useStore((s) => s.offers);
  const offers = allOffers.filter((o) => o.lotId === id);
  const profile = useStore((s) => s.profile);
  const [weight, setWeight] = useState("");

  // Mark offers as seen once the farmer has looked at them.
  useEffect(() => {
    if (id) update((s) => ({ ...s, offers: s.offers.map((o) => (o.lotId === id ? { ...o, seen: true } : o)) }));
  }, [id]);

  if (!lot) return <Page title={t("sell_title")} back="/sell"><Empty>{t("no_results")}</Empty></Page>;

  const v = varietyById(lot.varietyId)!;
  const st = lotStatus(lot);
  const ref = referencePrice(lot.varietyId, lot.grade);
  const kg = lotKg(lot);
  const sorted = [...offers].sort((a, b) => b.pricePerKg - a.pricePerKg);
  const accepted = offers.find((o) => o.id === lot.acceptedOfferId);
  const buyer = accepted ? buyerById(accepted.buyerId) : undefined;
  const cp = COLLECTION_POINTS.find((c) => c.id === lot.collectionPointId);
  const finalKg = lot.pickupKg ?? kg;
  const due = accepted ? accepted.pricePerKg * finalKg : 0;

  const accept = (o: Offer) => update((s) => ({ ...s, lots: s.lots.map((l) => (l.id === lot.id ? { ...l, acceptedOfferId: o.id } : l)) }));
  const saveWeight = () => {
    const n = Number(weight.replace(/[०-९]/g, (d) => String("०१२३४५६७८९".indexOf(d))));
    if (n > 0) update((s) => ({ ...s, lots: s.lots.map((l) => (l.id === lot.id ? { ...l, pickupKg: n } : l)) }));
  };
  const markPaid = () => update((s) => ({ ...s, lots: s.lots.map((l) => (l.id === lot.id ? { ...l, paidAt: Date.now() } : l)) }));

  const action =
    st === "picked" ? <Button tone="success" onClick={markPaid} icon="💵">{t("pay_done")}</Button> : st === "open" ? undefined : st === "sold" ? <Button onClick={saveWeight} disabled={!weight} icon="⚖️">{t("save_weight")}</Button> : <Button href="/sell/new" icon="🍎">{t("new_listing")}</Button>;

  return (
    <Page title={`${tr(v.name)} · ${lot.grade}`} back="/sell" action={action}>
      {isNew && st === "open" && <Card tone="success">✅ {t("listed_ok")}</Card>}
      <Card className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="inline-block size-12 rounded-full" style={{ background: v.color }} aria-hidden />
          <div className="flex-1">
            <p className="text-[20px] font-bold">{qty(lot.quantity, lot.unit, lang)}{lot.unit === "crate" && ` (≈ ${qty(kg, "kg", lang)})`}</p>
            <p className="text-[16px]">📍 {cp ? tr(cp.name) : ""} · {t("ready_on", { d: bsDate(new Date(lot.readyAt), lang) })}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip tone={LOT_STATUS[st].tone}>{t(LOT_STATUS[st].key)}</Chip>
          {lot.mode === "group" && <Chip>👥 {t("group_lot")}</Chip>}
          {lot.demo && <Chip tone="warn">{t("demo")}</Chip>}
        </div>
        {lot.thumbs.length > 0 && (
          <div className="flex gap-2">
            {lot.thumbs.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt="" className="size-20 rounded-card object-cover" />
            ))}
          </div>
        )}
      </Card>

      {st === "open" && (
        <>
          <SectionTitle right={<span className="text-[16px]">{t("ref_price", { p: npr(ref, lang) })}</span>}>{t("offers")}</SectionTitle>
          <Note tone="info">🔒 {t("phone_hidden")}</Note>
          {sorted.length === 0 && <Empty>{t("no_offers")}</Empty>}
          {sorted.map((o, i) => {
            const b = buyerById(o.buyerId)!;
            const diff = o.pricePerKg - ref;
            return (
              <Card key={o.id} tone={i === 0 ? "success" : undefined} className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold">{tr(b.name)}</p>
                    <p className="text-[16px]">{tr(BUYER_KIND[b.kind])} · {tr(b.base)}</p>
                  </div>
                  {i === 0 && <Chip tone="success">★ {t("best")}</Chip>}
                </div>
                <p className="text-[24px] font-bold">{npr(o.pricePerKg, lang)} <span className="text-[16px] font-normal">/ {t("unit_kg")}</span></p>
                <p className={`text-[16px] font-medium ${diff >= 0 ? "text-leafdeep" : "text-apple"}`}>
                  {diff >= 0 ? "▲" : "▼"} {t(diff >= 0 ? "vs_ref_above" : "vs_ref_below", { p: npr(Math.abs(diff), lang) })} · {t("offer_total", { p: npr(o.pricePerKg * kg, lang) })}
                </p>
                <Button tone={i === 0 ? "primary" : "secondary"} onClick={() => accept(o)}>{t("accept")}</Button>
              </Card>
            );
          })}
          {lot.demo !== true && <p className="text-[16px]">ℹ️ {t("phase_note")}</p>}
        </>
      )}

      {accepted && buyer && (
        <>
          <SectionTitle>{t("sale_note")}</SectionTitle>
          <Card className="space-y-1 border-2 border-dashed">
            <p className="text-[16px]">#{lot.id.slice(0, 8).toUpperCase()} · {bsDate(new Date(lot.createdAt), lang)}</p>
            <p><b>{t("farmer")}:</b> {profile?.name} · {digits(profile?.phone ?? "", lang)}</p>
            <p><b>{tr(BUYER_KIND[buyer.kind])}:</b> {tr(buyer.name)} · {digits(buyer.phone, lang)}</p>
            <p><b>{tr(v.name)} {lot.grade}:</b> {qty(lot.quantity, lot.unit, lang)} × {npr(accepted.pricePerKg, lang)}/{t("unit_kg")}</p>
            {lot.pickupKg && <p><b>⚖️</b> {qty(lot.pickupKg, "kg", lang)}</p>}
            <p className="text-[20px] font-bold">{t("total")}: {npr(due, lang)}</p>
            <a href={`tel:${buyer.phone}`} className="mt-2 grid min-h-14 place-items-center rounded-card bg-leafdeep font-bold text-white">📞 {t("call")} {tr(buyer.name)}</a>
          </Card>
        </>
      )}

      {st === "sold" && (
        <Card className="space-y-2">
          <label htmlFor="w" className="block font-bold">{t("pickup_weight")}</label>
          <input id="w" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder={num(kg, lang)} className="min-h-14 w-full rounded-card border-2 border-line px-4 text-[22px]" />
        </Card>
      )}

      {(st === "picked" || st === "paid") && (
        <Card tone={st === "paid" ? "success" : "warn"}>
          <p className="font-bold">{t("payment")}</p>
          <p className="text-[20px]">{st === "paid" ? `✓ ${t("paid")} · ${npr(due, lang)}` : t("pay_due", { p: npr(due, lang) })}</p>
        </Card>
      )}
    </Page>
  );
}
