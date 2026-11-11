"use client";

import { Card, Page, SectionTitle } from "@/components/ui";
import { useLang } from "@/components/useLang";
import { BUYERS, BUYER_KIND } from "@/lib/data/world";
import type { Buyer } from "@/lib/types";

// Phone numbers are deliberately not shown here: farmer and buyer numbers
// stay hidden from each other until an offer is accepted.
export default function Buyers() {
  const { t, tr } = useLang();
  const kinds = Object.keys(BUYER_KIND) as Buyer["kind"][];
  return (
    <Page title={t("buyers_dir")} back="/sell">
      <p className="text-[16px]">🔒 {t("phone_hidden")}</p>
      {kinds.map((k) => (
        <section key={k} className="space-y-2">
          <SectionTitle>{tr(BUYER_KIND[k])}</SectionTitle>
          {BUYERS.filter((b) => b.kind === k).map((b) => (
            <Card key={b.id}>
              <p className="font-bold">{tr(b.name)}</p>
              <p className="text-[16px]">📍 {tr(b.base)}</p>
            </Card>
          ))}
        </section>
      ))}
      <p className="text-[16px]">⚠️ {t("placeholder_note")}</p>
    </Page>
  );
}
