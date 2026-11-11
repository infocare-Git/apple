import bs from "./bs-years";

export type Lang = "ne" | "en";

const DEV = "०१२३४५६७८९";

/** Western digits → Devanagari digits (only when the language is Nepali). */
export function digits(s: string | number, lang: Lang): string {
  const str = String(s);
  return lang === "ne" ? str.replace(/[0-9]/g, (d) => DEV[Number(d)]) : str;
}

/** Number with South Asian grouping (1,00,000) and the right digits. */
export function num(n: number, lang: Lang, decimals = 0): string {
  const fixed = n.toFixed(decimals);
  const [int, frac] = fixed.split(".");
  const neg = int.startsWith("-");
  const abs = neg ? int.slice(1) : int;
  let grouped = abs;
  if (abs.length > 3) {
    const last3 = abs.slice(-3);
    const rest = abs.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    grouped = `${rest},${last3}`;
  }
  return digits(`${neg ? "-" : ""}${grouped}${frac ? "." + frac : ""}`, lang);
}

export function npr(n: number, lang: Lang): string {
  return lang === "ne" ? `रु ${num(n, lang)}` : `Rs ${num(n, lang)}`;
}

export const BS_MONTHS: Record<Lang, string[]> = {
  ne: ["बैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कात्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"],
  en: ["Baisakh", "Jestha", "Asar", "Shrawan", "Bhadra", "Asoj", "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"],
};

export type BsDate = { year: number; month: number; day: number };

const YEARS = bs.years as unknown as Record<string, readonly number[]>;
const [AY, AM, AD] = bs.anchor.split("-").map(Number);
const ANCHOR = Date.UTC(AY, AM - 1, AD);

/** Gregorian date (local calendar day) → Bikram Sambat. Supports BS 2075–2099. */
export function toBs(date: Date): BsDate {
  const utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  let diff = Math.round((utc - ANCHOR) / 864e5);
  if (diff < 0) throw new RangeError("Date before BS 2075");
  let year = 2075;
  for (;;) {
    const months = YEARS[String(year)];
    if (!months) throw new RangeError("Date after supported BS range");
    const total = months.reduce((a, b) => a + b, 0);
    if (diff < total) {
      let month = 0;
      while (diff >= months[month]) diff -= months[month++];
      return { year, month: month + 1, day: diff + 1 };
    }
    diff -= total;
    year++;
  }
}

/** "२५ कात्तिक २०८३" / "25 Kartik 2083". Bikram Sambat first, as the brief asks. */
export function bsDate(date: Date, lang: Lang): string {
  const d = toBs(date);
  return `${digits(d.day, lang)} ${BS_MONTHS[lang][d.month - 1]} ${digits(d.year, lang)}`;
}

/** Short Gregorian date shown after the BS date where helpful. */
export function adDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(lang === "ne" ? "ne-NP" : "en-GB", { day: "numeric", month: "short" });
}

export function weekday(date: Date, lang: Lang): string {
  const ne = ["आइत", "सोम", "मंगल", "बुध", "बिही", "शुक्र", "शनि"];
  const en = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return (lang === "ne" ? ne : en)[date.getDay()];
}

export type Unit = "kg" | "crate" | "ropani" | "hectare";
const UNIT: Record<Unit, Record<Lang, string>> = {
  kg: { ne: "केजी", en: "kg" },
  crate: { ne: "क्रेट", en: "crates" },
  ropani: { ne: "रोपनी", en: "ropani" },
  hectare: { ne: "हेक्टर", en: "ha" },
};
export function qty(n: number, unit: Unit, lang: Lang, decimals = 0): string {
  return `${num(n, lang, decimals)} ${UNIT[unit][lang]}`;
}
/** One standard crate of apples is taken as 20 kg (PLACEHOLDER, to confirm locally). */
export const KG_PER_CRATE = 20;
/** 1 ropani = 508.72 m²; 1 ha = 10,000 m². */
export const ROPANI_PER_HECTARE = 10000 / 508.72;
