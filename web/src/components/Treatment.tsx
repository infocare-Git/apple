"use client";

import { Card, PlaceholderNote, SectionTitle } from "./ui";
import { useLang } from "./useLang";
import { productById } from "@/lib/data/catalog";
import { digits } from "@/lib/format";
import type { Symptom } from "@/lib/types";

/** Three layers: cultural, organic, chemical (dose, waiting period, safety gear). */
export function Treatment({ s }: { s: Symptom }) {
  const { t, tr, lang } = useLang();
  const chems = s.chemicalProductIds.map(productById).filter((p) => p?.chemical);
  return (
    <section className="space-y-3">
      <SectionTitle>{t("how_to")}</SectionTitle>
      <Card tone="success"><p className="font-bold">{t("treat_cultural")}</p><p>{tr(s.cultural)}</p></Card>
      <Card><p className="font-bold">{t("treat_organic")}</p><p>{tr(s.organic)}</p></Card>
      <Card className="space-y-2">
        <p className="font-bold">{t("treat_chemical")}</p>
        {chems.length === 0 && <p>{t("no_chemical")}</p>}
        {chems.map((p) => (
          <div key={p!.id} className="rounded-card border border-line p-3">
            <p className="font-bold">{p!.icon} {tr(p!.name)}</p>
            {p!.regulatory === "restricted" && <p className="mt-1 inline-block rounded-full bg-amber px-3 text-[16px] font-bold">⚠️ {t("restricted")}</p>}
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[17px]">
              <dt className="font-medium">{t("dose")}:</dt>
              <dd>{p!.chemical!.dose ? tr(p!.chemical!.dose) : <b className="text-apple">{t("pending_expert")}</b>}</dd>
              <dt className="font-medium">{t("phi")}:</dt>
              <dd>{p!.chemical!.preHarvestDays != null ? digits(p!.chemical!.preHarvestDays, lang) : <b className="text-apple">{t("pending_expert")}</b>}</dd>
              <dt className="font-medium">{t("gear")}:</dt>
              <dd>🧤 {tr(p!.chemical!.gear)}</dd>
            </dl>
          </div>
        ))}
      </Card>
      <PlaceholderNote />
    </section>
  );
}
