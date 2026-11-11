"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, Chip, Page, SectionTitle, Speaker } from "@/components/ui";
import { useLang } from "@/components/useLang";
import { Icon } from "@/components/icons";
import { getState, lotStatus, orderStatus, update, useStore } from "@/lib/store";
import { bsDate, num, toBs, weekday, digits } from "@/lib/format";
import { CALENDAR, DISTRICT_COORDS, REFERENCE_PRICE, varietyById } from "@/lib/data/world";
import { forecast, weatherIcon, type DayForecast } from "@/lib/services";

export default function Home() {
  const { t, tr, lang } = useLang();
  const profile = useStore((s) => s.profile);
  const orders = useStore((s) => s.orders);
  const questions = useStore((s) => s.questions);
  const lots = useStore((s) => s.lots);
  const offers = useStore((s) => s.offers);
  const today = new Date();
  const task = CALENDAR.find((c) => c.month === toBs(today).month)!;

  const openOrders = orders.filter((o) => orderStatus(o) !== "received").length;
  const waitingQs = questions.filter((q) => q.expert.status === "waiting").length;
  const newOffers = offers.filter((o) => !o.seen && lots.some((l) => l.id === o.lotId && lotStatus(l) === "open")).length;
  const myVarieties = (profile?.varieties.length ? profile.varieties : ["red-delicious", "fuji"]).slice(0, 3);

  return (
    <Page title={t("hello", { name: profile?.name.split(" ")[0] ?? "" })} speakText={`${tr(task.title)}. ${tr(task.detail)}`}>
      <div className="flex items-center justify-between">
        <p className="text-[18px]">
          {weekday(today, lang)}, {bsDate(today, lang)}
        </p>
        <Link href="/settings" aria-label={t("settings")} className="grid size-14 place-items-center rounded-card active:bg-redtint">
          <Icon name="settings" className="size-7" />
        </Link>
      </div>

      {/* This week's task: know what to do without tapping. */}
      <Card tone="red" className="space-y-2">
        <p className="text-[16px] font-bold uppercase tracking-wide text-apple">{t("this_week")}</p>
        <div className="flex items-start gap-3">
          <span className="text-[44px] leading-none" aria-hidden>{task.icon}</span>
          <div className="flex-1">
            <h2 className="text-[22px] font-bold leading-snug">{tr(task.title)}</h2>
            <p className="mt-1">{tr(task.detail)}</p>
          </div>
        </div>
        {task.articleSlug && (
          <Link href={`/learn/${task.articleSlug}`} className="flex min-h-14 items-center justify-between rounded-card bg-card px-4 font-bold text-apple">
            {t("see_how")} <Icon name="chevron" />
          </Link>
        )}
      </Card>

      <Weather />

      <section aria-labelledby="prices">
        <SectionTitle>
          <span id="prices">{t("prices")}</span>
        </SectionTitle>
        <div className="mt-2 flex snap-x gap-3 overflow-x-auto pb-1">
          {myVarieties.map((id) => {
            const v = varietyById(id)!;
            const p = REFERENCE_PRICE[id];
            return (
              <div key={id} className="min-w-44 snap-start rounded-card border border-line bg-card p-3">
                <p className="flex items-center gap-2 font-bold">
                  <span className="inline-block size-4 rounded-full" style={{ background: v.color }} aria-hidden />
                  {tr(v.name)}
                </p>
                <p className="mt-1 text-[16px]">{t("price_local")}</p>
                <p className="text-[22px] font-bold">रु {num(p.local, lang)}</p>
                <p className="text-[16px]">{t("price_ktm")}: रु {num(p.kathmandu, lang)}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-1 text-[16px]">⚠️ {t("prices_sample")}</p>
      </section>

      <div className="grid grid-cols-2 gap-3">
        {[
          { href: "/doctor/check", icon: "📷", key: "sc_diagnose" as const },
          { href: "/doctor/ask", icon: "🙋", key: "sc_ask" as const },
          { href: "/shop", icon: "🛒", key: "sc_order" as const },
          { href: "/sell/new", icon: "🍎", key: "sc_sell" as const },
        ].map((s) => (
          <Link key={s.href} href={s.href} className="flex min-h-24 flex-col items-center justify-center gap-1 rounded-card border-2 border-line bg-card text-[20px] font-bold active:border-apple active:bg-redtint">
            <span className="text-[36px] leading-none" aria-hidden>{s.icon}</span>
            {t(s.key)}
          </Link>
        ))}
      </div>

      <section>
        <SectionTitle>{t("my_activity")}</SectionTitle>
        <div className="mt-2 flex flex-wrap gap-2">
          {openOrders > 0 && <Link href="/shop/orders"><Chip tone="warn">🚚 {t("chip_orders", { n: digits(openOrders, lang) })}</Chip></Link>}
          {waitingQs > 0 && <Link href="/doctor/ask"><Chip>💬 {t("chip_questions", { n: digits(waitingQs, lang) })}</Chip></Link>}
          {newOffers > 0 && <Link href="/sell"><Chip tone="success">💰 {t("chip_offers", { n: digits(newOffers, lang) })}</Chip></Link>}
          {openOrders + waitingQs + newOffers === 0 && <p>{t("nothing_open")}</p>}
        </div>
      </section>
    </Page>
  );
}

function Weather() {
  const { t, lang } = useLang();
  const [days, setDays] = useState<DayForecast[] | null>(null);
  const [cached, setCached] = useState(false);

  useEffect(() => {
    let alive = true;
    forecast(DISTRICT_COORDS.lat, DISTRICT_COORDS.lon)
      .then((d) => {
        if (!alive) return;
        setDays(d);
        setCached(false);
        update((s) => ({ ...s, weatherCache: { at: Date.now(), data: d } }));
      })
      .catch(() => {
        const c = getState().weatherCache;
        if (alive && c) {
          setDays(c.data as DayForecast[]);
          setCached(true);
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  const label = (i: number, date: string) => (i === 0 ? t("today") : i === 1 ? t("tomorrow") : weekday(new Date(date), lang));
  const alerts = days?.flatMap((d) => d.alerts) ?? [];

  return (
    <section aria-labelledby="weather">
      <SectionTitle right={days && <Speaker text={days.map((d, i) => `${label(i, d.date)}: ${num(Math.round(d.max), lang)} डिग्री`).join(". ")} />}>
        <span id="weather">{t("weather")}</span>
      </SectionTitle>
      {alerts.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2" role="alert">
          {alerts.includes("hail") && <Chip tone="warn">🌨️ {t("alert_hail")}</Chip>}
          {alerts.includes("frost") && <Chip tone="warn">❄️ {t("alert_frost")}</Chip>}
          {alerts.includes("rain") && <Chip tone="warn">🌧️ {t("alert_rain")}</Chip>}
        </div>
      )}
      {days ? (
        <div className="mt-2 grid grid-cols-3 gap-3">
          {days.map((d, i) => (
            <div key={d.date} className={`rounded-card border p-3 text-center ${d.alerts.length ? "border-amber bg-amber" : "border-line bg-card"}`}>
              <p className="text-[16px] font-bold">{label(i, d.date)}</p>
              <p className="text-[36px] leading-tight" aria-hidden>{weatherIcon(d.code)}</p>
              <p className="text-[18px] font-bold">{num(Math.round(d.max), lang)}° / {num(Math.round(d.min), lang)}°</p>
              {d.rainMm > 0 && <p className="text-[16px]">💧 {t("rain_mm", { n: num(d.rainMm, lang, d.rainMm < 10 ? 1 : 0) })}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 rounded-card border border-line bg-card p-4">{t("weather_none")}</p>
      )}
      {cached && <p className="mt-1 text-[16px]">{t("weather_cached")}</p>}
    </section>
  );
}
