"use client";

import { Card, Page, SectionTitle } from "@/components/ui";
import { useLang } from "@/components/useLang";
import { KIND_LABEL, SYMPTOMS } from "@/lib/data/symptoms";
import type { SymptomKind } from "@/lib/types";

const DISEASE: SymptomKind[] = ["fungal", "bacterial", "viral", "lichen", "nutrient"];
const PEST: SymptomKind[] = ["chewing", "sucking", "borer", "grub"];

export default function Symptoms() {
  const { t, tr } = useLang();
  const group = (kinds: SymptomKind[]) =>
    kinds.map((k) => {
      const items = SYMPTOMS.filter((s) => s.kind === k);
      return (
        <div key={k} className="space-y-2">
          <p className="pt-1 text-[17px] font-bold text-apple">{tr(KIND_LABEL[k])}</p>
          {items.map((s) => (
            <Card key={s.id} href={`/doctor/symptoms/${s.id}`} className="flex items-center gap-3">
              <span className="grid size-14 shrink-0 place-items-center rounded-card bg-greentint text-[28px]" aria-hidden>{s.icon}</span>
              <span className="flex-1">
                <span className="block font-bold leading-snug">{tr(s.name)}</span>
                <span className="block text-[16px] leading-snug">{tr(s.signs)}</span>
              </span>
            </Card>
          ))}
        </div>
      );
    });
  return (
    <Page title={t("browse_symptoms")} back="/doctor">
      <SectionTitle>🍂 {t("diseases")}</SectionTitle>
      {group(DISEASE)}
      <SectionTitle>🐛 {t("pests")}</SectionTitle>
      {group(PEST)}
    </Page>
  );
}
