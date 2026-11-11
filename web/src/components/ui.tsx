"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useLang } from "./useLang";
import { speak, stopSpeaking } from "@/lib/services";
import { Icon } from "./icons";

// The design system. Every screen is built from these pieces.

export function Page({ title, back, speakText, children, action }: { title: string; back?: string | true; speakText?: string; children: ReactNode; action?: ReactNode }) {
  const router = useRouter();
  const { t } = useLang();
  return (
    <div className="mx-auto w-full max-w-xl">
      <header className="sticky top-0 z-20 flex min-h-16 items-center gap-2 border-b border-line bg-cream/95 px-4 py-2 backdrop-blur">
        {back && (
          <button
            type="button"
            aria-label={t("back")}
            onClick={() => (back === true ? router.back() : router.push(back))}
            className="-ml-2 grid size-14 shrink-0 place-items-center rounded-card active:bg-redtint"
          >
            <Icon name="back" className="size-7" />
          </button>
        )}
        <h1 className="flex-1 text-[24px] font-bold leading-tight">{title}</h1>
        {speakText && <Speaker text={speakText} />}
      </header>
      <OfflineBanner />
      <main className="space-y-4 px-4 pb-6 pt-4">{children}</main>
      {action && <ActionBar>{action}</ActionBar>}
    </div>
  );
}

/** One primary action per screen, full width, at the bottom. */
function ActionBar({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.style.setProperty("--action-h", "84px");
    return () => document.documentElement.style.setProperty("--action-h", "0px");
  }, []);
  return (
    <>
      <div style={{ height: 84 }} aria-hidden />
      <div className="fixed inset-x-0 z-30 border-t border-line bg-cream px-4 py-3" style={{ bottom: "var(--tabs-h)" }}>
        <div className="mx-auto max-w-xl">{children}</div>
      </div>
    </>
  );
}

type BtnProps = { children: ReactNode; href?: string; onClick?: () => void; disabled?: boolean; type?: "button" | "submit"; tone?: "primary" | "secondary" | "success"; icon?: string };

export function Button({ children, href, onClick, disabled, type = "button", tone = "primary", icon }: BtnProps) {
  const cls = {
    primary: "bg-apple text-white active:bg-apple-dark",
    secondary: "border-2 border-soil/30 bg-card text-soil active:bg-redtint",
    success: "bg-leafdeep text-white",
  }[tone];
  const inner = (
    <span className="flex items-center justify-center gap-2">
      {icon && <span aria-hidden className="text-[22px]">{icon}</span>}
      {children}
    </span>
  );
  const base = `block min-h-14 w-full rounded-card px-5 py-3 text-center text-[20px] font-bold transition-colors disabled:opacity-40 ${cls}`;
  if (href && !disabled) return <Link href={href} className={base}>{inner}</Link>;
  return <button type={type} onClick={onClick} disabled={disabled} className={base}>{inner}</button>;
}

export function Card({ children, className = "", href, tone }: { children: ReactNode; className?: string; href?: string; tone?: "warn" | "success" | "red" }) {
  const toneCls = tone === "warn" ? "bg-amber border-amber" : tone === "success" ? "bg-greentint border-leaf/40" : tone === "red" ? "bg-redtint border-apple/30" : "bg-card border-line";
  const cls = `block rounded-card border p-4 shadow-[0_1px_0_rgba(78,52,46,0.06)] ${toneCls} ${className}`;
  if (href) return <Link href={href} className={`${cls} active:bg-redtint`}>{children}</Link>;
  return <div className={cls}>{children}</div>;
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between pt-2">
      <h2 className="text-[20px] font-bold">{children}</h2>
      {right}
    </div>
  );
}

