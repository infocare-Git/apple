"use client";

import { useParams } from "next/navigation";
import { Button, Card, Page, PlaceholderNote, SectionTitle, Speaker } from "@/components/ui";
import { useLang } from "@/components/useLang";
import { ARTICLES } from "@/lib/data/articles";
import { productById } from "@/lib/data/catalog";
import { BS_MONTHS, digits, toBs } from "@/lib/format";
import type { Key } from "@/lib/i18n";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, tr, lang } = useLang();
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) return <Page title={t("no_results")} back="/learn"><p>{t("no_results")}</p></Page>;
  const now = toBs(new Date()).month;
  const monthsText = a.months.length === 12 ? t("season_all") : a.months.map((m) => BS_MONTHS[lang][m - 1]).join(", ");
  const narration = [tr(a.title), tr(a.summary), ...a.steps.map((s, i) => `${i + 1}. ${tr(s)}`)].join(". ");
  const orderAction = a.actions.find((x) => x.kind === "order");

  return (
    <Page
      title={tr(a.title)}
      back="/learn"
      action={
        orderAction && orderAction.kind === "order" && productById(orderAction.productId) ? (
          <Button href={`/shop?add=${orderAction.productId}`} icon="🛒">{t("order_this", { name: tr(productById(orderAction.productId)!.name) })}</Button>
        ) : (
          <Button href={`/doctor/ask?q=${encodeURIComponent(tr(a.title))}`} icon="🙋">{t("ask_about")}</Button>
        )
      }
    >
      <div className="relative grid h-44 place-items-center overflow-hidden rounded-card bg-gradient-to-br from-greentint to-redtint" role="img" aria-label={tr(a.title)}>
        <span className="text-[88px]" aria-hidden>{a.icon}</span>
        <span className="absolute bottom-2 right-3 rounded-full bg-card/90 px-3 py-1 text-[14px]">📷 {t("photo_coming")}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-[19px]">{tr(a.summary)}</p>
          <p className={`mt-2 inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-[16px] font-bold ${a.months.includes(now) ? "bg-apple text-white" : "border border-line bg-card"}`}>
            🗓️ {t("when")} {monthsText}
          </p>
        </div>
        <Speaker text={narration} />
      </div>

      <PlaceholderNote />

      <SectionTitle>{t("how_to")}</SectionTitle>
      <ol className="space-y-3">
        {a.steps.map((s, i) => (
          <li key={i} className="flex gap-3 rounded-card border border-line bg-card p-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-leafdeep text-[20px] font-bold text-white" aria-hidden>{digits(i + 1, lang)}</span>
            <p className="flex-1 pt-1.5 text-[19px] leading-snug">{tr(s)}</p>
          </li>
        ))}
      </ol>

      <SectionTitle>{t("related")}</SectionTitle>
      <div className="space-y-2">
        {a.actions.map((act, i) => {
          if (act.kind === "order") {
            const p = productById(act.productId);
            if (!p) return null;
            return <Card key={i} href={`/shop?add=${p.id}`} className="flex items-center gap-3"><span className="text-[28px]" aria-hidden>{p.icon}</span><span className="font-bold">{t("order_this", { name: tr(p.name) })}</span></Card>;
          }
          if (act.kind === "diagnose") return <Card key={i} href="/doctor/check" className="flex items-center gap-3"><span className="text-[28px]" aria-hidden>📷</span><span className="font-bold">{t("check_photo")}</span></Card>;
          return <Card key={i} href={`/doctor/ask?q=${encodeURIComponent(tr(a.title))}`} className="flex items-center gap-3"><span className="text-[28px]" aria-hidden>🙋</span><span className="font-bold">{t("ask_about")}</span></Card>;
        })}
      </div>
      <p className="text-[16px]">{t(`topic_${a.topic}` as Key)}</p>
    </Page>
  );
}
