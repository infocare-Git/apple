"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button, Card, Note, Page, PictureChoice, Stepper } from "@/components/ui";
import { useLang } from "@/components/useLang";
import { getState, referencePrice, sampleOffers, uid, update, type Lot } from "@/lib/store";
import { compressImage, thumbnail } from "@/lib/services";
import { COLLECTION_POINTS, FARMER_GROUPS, GRADE_GUIDE, VARIETIES, varietyById } from "@/lib/data/world";
import { bsDate, digits, qty } from "@/lib/format";
import type { Grade } from "@/lib/types";

type Step = "variety" | "grade" | "qty" | "ready" | "photos" | "cp" | "mode" | "review";
const DAY = 24 * 60 * 60 * 1000;

/**
 * Selling has ~8 inputs, which conflicts with "three taps or fewer". The
 * simpler path (see docs/decisions.md): one picture question per screen, and
 * a repeat seller starts on the review screen, pre-filled from the last lot.
 */
export default function NewListing() {
  const { t, tr, lang } = useLang();
  const router = useRouter();
  const s0 = getState();
  const last = s0.lots.find((l) => !l.demo) ?? null;
  const group = FARMER_GROUPS.find((g) => g.id === s0.profile?.groupId);
  const points = [...COLLECTION_POINTS].sort((a, b) => Number(b.palikaId === s0.profile?.palikaId) - Number(a.palikaId === s0.profile?.palikaId));
  const steps: Step[] = ["variety", "grade", "qty", "ready", "photos", "cp", ...(group ? (["mode"] as Step[]) : []), "review"];

  const [step, setStep] = useState<Step>(last ? "review" : "variety");
  const [editing, setEditing] = useState(false);
  const [varietyId, setVarietyId] = useState<string | null>(last?.varietyId ?? s0.profile?.varieties[0] ?? null);
  const [grade, setGrade] = useState<Grade | null>(last?.grade ?? null);
  const [quantity, setQuantity] = useState(last?.quantity ?? 20);
  const [unit, setUnit] = useState<"crate" | "kg">(last?.unit ?? "crate");
  const [ready, setReady] = useState<"now" | "week" | "2weeks">("now");
  const [photos, setPhotos] = useState<string[]>([]);
  const [cp, setCp] = useState<string>(last?.collectionPointId ?? points[0].id);
  const [mode, setMode] = useState<"alone" | "group">(last?.mode ?? (group ? "group" : "alone"));
  const fileRef = useRef<HTMLInputElement>(null);

  const idx = steps.indexOf(step);
  const go = (s: Step) => setStep(s);
  const next = () => go(editing ? "review" : steps[idx + 1]);
  const readyAt = Date.now() + (ready === "now" ? 0 : ready === "week" ? 7 * DAY : 14 * DAY);

  const publish = () => {
    const lot: Lot = { id: uid(), varietyId: varietyId!, grade: grade!, quantity, unit, readyAt, thumbs: photos, collectionPointId: cp, mode, createdAt: Date.now() };
    update((s) => ({ ...s, lots: [lot, ...s.lots], offers: [...s.offers, ...sampleOffers(lot)] }));
    router.replace(`/sell/lot?id=${lot.id}&new=1`);
  };

  const canNext: Record<Step, boolean> = { variety: !!varietyId, grade: !!grade, qty: quantity > 0, ready: true, photos: true, cp: !!cp, mode: true, review: true };
  const title = { variety: t("step_variety"), grade: t("step_grade"), qty: t("step_qty"), ready: t("step_ready"), photos: t("step_photos"), cp: t("step_cp"), mode: t("step_mode"), review: t("review") }[step];

  const action =
    step === "review" ? (
      <Button onClick={publish} disabled={!varietyId || !grade} icon="🍎">{t("publish")}</Button>
    ) : (
      <Button onClick={next} disabled={!canNext[step]}>{t("continue")}</Button>
    );

  return (
    <Page title={title} back="/sell" action={action}>
      {step !== "review" && !editing && (
        <div className="flex items-center justify-between">
          <p className="font-medium">{t("ob_step", { n: digits(idx + 1, lang), total: digits(steps.length, lang) })}</p>
          {idx > 0 && <button type="button" onClick={() => go(steps[idx - 1])} className="min-h-12 rounded-full border-2 border-line bg-card px-4 font-bold">← {t("back")}</button>}
        </div>
      )}

      {step === "variety" && (
        <PictureChoice cols={2} value={varietyId} onChange={(v) => { setVarietyId(v); }} options={VARIETIES.map((v) => ({ id: v.id, icon: <span className="inline-block size-10 rounded-full" style={{ background: v.color }} />, label: tr(v.name) }))} />
      )}

      {step === "grade" && (
        <PictureChoice
          cols={3}
          value={grade}
          onChange={(v) => setGrade(v as Grade)}
          options={(["A", "B", "C"] as Grade[]).map((g) => ({ id: g, icon: GRADE_GUIDE[g].icon, label: `${g}`, hint: tr(GRADE_GUIDE[g].text) }))}
        />
      )}

      {step === "qty" && (
        <>
          <PictureChoice cols={2} value={unit} onChange={(v) => setUnit(v as "crate" | "kg")} options={[{ id: "crate", icon: "🧺", label: t("unit_crates") }, { id: "kg", icon: "⚖️", label: t("unit_kg") }]} />
          <Card className="flex flex-col items-center gap-3">
            <Stepper value={quantity} onChange={setQuantity} min={1} max={5000} label={t("step_qty")} />
            <div className="flex gap-2">
              {(unit === "crate" ? [10, 20, 50, 100] : [100, 250, 500, 1000]).map((n) => (
                <button key={n} type="button" onClick={() => setQuantity(n)} className="min-h-12 rounded-full border-2 border-line bg-card px-3 font-bold">{digits(n, lang)}</button>
              ))}
            </div>
          </Card>
        </>
      )}

      {step === "ready" && (
        <PictureChoice cols={3} value={ready} onChange={(v) => setReady(v as typeof ready)} options={[{ id: "now", icon: "✅", label: t("ready_now") }, { id: "week", icon: "📅", label: t("ready_week") }, { id: "2weeks", icon: "🗓️", label: t("ready_2weeks") }]} />
      )}

      {step === "photos" && (
        <>
          <p>{t("step_photos_hint")}</p>
          <div className="grid grid-cols-2 gap-3">
            {[0, 1].map((i) =>
              photos[i] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={photos[i]} alt="" className="aspect-square w-full rounded-card object-cover" />
              ) : (
                <button key={i} type="button" onClick={() => fileRef.current?.click()} className="grid aspect-square place-items-center rounded-card border-2 border-dashed border-soil/40 bg-card text-[44px]" aria-label={t("add_photo")}>📷</button>
              ),
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const full = await compressImage(f);
              const th = await thumbnail(full, 320);
              setPhotos((p) => [...p, th].slice(0, 2));
            }}
          />
        </>
      )}

      {step === "cp" && <PictureChoice cols={2} value={cp} onChange={setCp} options={points.map((c) => ({ id: c.id, icon: "📍", label: tr(c.name) }))} />}

      {step === "mode" && group && (
        <PictureChoice
          cols={2}
          value={mode}
          onChange={(v) => setMode(v as "alone" | "group")}
          options={[
            { id: "group", icon: "👥", label: t("sell_group"), hint: `${tr(group.name)} · ${t("sell_group_hint")}` },
            { id: "alone", icon: "🧑‍🌾", label: t("sell_alone") },
          ]}
        />
      )}

      {step === "review" && (
        <>
          {last && !editing && <Note tone="info">↺ {t("prefilled")}</Note>}
          {[
            { s: "variety" as Step, label: t("step_variety"), value: varietyId ? tr(varietyById(varietyId)!.name) : "—" },
            { s: "grade" as Step, label: t("step_grade"), value: grade ?? "—" },
            { s: "qty" as Step, label: t("step_qty"), value: qty(quantity, unit, lang) },
            { s: "ready" as Step, label: t("step_ready"), value: bsDate(new Date(readyAt), lang) },
            { s: "photos" as Step, label: t("step_photos"), value: digits(photos.length, lang) },
            { s: "cp" as Step, label: t("step_cp"), value: tr(COLLECTION_POINTS.find((c) => c.id === cp)!.name) },
            ...(group ? [{ s: "mode" as Step, label: t("step_mode"), value: mode === "group" ? t("sell_group") : t("sell_alone") }] : []),
          ].map((row) => (
            <button
              key={row.s}
              type="button"
              onClick={() => {
                setEditing(true);
                go(row.s);
              }}
              className="flex min-h-16 w-full items-center justify-between rounded-card border border-line bg-card px-4 py-2 text-left"
            >
              <span>
                <span className="block text-[16px]">{row.label}</span>
                <span className="block text-[19px] font-bold">{row.value}</span>
              </span>
              <span className="text-apple" aria-hidden>✎</span>
            </button>
          ))}
          {varietyId && grade && (
            <p className="text-[17px]">💰 {t("ref_price", { p: `रु ${digits(referencePrice(varietyId, grade), lang)}` })}</p>
          )}
        </>
      )}
    </Page>
  );
}
