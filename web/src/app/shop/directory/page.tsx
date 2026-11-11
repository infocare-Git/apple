"use client";

import { Card, Page, SectionTitle } from "@/components/ui";
import { useLang } from "@/components/useLang";
import { DIRECTORY, DIRECTORY_KIND } from "@/lib/data/world";
import { digits } from "@/lib/format";
import type { DirectoryEntry } from "@/lib/types";

export default function Directory() {
  const { t, tr, lang } = useLang();
  const kinds = Object.keys(DIRECTORY_KIND) as DirectoryEntry["kind"][];
  return (
    <Page title={t("directory")} back="/shop">
      <p className="text-[16px]">⚠️ {t("placeholder_note")}</p>
      {kinds.map((k) => {
        const items = DIRECTORY.filter((d) => d.kind === k);
        if (!items.length) return null;
        return (
          <section key={k} className="space-y-2">
            <SectionTitle>{tr(DIRECTORY_KIND[k])}</SectionTitle>
            {items.map((d) => (
              <Card key={d.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="font-bold leading-snug">{tr(d.name)}</p>
                  <p className="text-[16px]">📍 {tr(d.place)} · {digits(d.phone, lang)}</p>
                </div>
                <a href={`tel:${d.phone}`} className="grid min-h-14 min-w-20 place-items-center rounded-card bg-leafdeep px-3 font-bold text-white">📞 {t("call")}</a>
              </Card>
            ))}
          </section>
        );
      })}
    </Page>
  );
}
