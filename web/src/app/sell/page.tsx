"use client";

import { Button, Card, Chip, Empty, Page, SectionTitle } from "@/components/ui";
import { useLang } from "@/components/useLang";
import { lotStatus, useStore } from "@/lib/store";
import { LOT_STATUS } from "@/lib/lotStatus";
import { varietyById } from "@/lib/data/world";
import { bsDate, qty, digits } from "@/lib/format";


export default function Sell() {
  const { t, tr, lang } = useLang();
  const lots = useStore((s) => s.lots);
  const offers = useStore((s) => s.offers);
  return (
    <Page title={t("sell_title")} action={<Button href="/sell/new" icon="🍎">{t("new_listing")}</Button>}>
      <Card href="/sell/buyers" className="flex items-center gap-2 font-bold"><span className="text-[26px]" aria-hidden>📒</span>{t("buyers_dir")}</Card>
      <SectionTitle>{t("my_lots")}</SectionTitle>
      {lots.length === 0 && <Empty>{t("no_offers")}</Empty>}
      {lots.map((l) => {
        const v = varietyById(l.varietyId);
        const st = lotStatus(l);
        const n = offers.filter((o) => o.lotId === l.id).length;
        return (
          <Card key={l.id} href={`/sell/lot?id=${l.id}`} className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="inline-block size-12 shrink-0 rounded-full" style={{ background: v?.color }} aria-hidden />
              <div className="flex-1">
                <p className="text-[19px] font-bold">{v ? tr(v.name) : ""} · {l.grade}</p>
                <p className="text-[16px]">{qty(l.quantity, l.unit, lang)} · {bsDate(new Date(l.createdAt), lang)}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Chip tone={LOT_STATUS[st].tone}>{t(LOT_STATUS[st].key)}</Chip>
              {st === "open" && n > 0 && <Chip tone="success">💰 {t("chip_offers", { n: digits(n, lang) })}</Chip>}
              {l.mode === "group" && <Chip>👥 {t("group_lot")}</Chip>}
              {l.demo && <Chip tone="warn">{t("demo")}</Chip>}
            </div>
          </Card>
        );
      })}
    </Page>
  );
}
