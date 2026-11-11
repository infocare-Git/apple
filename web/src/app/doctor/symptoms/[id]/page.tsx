"use client";

import { useParams } from "next/navigation";
import { Button, Card, Page, Speaker } from "@/components/ui";
import { Treatment } from "@/components/Treatment";
import { useLang } from "@/components/useLang";
import { KIND_LABEL, symptomById } from "@/lib/data/symptoms";

export default function SymptomPage() {
  const { id } = useParams<{ id: string }>();
  const { t, tr } = useLang();
  const s = symptomById(id);
  if (!s) return <Page title={t("no_results")} back="/doctor/symptoms"><p>{t("no_results")}</p></Page>;
  const rows = [
    ["signs", s.signs],
    ["life_cycle", s.lifeCycle],
    ["damage", s.damage],
    ["hosts", s.hosts],
  ] as const;
  return (
    <Page title={tr(s.name)} back="/doctor/symptoms" action={<Button href={`/doctor/ask?q=${encodeURIComponent(tr(s.name))}`} icon="👩‍🔬">{t("send_expert")}</Button>}>
      <div className="flex items-center gap-3">
        <span className="grid size-20 place-items-center rounded-card bg-greentint text-[44px]" aria-hidden>{s.icon}</span>
        <p className="flex-1 text-[17px] font-bold text-apple">{tr(KIND_LABEL[s.kind])}</p>
        <Speaker text={[tr(s.name), ...rows.map(([, v]) => tr(v))].join(". ")} />
      </div>
      {rows.map(([k, v]) => (
        <Card key={k}>
          <p className="font-bold">{t(k)}</p>
          <p>{tr(v)}</p>
        </Card>
      ))}
      <Treatment s={s} />
    </Page>
  );
}
