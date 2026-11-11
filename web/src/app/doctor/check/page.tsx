"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";
import { Button, Card, Note, Page, PlaceholderNote, SectionTitle, Speaker } from "@/components/ui";
import { useLang } from "@/components/useLang";
import { Icon } from "@/components/icons";
import { update, uid, useStore, type Diagnosis } from "@/lib/store";
import { compressImage, diagnose, listen, speechRecognitionSupported, thumbnail } from "@/lib/services";
import { symptomById } from "@/lib/data/symptoms";
import { productById } from "@/lib/data/catalog";
import { digits, num } from "@/lib/format";
import { Treatment } from "@/components/Treatment";

export default function CheckPage() {
  return (
    <Suspense>
      <Check />
    </Suspense>
  );
}

function Check() {
  const params = useSearchParams();
  const id = params.get("id");
  const existing = useStore((s) => s.diagnoses.find((d) => d.id === id));
  if (existing) return <Result d={existing} />;
  return <Capture />;
}

function Capture() {
  const { t, lang } = useLang();
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [voice, setVoice] = useState("");
  const [listening, setListening] = useState(false);
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState(false);

  const addFiles = async (files: FileList | null) => {
    if (!files) return;
    const room = 3 - photos.length;
    const next: string[] = [];
    for (const f of Array.from(files).slice(0, room)) {
      try {
        next.push(await compressImage(f));
      } catch {
        /* skip unreadable file */
      }
    }
    setPhotos((p) => [...p, ...next].slice(0, 3));
  };

  const run = async () => {
    setBusy(true);
    const thumbs = await Promise.all(photos.map((p) => thumbnail(p)));
    const record: Diagnosis = { id: uid(), thumbs, voiceNote: voice || undefined, symptomId: "", confidence: 0, sentToExpert: false, createdAt: Date.now() };
    if (!navigator.onLine) {
      // Offline: keep the request and open the symptom browser.
      record.sentToExpert = true;
      record.symptomId = "";
      update((s) => ({ ...s, diagnoses: [record, ...s.diagnoses] }));
      setOffline(true);
      setBusy(false);
      return;
    }
    const r = await diagnose(photos);
    record.symptomId = r.symptomId;
    record.confidence = r.confidence;
    record.sentToExpert = r.needsExpert; // low confidence goes to an expert automatically
    update((s) => ({ ...s, diagnoses: [record, ...s.diagnoses] }));
    router.replace(`/doctor/check?id=${record.id}`);
  };

  if (offline) {
    return (
      <Page title={t("diag_cta")} back="/doctor" action={<Button href="/doctor/symptoms" icon="🔍">{t("browse_symptoms")}</Button>}>
        <Note>📵 {t("offline_diag")}</Note>
      </Page>
    );
  }

  return (
    <Page
      title={t("diag_cta")}
      back="/doctor"
      speakText={t("diag_guide")}
      action={<Button onClick={run} disabled={photos.length === 0 || busy} icon="🔎">{busy ? t("checking") : t("check_now")}</Button>}
    >
      {/* Framing guide */}
      <button
        type="button"
        onClick={() => input.current?.click()}
        disabled={photos.length >= 3}
        className="relative grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-card bg-soil text-white disabled:opacity-60"
      >
        <span className="absolute inset-6 rounded-card border-4 border-dashed border-white/80" aria-hidden />
        <span className="relative flex flex-col items-center gap-2 px-8 text-center">
          <Icon name="camera" className="size-14" />
          <span className="text-[22px] font-bold">{t("add_photo")}</span>
          <span className="text-[16px]">{t("diag_guide")}</span>
        </span>
      </button>
      <input ref={input} type="file" accept="image/*" capture="environment" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
      <p className="text-center font-bold">{t("photos_n", { n: digits(photos.length, lang) })}</p>
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {photos.map((p, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p} alt="" className="aspect-square w-full rounded-card object-cover" />
              <button type="button" aria-label={t("remove")} onClick={() => setPhotos((ps) => ps.filter((_, j) => j !== i))} className="absolute -right-2 -top-2 grid size-10 place-items-center rounded-full bg-apple text-white">✕</button>
            </div>
          ))}
        </div>
      )}
      {speechRecognitionSupported() && (
        <Button
          tone="secondary"
          icon="🎙️"
          onClick={() => {
            setListening(true);
            listen(lang, (txt) => setVoice(txt), () => setListening(false));
          }}
        >
          {listening ? t("mic_listening") : t("voice_note")}
        </Button>
      )}
      {voice && <Card>🎙️ {voice}</Card>}
    </Page>
  );
}

function Result({ d }: { d: Diagnosis }) {
  const { t, tr, lang } = useLang();
  const s = symptomById(d.symptomId);
  if (!s) {
    return (
      <Page title={t("diag_cta")} back="/doctor" action={<Button href="/doctor/symptoms" icon="🔍">{t("browse_symptoms")}</Button>}>
        <Note>📵 {t("offline_diag")}</Note>
      </Page>
    );
  }
  const pct = num(Math.round(d.confidence * 100), lang);
  return (
    <Page
      title={t("likely")}
      back="/doctor"
      action={
        d.sentToExpert ? (
          <Button href="/doctor/ask" tone="secondary" icon="💬">{t("waiting_expert")}</Button>
        ) : s.chemicalProductIds.length || s.organic ? (
          <Button href={`/shop?add=${s.chemicalProductIds.find((id) => productById(id)?.regulatory === "normal") ?? ""}`} icon="🛒">{t("order_treatment")}</Button>
        ) : (
          <Button href="/doctor/ask" icon="🙋">{t("send_expert")}</Button>
        )
      }
    >
      <Note>🤖 {t("demo_ai")}</Note>
      <Card tone={d.sentToExpert ? "warn" : "red"} className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-[48px]" aria-hidden>{s.icon}</span>
          <div className="flex-1">
            <h2 className="text-[24px] font-bold leading-tight">{tr(s.name)}</h2>
            <p className="font-medium">{t("confidence", { p: `${pct}%` })}</p>
          </div>
          <Speaker text={`${tr(s.name)}. ${tr(s.signs)}. ${tr(s.cultural)}`} />
        </div>
        <div className="h-3 rounded-full bg-card" aria-hidden>
          <div className={`h-3 rounded-full ${d.sentToExpert ? "bg-soil" : "bg-leafdeep"}`} style={{ width: `${Math.round(d.confidence * 100)}%` }} />
        </div>
        {d.sentToExpert && <p className="font-bold">👩‍🔬 {t("low_conf")}</p>}
      </Card>
      {d.thumbs.length > 0 && (
        <div className="flex gap-2">
          {d.thumbs.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className="size-20 rounded-card object-cover" />
          ))}
        </div>
      )}
      <p><b>{t("signs")}:</b> {tr(s.signs)}</p>
      <Treatment s={s} />
      <Link href={`/doctor/symptoms/${s.id}`} className="block min-h-14 rounded-card border border-line bg-card px-4 py-3 font-bold text-apple">{t("browse_symptoms")} →</Link>
      {!d.sentToExpert && <Button tone="secondary" href={`/doctor/ask?q=${encodeURIComponent(tr(s.name))}`} icon="👩‍🔬">{t("send_expert")}</Button>}
    </Page>
  );
}

