import { test } from "node:test";
import assert from "node:assert/strict";
import { bsDate, digits, num, toBs, qty } from "../src/lib/format";
import { ARTICLES } from "../src/lib/data/articles";
import { SYMPTOMS } from "../src/lib/data/symptoms";
import { ALL_PRODUCTS, LISTED_PRODUCTS, productById } from "../src/lib/data/catalog";
import { BUYERS, CALENDAR, COLLECTION_POINTS, PALIKAS, SUPPLIERS } from "../src/lib/data/world";
import { alertsFor, answer, CONFIDENCE_THRESHOLD, diagnose, sms, DEMO_OTP } from "../src/lib/services";
import { lotStatus, orderStatus, sampleOffers, seedDemo, type Lot } from "../src/lib/store";
import { DICTIONARY } from "../src/lib/i18n";

// ── Nepali formatting ───────────────────────────────────────────────────
test("Devanagari numerals and South Asian grouping", () => {
  assert.equal(digits(2083, "ne"), "२०८३");
  assert.equal(digits(2083, "en"), "2083");
  assert.equal(num(1234567, "en"), "12,34,567");
  assert.equal(num(1234567, "ne"), "१२,३४,५६७");
  assert.equal(qty(20, "crate", "ne"), "२० क्रेट");
});

test("Bikram Sambat conversion matches known dates", () => {
  assert.deepEqual(toBs(new Date(2025, 3, 14)), { year: 2082, month: 1, day: 1 }); // नयाँ वर्ष २०८२
  assert.deepEqual(toBs(new Date(2024, 3, 13)), { year: 2081, month: 1, day: 1 }); // नयाँ वर्ष २०८१
  assert.deepEqual(toBs(new Date(2025, 3, 13)), { year: 2081, month: 12, day: 31 });
  assert.equal(bsDate(new Date(2025, 3, 14), "ne"), "१ बैशाख २०८२");
});

