"use client";

import { Button, Card, Page, SectionTitle } from "@/components/ui";
import { useLang } from "@/components/useLang";
import { useStore } from "@/lib/store";
import { symptomById } from "@/lib/data/symptoms";
import { bsDate, num } from "@/lib/format";

export default function Doctor() {
  const { t, tr, lang } = useLang();
  const checks = useStore((s) => s.diagnoses);
  return (
    <Page title={t("doctor_title")} speakText={t("doctor_intro")} action={<Button href="/doctor/check" icon="📷">{t("diag_cta")}</Button>}>
      <p className="text-[19px]">{t("doctor_intro")}</p>
      <div className="grid grid-cols-2 gap-3">
        <Card href="/doctor/symptoms" className="flex min-h-28 flex-col items-center justify-center gap-1 text-center">
          <span className="text-[36px]" aria-hidden>🔍</span>
          <span className="font-bold">{t("browse_symptoms")}</span>
        </Card>
        <Card href="/doctor/ask" className="flex min-h-28 flex-col items-center justify-center gap-1 text-center">
          <span className="text-[36px]" aria-hidden>🙋</span>
          <span className="font-bold">{t("ask_title")}</span>
        </Card>
      </div>
      {checks.length > 0 && (
        <>
          <SectionTitle>{t("my_checks")}</SectionTitle>
          {checks.map((d) => {
            const s = symptomById(d.symptomId);
            return (
              <Card key={d.id} href={`/doctor/check?id=${d.id}`} className="flex items-center gap-3">
                {d.thumbs[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={d.thumbs[0]} alt="" className="size-16 rounded-card object-cover" />
                ) : (
                  <span className="grid size-16 place-items-center rounded-card bg-greentint text-[30px]" aria-hidden>{s?.icon}</span>
                )}
                <span className="flex-1">
                  <span className="block font-bold">{s ? tr(s.name) : "—"}</span>
                  <span className="block text-[16px]">{bsDate(new Date(d.createdAt), lang)} · {d.sentToExpert ? t("waiting_expert") : `${num(Math.round(d.confidence * 100), lang)}%`}</span>
                </span>
              </Card>
            );
          })}
        </>
      )}
    </Page>
  );
}
