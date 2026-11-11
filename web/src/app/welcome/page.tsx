"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, PictureChoice, Stepper, Note } from "@/components/ui";
import { useLang } from "@/components/useLang";
import { update, seedDemo } from "@/lib/store";
import { answer, sms } from "@/lib/services";
import { digits } from "@/lib/format";
import { FARMER_GROUPS, PALIKAS, VARIETIES } from "@/lib/data/world";
import { ARTICLES } from "@/lib/data/articles";
import { SYMPTOMS } from "@/lib/data/symptoms";
import type { Profile } from "@/lib/store";

const TOTAL = 8;

export default function Welcome() {
  const { t, tr, lang, setLang } = useLang();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [palikaId, setPalikaId] = useState<string | null>(null);
  const [ward, setWard] = useState(1);
  const [size, setSize] = useState<Profile["size"] | null>(null);
  const [varieties, setVarieties] = useState<string[]>([]);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [packState, setPackState] = useState<"idle" | "loading" | "done">("idle");

  const toAscii = (s: string) => s.replace(/[०-९]/g, (d) => String("०१२३४५६७८९".indexOf(d))).replace(/\D/g, "");
  const phoneOk = /^9[78]\d{8}$/.test(toAscii(phone));

  const next = () => {
    setError(null);
    setStep((s) => s + 1);
  };

  const downloadPack = async () => {
    setPackState("loading");
    const urls = ["/learn", "/doctor", "/doctor/symptoms", ...ARTICLES.map((a) => `/learn/${a.slug}`), ...SYMPTOMS.map((s) => `/doctor/symptoms/${s.id}`)];
    try {
      // The service worker stores each page so it opens without signal.
      await Promise.all(urls.map((u) => fetch(u).catch(() => null)));
    } finally {
      setPackState("done");
    }
  };

  const finish = () => {
    const profile: Profile = {
      name: name.trim(),
      phone: toAscii(phone),
      palikaId: palikaId!,
      ward,
      size: size!,
      varieties,
      groupId,
      contentPack: packState === "done",
      createdAt: Date.now(),
    };
    const demo = seedDemo();
    demo.questions = demo.questions.map((q) => ({ ...q, ai: { ...answer(q.text, "ne") } }));
    update((s) => ({ ...s, profile, ...demo }));
    router.replace("/");
  };

  const canContinue: Record<number, boolean> = {
    1: true,
    4: name.trim().length >= 2 && palikaId !== null,
    5: size !== null,
    6: varieties.length > 0,
    7: true,
    8: true,
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col px-4 pb-4 pt-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid size-14 place-items-center rounded-card bg-apple text-[32px]" aria-hidden>🍎</span>
        <div>
          <p className="text-[26px] font-bold leading-tight">{t("app")}</p>
          <p className="text-[16px]">{t("tagline")}</p>
        </div>
      </div>
      <p className="mb-2 text-[16px] font-medium">{t("ob_step", { n: digits(step, lang), total: digits(TOTAL, lang) })}</p>
      <div className="mb-6 h-2 rounded-full bg-line" aria-hidden>
        <div className="h-2 rounded-full bg-apple transition-all" style={{ width: `${(step / TOTAL) * 100}%` }} />
      </div>

      <div className="flex-1 space-y-4">
        {step === 1 && (
          <>
            <h1 className="text-[24px] font-bold">भाषा छान्नुहोस् · Choose language</h1>
            <PictureChoice
              cols={2}
              value={lang}
              onChange={(v) => setLang(v as "ne" | "en")}
              options={[
                { id: "ne", icon: "क", label: "नेपाली" },
                { id: "en", icon: "A", label: "English" },
              ]}
            />
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-[24px] font-bold">{t("ob_phone")}</h1>
            <input
              inputMode="numeric"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="98XXXXXXXX"
              className="min-h-16 w-full rounded-card border-2 border-line bg-card px-4 text-[24px] tracking-wider"
              aria-label={t("ob_phone")}
            />
            {phone.length > 0 && !phoneOk && <Note>{t("ob_phone_bad")}</Note>}
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-[24px] font-bold">{t("ob_code")}</h1>
            {demoCode && <Note tone="info">ℹ️ {t("ob_demo_code", { code: digits(demoCode, lang) })}</Note>}
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="min-h-16 w-full rounded-card border-2 border-line bg-card px-4 text-center text-[32px] tracking-[0.4em]"
              aria-label={t("ob_code")}
            />
            {error && <Note>{error}</Note>}
          </>
        )}

        {step === 4 && (
          <>
            <h1 className="text-[24px] font-bold">{t("ob_name")}</h1>
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="min-h-16 w-full rounded-card border-2 border-line bg-card px-4 text-[22px]" aria-label={t("ob_name")} />
            <h2 className="pt-2 text-[22px] font-bold">{t("ob_place")}</h2>
            <PictureChoice cols={3} value={palikaId} onChange={setPalikaId} options={PALIKAS.map((p) => ({ id: p.id, icon: "🏘️", label: tr(p.name).split(" ")[0] }))} />
            <div className="flex items-center justify-between rounded-card border border-line bg-card p-3">
              <span className="text-[18px] font-medium">{t("ob_ward")}</span>
              <Stepper value={ward} onChange={setWard} min={1} max={15} label={t("ob_ward")} />
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h1 className="text-[24px] font-bold">{t("ob_size")}</h1>
            <PictureChoice
              cols={3}
              value={size}
              onChange={(v) => setSize(v as Profile["size"])}
              options={[
                { id: "small", icon: "🌳", label: t("size_small"), hint: t("size_small_hint") },
                { id: "medium", icon: "🌳🌳", label: t("size_medium"), hint: t("size_medium_hint") },
                { id: "large", icon: "🌳🌳🌳", label: t("size_large"), hint: t("size_large_hint") },
              ]}
            />
          </>
        )}

        {step === 6 && (
          <>
            <h1 className="text-[24px] font-bold">{t("ob_varieties")}</h1>
            <PictureChoice
              multi
              cols={2}
              value={varieties}
              onChange={(v) => setVarieties((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]))}
              options={VARIETIES.map((v) => ({ id: v.id, icon: <span className="inline-block size-10 rounded-full" style={{ background: v.color }} />, label: tr(v.name) }))}
            />
          </>
        )}

        {step === 7 && (
          <>
            <h1 className="text-[24px] font-bold">{t("ob_group")}</h1>
            <PictureChoice
              cols={2}
              value={groupId ?? "none"}
              onChange={(v) => setGroupId(v === "none" ? null : v)}
              options={[
                ...FARMER_GROUPS.map((g) => ({ id: g.id, icon: "👥", label: tr(g.name), hint: t("ob_members", { n: digits(g.members, lang) }) })),
                { id: "none", icon: "🧑‍🌾", label: t("ob_no_group") },
              ]}
            />
          </>
        )}

        {step === 8 && (
          <>
            <h1 className="text-[24px] font-bold">{t("ob_pack")}</h1>
            <p>{t("ob_pack_hint")}</p>
            {packState === "done" ? (
              <Note tone="info">✅ {t("ob_pack_done")}</Note>
            ) : (
              <Button tone="secondary" icon="⬇️" onClick={downloadPack} disabled={packState === "loading"}>
                {packState === "loading" ? "…" : t("ob_pack")}
              </Button>
            )}
            <Note tone="info">{t("phase_note")}</Note>
          </>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        {step > 1 && (
          <div className="w-1/3">
            <Button tone="secondary" onClick={() => setStep((s) => s - 1)}>{t("back")}</Button>
          </div>
        )}
        <div className="flex-1">
          {step === 2 ? (
            <Button
              disabled={!phoneOk || busy}
              onClick={async () => {
                setBusy(true);
                const r = await sms.sendOtp(toAscii(phone));
                setDemoCode(r.demoCode);
                setBusy(false);
                next();
              }}
            >
              {t("ob_send_code")}
            </Button>
          ) : step === 3 ? (
            <Button
              disabled={code.length < 6}
              onClick={async () => {
                if (await sms.verifyOtp(phone, code)) next();
                else setError(t("ob_code_bad"));
              }}
            >
              {t("ob_verify")}
            </Button>
          ) : step === TOTAL ? (
            <Button onClick={finish}>{t("ob_finish")}</Button>
          ) : (
            <Button disabled={!canContinue[step]} onClick={next}>{t("continue")}</Button>
          )}
        </div>
      </div>
    </div>
  );
}