/** Every text block has a speaker button. */
export function Speaker({ text, label }: { text: string; label?: string }) {
  const { lang, t } = useLang();
  const [on, setOn] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  useEffect(() => () => stopSpeaking(), []);
  return (
    <span className="inline-flex flex-col items-center">
      <button
        type="button"
        aria-label={on ? t("stop") : label ?? t("listen")}
        aria-pressed={on}
        onClick={() => {
          if (on) {
            stopSpeaking();
            setOn(false);
            return;
          }
          const r = speak(text, lang, () => setOn(false));
          if (r) {
            setOn(true);
            setNote(r.fallback ? t("no_voice") : null);
          }
        }}
        className={`grid size-14 shrink-0 place-items-center rounded-full border-2 ${on ? "border-apple bg-apple text-white" : "border-apple/40 bg-card text-apple"}`}
      >
        <Icon name={on ? "stop" : "speaker"} className="size-7" />
      </button>
      {note && on && <span className="sr-only" role="status">{note}</span>}
    </span>
  );
}

export type Choice = { id: string; icon: ReactNode; label: string; hint?: string };

/** Every input that can be a picture choice is one. */
export function PictureChoice({ options, value, onChange, cols = 3, multi = false }: { options: Choice[]; value: string | string[] | null; onChange: (v: string) => void; cols?: 2 | 3; multi?: boolean }) {
  const selected = (id: string) => (Array.isArray(value) ? value.includes(id) : value === id);
  return (
    <div role={multi ? "group" : "radiogroup"} className={`grid gap-3 ${cols === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role={multi ? "checkbox" : "radio"}
          aria-checked={selected(o.id)}
          onClick={() => onChange(o.id)}
          className={`relative flex min-h-28 flex-col items-center justify-center gap-1 rounded-card border-2 p-3 text-center ${selected(o.id) ? "border-apple bg-redtint" : "border-line bg-card"}`}
        >
          {selected(o.id) && <span className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-apple text-[16px] text-white" aria-hidden>✓</span>}
          <span className="text-[40px] leading-none" aria-hidden>{o.icon}</span>
          <span className="text-[18px] font-bold leading-tight">{o.label}</span>
          {o.hint && <span className="text-[16px] leading-tight">{o.hint}</span>}
        </button>
      ))}
    </div>
  );
}

export function Chip({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warn" | "red" }) {
  const cls = { neutral: "bg-card border-line", success: "bg-greentint border-leaf/40", warn: "bg-amber border-amber", red: "bg-redtint border-apple/30" }[tone];
  return <span className={`inline-flex min-h-9 items-center gap-1 rounded-full border px-3 text-[16px] font-medium ${cls}`}>{children}</span>;
}

export function Note({ children, tone = "warn" }: { children: ReactNode; tone?: "warn" | "info" }) {
  return (
    <p className={`rounded-card px-4 py-3 text-[16px] ${tone === "warn" ? "bg-amber" : "border border-line bg-card"}`}>{children}</p>
  );
}

export function PlaceholderNote() {
  const { t } = useLang();
  return <Note>⚠️ {t("placeholder_note")}</Note>;
}

/** Offline is normal: never an error, just a calm note. */
export function OfflineBanner() {
  const { t } = useLang();
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  if (online) return null;
  return (
    <div role="status" className="mx-4 mt-3 flex items-center gap-3 rounded-card bg-amber px-4 py-3 text-[16px] font-medium">
      <span aria-hidden className="text-[24px]">📵</span>
      {t("offline")}
    </div>
  );
}

export function Stepper({ value, onChange, min = 1, max = 999, label }: { value: number; onChange: (v: number) => void; min?: number; max?: number; label: string }) {
  const { lang } = useLang();
  const dev = (n: number) => (lang === "ne" ? String(n).replace(/[0-9]/g, (d) => "०१२३४५६७८९"[+d]) : String(n));
  return (
    <div className="flex items-center gap-3" role="group" aria-label={label}>
      <button type="button" aria-label="−" onClick={() => onChange(Math.max(min, value - 1))} className="grid size-14 place-items-center rounded-card border-2 border-line bg-card text-[28px] font-bold">−</button>
      <span className="min-w-16 text-center text-[24px] font-bold" aria-live="polite">{dev(value)}</span>
      <button type="button" aria-label="+" onClick={() => onChange(Math.min(max, value + 1))} className="grid size-14 place-items-center rounded-card border-2 border-line bg-card text-[28px] font-bold">+</button>
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-card border border-dashed border-line px-4 py-6 text-center">{children}</p>;
}
