"use client";

import { useMemo, useState } from "react";
import { Card, Page, SectionTitle } from "@/components/ui";
import { useLang } from "@/components/useLang";
import { ARTICLES, TOPICS } from "@/lib/data/articles";
import { BS_MONTHS, digits, toBs } from "@/lib/format";
import type { Key } from "@/lib/i18n";

const SEASON_MONTHS = { spring: [11, 12, 1], summer: [2, 3, 4], autumn: [5, 6, 7], winter: [8, 9, 10] } as const;
type Filter = "now" | "all" | keyof typeof SEASON_MONTHS;

export default function Learn() {
  const { t, tr, lang } = useLang();
  const [filter, setFilter] = useState<Filter>("now");
  const [q, setQ] = useState("");
  const month = toBs(new Date()).month;

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ARTICLES.filter((a) => {
      if (filter === "now" && !a.months.includes(month)) return false;
      if (filter !== "now" && filter !== "all" && !a.months.some((m) => (SEASON_MONTHS[filter] as readonly number[]).includes(m))) return false;
      if (needle && ![a.title.ne, a.title.en, a.summary.ne, a.summary.en].some((s) => s.toLowerCase().includes(needle))) return false;
      return true;
    });
  }, [filter, q, month]);

  const filters: { id: Filter; key: Key }[] = [
    { id: "now", key: "season_now" },
    { id: "all", key: "season_all" },
    { id: "spring", key: "season_spring" },
    { id: "summer", key: "season_summer" },
    { id: "autumn", key: "season_autumn" },
    { id: "winter", key: "season_winter" },
  ];

  return (
    <Page title={t("learn_title")}>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("search")}
        aria-label={t("search")}
        className="min-h-14 w-full rounded-card border-2 border-line bg-card px-4 text-[18px]"
      />
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="tablist">
        {filters.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`min-h-12 shrink-0 rounded-full border-2 px-4 text-[17px] font-bold ${filter === f.id ? "border-apple bg-apple text-white" : "border-line bg-card"}`}
          >
            {t(f.key)}
            {f.id === "now" && ` · ${BS_MONTHS[lang][month - 1]}`}
          </button>
        ))}
      </div>

      {list.length === 0 && <p className="rounded-card border border-dashed border-line p-6 text-center">{t("no_results")}</p>}

      {TOPICS.map((topic) => {
        const items = list.filter((a) => a.topic === topic);
        if (!items.length) return null;
        return (
          <section key={topic} className="space-y-2">
            <SectionTitle right={<span className="text-[16px]">{t("articles_n", { n: digits(items.length, lang) })}</span>}>
              {t(`topic_${topic}` as Key)}
            </SectionTitle>
            {items.map((a) => (
              <Card key={a.slug} href={`/learn/${a.slug}`} className="flex items-center gap-3">
                <span className="grid size-14 shrink-0 place-items-center rounded-card bg-greentint text-[30px]" aria-hidden>{a.icon}</span>
                <span className="flex-1">
                  <span className="block text-[19px] font-bold leading-snug">{tr(a.title)}</span>
                  <span className="block text-[16px]">{a.months.length === 12 ? t("season_all") : a.months.map((m) => BS_MONTHS[lang][m - 1]).join(", ")}</span>
                </span>
              </Card>
            ))}
          </section>
        );
      })}
    </Page>
  );
}