// ── Seed data the brief asks for ────────────────────────────────────────
test("seed volumes", () => {
  assert.equal(ARTICLES.length, 30);
  assert.equal(SYMPTOMS.length, 25);
  assert.equal(LISTED_PRODUCTS.length, 40);
  assert.equal(new Set(LISTED_PRODUCTS.map((p) => p.category)).size, 5);
  assert.equal(CALENDAR.length, 12);
  assert.deepEqual(CALENDAR.map((c) => c.month), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  assert.equal(PALIKAS.length, 3);
  assert.equal(COLLECTION_POINTS.length, 6);
  assert.equal(SUPPLIERS.length, 6);
  assert.equal(BUYERS.length, 8);
});

test("every article follows the template", () => {
  const slugs = new Set<string>();
  for (const a of ARTICLES) {
    assert.ok(!slugs.has(a.slug), `duplicate slug ${a.slug}`);
    slugs.add(a.slug);
    assert.ok(a.steps.length >= 3 && a.steps.length <= 7, `${a.slug} has ${a.steps.length} steps`);
    assert.ok(a.months.length > 0 && a.months.every((m) => m >= 1 && m <= 12));
    assert.equal(a.placeholder, true);
    for (const act of a.actions) if (act.kind === "order") assert.ok(productById(act.productId), `${a.slug} links to missing product ${act.productId}`);
  }
  for (const c of CALENDAR) if (c.articleSlug) assert.ok(slugs.has(c.articleSlug), `calendar links to missing ${c.articleSlug}`);
});

test("all agronomic seed content is marked PLACEHOLDER", () => {
  assert.ok([...ARTICLES, ...SYMPTOMS, ...ALL_PRODUCTS].every((x) => x.placeholder === true));
});

// ── Safety rules ────────────────────────────────────────────────────────
test("banned products cannot be listed", () => {
  assert.ok(ALL_PRODUCTS.some((p) => p.regulatory === "banned"), "fixture should include a banned example");
  assert.ok(LISTED_PRODUCTS.every((p) => p.regulatory !== "banned"));
  assert.equal(productById("prot-banned-example"), undefined);
});

test("chemical advice always carries dose, pre-harvest interval and gear fields, and no unapproved dose", () => {
  for (const p of LISTED_PRODUCTS.filter((x) => x.chemical)) {
    assert.ok(p.chemical!.gear.ne && p.chemical!.gear.en, `${p.id} lacks gear`);
    // Seed data is unapproved: dose and PHI must stay empty so the app shows "pending expert review".
    assert.equal(p.chemical!.dose, null, `${p.id} has an unapproved dose`);
    assert.equal(p.chemical!.preHarvestDays, null, `${p.id} has an unapproved PHI`);
  }
});

test("symptom chemical options come only from the products table", () => {
  for (const s of SYMPTOMS) for (const id of s.chemicalProductIds) assert.ok(productById(id), `${s.id} → unknown product ${id}`);
});

test("no seed text contains a numeric dose", () => {
  const dosePattern = /\d+(\.\d+)?\s*(ml|g|gm|kg|l|लिटर|मिलि|ग्राम)\s*(\/|per|प्रति)/i;
  const texts = [...ARTICLES.flatMap((a) => [a.summary, ...a.steps]), ...SYMPTOMS.flatMap((s) => [s.cultural, s.organic])].flatMap((l) => [l.ne, l.en]);
  for (const t of texts) assert.ok(!dosePattern.test(t), `dose-like text: ${t}`);
});

test("Q&A answers only from articles and admits when it does not know", () => {
  const a = answer("जाडोमा काटछाँट कहिले गर्ने?", "ne");
  assert.equal(a.known, true);
  assert.ok(a.sources.includes("winter-pruning"));
  assert.ok(a.sources.every((s) => ARTICLES.some((x) => x.slug === s)));
  const b = answer("what is the price of gold in Dubai", "en");
  assert.equal(b.known, false);
  assert.equal(b.sources.length, 0);
});

test("low-confidence diagnosis goes to an expert", async () => {
  for (const seed of ["a", "bb", "photo-1", "photo-2", "xyz", "leaf"]) {
    const r = await diagnose([`data:image/jpeg;base64,${seed.repeat(200)}`]);
    assert.ok(SYMPTOMS.some((s) => s.id === r.symptomId));
    assert.equal(r.needsExpert, r.confidence < CONFIDENCE_THRESHOLD);
  }
});

test("weather alerts", () => {
  assert.deepEqual(alertsFor({ min: 5, rainMm: 0, code: 96 }), ["hail"]);
  assert.deepEqual(alertsFor({ min: -2, rainMm: 0, code: 1 }), ["frost"]);
  assert.deepEqual(alertsFor({ min: 4, rainMm: 25, code: 63 }), ["rain"]);
  assert.deepEqual(alertsFor({ min: 4, rainMm: 2, code: 2 }), []);
});

test("mock OTP accepts the demo code in either numeral system", async () => {
  assert.equal(await sms.verifyOtp("9800000000", DEMO_OTP), true);
  assert.equal(await sms.verifyOtp("9800000000", "१२३४५६"), true);
  assert.equal(await sms.verifyOtp("9800000000", "000000"), false);
});

// ── Demo data and status logic ─────────────────────────────────────────
test("demo seed has orders and lots in every status", () => {
  const now = Date.now();
  const d = seedDemo(now);
  assert.deepEqual(new Set(d.orders.map((o) => orderStatus(o, now))), new Set(["ordered", "confirmed", "on_the_way", "at_cp", "received"]));
  assert.deepEqual(new Set(d.lots.map(lotStatus)), new Set(["open", "sold", "picked", "paid"]));
});

test("sample offers are deterministic and hide nothing before acceptance", () => {
  const lot: Lot = { id: "lot-1", varietyId: "fuji", grade: "A", quantity: 10, unit: "crate", readyAt: 0, thumbs: [], collectionPointId: "cp-khalanga", mode: "alone", createdAt: 0 };
  assert.deepEqual(sampleOffers(lot), sampleOffers(lot));
  assert.equal(sampleOffers(lot).length, 3);
});

test("every interface string exists in Nepali and English", () => {
  for (const [k, [ne, en]] of Object.entries(DICTIONARY)) {
    assert.ok(ne.length > 0 && en.length > 0, k);
  }
});
