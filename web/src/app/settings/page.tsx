"use client";

import { useRouter } from "next/navigation";
import { Button, Card, Note, Page, PictureChoice, SectionTitle } from "@/components/ui";
import { useLang } from "@/components/useLang";
import { resetAll, useStore } from "@/lib/store";
import { FARMER_GROUPS, PALIKAS, varietyById } from "@/lib/data/world";
import { digits } from "@/lib/format";

export default function Settings() {
  const { t, tr, lang, setLang } = useLang();
  const router = useRouter();
  const p = useStore((s) => s.profile);
  return (
    <Page title={t("settings")} back="/">
      <SectionTitle>{t("language")}</SectionTitle>
      <PictureChoice cols={2} value={lang} onChange={(v) => setLang(v as "ne" | "en")} options={[{ id: "ne", icon: "क", label: "नेपाली" }, { id: "en", icon: "A", label: "English" }]} />
      {p && (
        <Card className="space-y-1">
          <p className="text-[20px] font-bold">{p.name}</p>
          <p>📱 {digits(p.phone, lang)}</p>
          <p>🏘️ {tr(PALIKAS.find((x) => x.id === p.palikaId)!.name)}–{digits(p.ward, lang)}</p>
          <p>🍎 {p.varieties.map((v) => tr(varietyById(v)!.name)).join(", ")}</p>
          {p.groupId && <p>👥 {tr(FARMER_GROUPS.find((g) => g.id === p.groupId)!.name)}</p>}
        </Card>
      )}
      <Note tone="info">{t("phase_note")}</Note>
      <Button
        tone="secondary"
        icon="🗑️"
        onClick={() => {
          if (window.confirm(t("reset_confirm"))) {
            resetAll();
            router.replace("/welcome");
          }
        }}
      >
        {t("reset_demo")}
      </Button>
    </Page>
  );
}
