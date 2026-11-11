import type { Lang } from "./format";
import { ARTICLES } from "./data/articles";
import { SYMPTOMS } from "./data/symptoms";

// Service boundary. Each service has one interface; phase 1 ships the mock or
// browser implementation, and phase 2 swaps in server-side providers (Claude
// API for diagnosis and Q&A, a Nepali speech service, an SMS aggregator).
// No API keys ever live in this web app.

// ── Diagnosis (MOCK) ────────────────────────────────────────────────────
export type DiagnosisResult = { symptomId: string; confidence: number; needsExpert: boolean; mock: true };
export const CONFIDENCE_THRESHOLD = 0.7;

/**
 * Demo classifier: gives a stable, fake answer derived from the photo bytes.
 * It is NOT a real model; the result screen says so.
 */
export async function diagnose(photos: string[]): Promise<DiagnosisResult> {
  let h = 2166136261;
  for (const p of photos) for (let i = 0; i < p.length; i += 97) h = Math.imul(h ^ p.charCodeAt(i), 16777619) >>> 0;
  const symptom = SYMPTOMS[h % SYMPTOMS.length];
  const confidence = 0.45 + ((h >>> 8) % 50) / 100; // 0.45 – 0.94
  await new Promise((r) => setTimeout(r, 900));
  return { symptomId: symptom.id, confidence, needsExpert: confidence < CONFIDENCE_THRESHOLD, mock: true };
}

// ── Q&A (grounded retrieval over approved articles) ──────────────────────
export type QaAnswer = { known: boolean; text: string; sources: string[] };

const STOP = new Set(["के", "को", "का", "की", "मा", "ले", "लाई", "र", "छ", "हो", "गर्ने", "कसरी", "कहिले", "किन", "the", "a", "an", "of", "to", "in", "is", "how", "what", "when", "why", "do", "i", "my", "and", "for", "on"]);
const tokens = (s: string) =>
  s.toLowerCase().replace(/[?।,.!()\-–—:;"']/g, " ").split(/\s+/).filter((w) => w.length > 1 && !STOP.has(w));

/**
 * Answers ONLY from the article library. It returns "known: false" rather
 * than guess, and never produces a pesticide, dose or waiting period.
 * In phase 2 this moves server-side, with Claude constrained to the same
 * retrieved articles.
 */
export function answer(question: string, lang: Lang): QaAnswer {
  const q = new Set(tokens(question));
  if (q.size === 0) return { known: false, text: "", sources: [] };
  const scored = ARTICLES.map((a) => {
    const title = tokens(`${a.title.ne} ${a.title.en}`);
    const body = tokens([a.summary.ne, a.summary.en, ...a.steps.flatMap((s) => [s.ne, s.en])].join(" "));
    let score = 0;
    for (const w of q) {
      if (title.some((t) => t.startsWith(w) || w.startsWith(t))) score += 3;
      else if (body.some((t) => t === w)) score += 1;
    }
    return { a, score };
  }).sort((x, y) => y.score - x.score);
  const best = scored[0];
  if (!best || best.score < 3) return { known: false, text: "", sources: [] };
  const top = scored.filter((s) => s.score >= Math.max(3, best.score - 1)).slice(0, 2);
  const text = [best.a.summary[lang], ...best.a.steps.slice(0, 3).map((s) => `• ${s[lang]}`)].join("\n");
  return { known: true, text, sources: top.map((t) => t.a.slug) };
}

// ── SMS / OTP (MOCK) ────────────────────────────────────────────────────
export const DEMO_OTP = "123456";
export const sms = {
  async sendOtp(_phone: string) {
    await new Promise((r) => setTimeout(r, 400));
    return { sent: true, demoCode: DEMO_OTP };
  },
  async verifyOtp(_phone: string, code: string) {
    return code.replace(/[०-९]/g, (d) => String("०१२३४५६७८९".indexOf(d))) === DEMO_OTP;
  },
};

// ── Weather (REAL: Open-Meteo, free, no key) ─────────────────────────────
export type Alert = "hail" | "frost" | "rain";
export type DayForecast = { date: string; min: number; max: number; rainMm: number; code: number; alerts: Alert[] };

export function alertsFor(d: { min: number; rainMm: number; code: number }): Alert[] {
  const a: Alert[] = [];
  if (d.code === 96 || d.code === 99) a.push("hail");
  if (d.min <= 0) a.push("frost");
  if (d.rainMm >= 20 || d.code === 65 || d.code === 82) a.push("rain");
  return a;
}

export async function forecast(lat: number, lon: number): Promise<DayForecast[]> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia%2FKathmandu&forecast_days=3`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`weather ${res.status}`);
  const j = await res.json();
  const d = j.daily;
  return (d.time as string[]).map((date, i) => {
    const day = { date, min: d.temperature_2m_min[i], max: d.temperature_2m_max[i], rainMm: d.precipitation_sum[i] ?? 0, code: d.weather_code[i] };
    return { ...day, alerts: alertsFor(day) };
  });
}

export function weatherIcon(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌫️";
  if (code <= 67 || (code >= 80 && code <= 82)) return "🌧️";
  if (code <= 77 || code === 85 || code === 86) return "❄️";
  return "⛈️";
}

// ── Speech (BROWSER) ────────────────────────────────────────────────────
// Text-to-speech uses the phone's voices. Recorded narration by a native
// speaker is planned for articles (audio manifest in /content).

export function pickVoice(lang: Lang): { voice: SpeechSynthesisVoice | null; fallback: boolean } {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return { voice: null, fallback: false };
  const voices = window.speechSynthesis.getVoices();
  if (lang === "en") return { voice: voices.find((v) => v.lang.startsWith("en")) ?? null, fallback: false };
  const ne = voices.find((v) => v.lang.toLowerCase().startsWith("ne"));
  if (ne) return { voice: ne, fallback: false };
  const hi = voices.find((v) => v.lang.toLowerCase().startsWith("hi"));
  return { voice: hi ?? null, fallback: true };
}

export function speak(text: string, lang: Lang, onEnd: () => void): { fallback: boolean } | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const { voice, fallback } = pickVoice(lang);
  if (voice) u.voice = voice;
  u.lang = voice?.lang ?? (lang === "ne" ? "ne-NP" : "en-GB");
  u.rate = 0.9;
  u.onend = onEnd;
  u.onerror = onEnd;
  window.speechSynthesis.speak(u);
  return { fallback };
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}

type Recognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

export function speechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as unknown as Record<string, unknown>;
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}

/** Speech-to-text through the browser (Chrome on Android supports ne-NP). */
export function listen(lang: Lang, onText: (t: string) => void, onEnd: () => void): (() => void) | null {
  const w = window as unknown as Record<string, new () => Recognition>;
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const r = new Ctor();
  r.lang = lang === "ne" ? "ne-NP" : "en-IN";
  r.interimResults = false;
  r.maxAlternatives = 1;
  r.onresult = (e) => onText(e.results[0][0].transcript);
  r.onerror = onEnd;
  r.onend = onEnd;
  r.start();
  return () => r.stop();
}

// ── Images ──────────────────────────────────────────────────────────────

/** Compress a photo on the device to under maxBytes (JPEG), as the brief requires (300 KB). */
export async function compressImage(file: File, maxBytes = 300 * 1024, maxSide = 1280): Promise<string> {
  const bmp = await createImageBitmap(file);
  let side = maxSide;
  for (let attempt = 0; attempt < 6; attempt++) {
    const scale = Math.min(1, side / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    for (const q of [0.8, 0.65, 0.5]) {
      const url = canvas.toDataURL("image/jpeg", q);
      if (dataUrlBytes(url) <= maxBytes) return url;
    }
    side = Math.round(side * 0.75);
  }
  throw new Error("Could not compress image");
}

export function dataUrlBytes(url: string): number {
  const b64 = url.slice(url.indexOf(",") + 1);
  return Math.floor((b64.length * 3) / 4) - (b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0);
}

/** Small thumbnail kept in on-device storage. */
export async function thumbnail(dataUrl: string, side = 240): Promise<string> {
  const img = new Image();
  img.src = dataUrl;
  await img.decode();
  const scale = Math.min(1, side / Math.max(img.width, img.height));
  const c = document.createElement("canvas");
  c.width = Math.round(img.width * scale);
  c.height = Math.round(img.height * scale);
  c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.6);
}
