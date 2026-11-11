"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useHydrated, useStore } from "@/lib/store";
import { listen, speechRecognitionSupported } from "@/lib/services";
import { useLang } from "./useLang";
import { Icon } from "./icons";
import type { Key } from "@/lib/i18n";

const TABS: { href: string; icon: string; key: Key }[] = [
  { href: "/", icon: "home", key: "tab_home" },
  { href: "/learn", icon: "learn", key: "tab_learn" },
  { href: "/doctor", icon: "doctor", key: "tab_doctor" },
  { href: "/shop", icon: "shop", key: "tab_shop" },
  { href: "/sell", icon: "sell", key: "tab_sell" },
];

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const hydrated = useHydrated();
  const hasProfile = useStore((s) => s.profile !== null);
  const lang = useStore((s) => s.lang);
  const onboarding = path.startsWith("/welcome");

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (hydrated && !hasProfile && !onboarding) router.replace("/welcome");
  }, [hydrated, hasProfile, onboarding, router]);

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  // Avoid flashing the app before the onboarding redirect.
  if (!hydrated) return <div className="min-h-dvh" />;
  if (!hasProfile && !onboarding) return <div className="min-h-dvh" />;

  return (
    <div className="min-h-dvh" style={{ paddingBottom: onboarding ? 0 : "var(--tabs-h)" }}>
      {children}
      {!onboarding && (
        <>
          <MicButton />
          <BottomTabs path={path} />
        </>
      )}
    </div>
  );
}

function BottomTabs({ path }: { path: string }) {
  const { t } = useLang();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card" style={{ height: "var(--tabs-h)" }} aria-label="Main">
      <ul className="mx-auto grid h-full max-w-xl grid-cols-5">
        {TABS.map((tab) => {
          const active = tab.href === "/" ? path === "/" : path.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex h-full flex-col items-center justify-center gap-0.5 text-[15px] font-medium leading-tight ${active ? "text-apple" : "text-soil"}`}
              >
                <span className={`grid h-8 w-14 place-items-center rounded-full ${active ? "bg-redtint" : ""}`}>
                  <Icon name={tab.icon} className="size-6" />
                </span>
                {t(tab.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Floating microphone on every screen: speak a question, it opens in Ask. */
function MicButton() {
  const { t, lang } = useLang();
  const router = useRouter();
  const [state, setState] = useState<"idle" | "listening" | "unsupported">("idle");
  const stopRef = useRef<(() => void) | null>(null);

  const start = () => {
    if (state === "listening") {
      stopRef.current?.();
      return;
    }
    if (!speechRecognitionSupported()) {
      setState("unsupported");
      setTimeout(() => {
        setState("idle");
        router.push("/doctor/ask");
      }, 1800);
      return;
    }
    setState("listening");
    stopRef.current = listen(
      lang,
      (text) => router.push(`/doctor/ask?q=${encodeURIComponent(text)}`),
      () => setState("idle"),
    );
  };

  return (
    <>
      {state !== "idle" && (
        <div role="status" className="fixed inset-x-4 z-50 mx-auto max-w-md rounded-card bg-soil px-4 py-3 text-center text-[18px] text-white" style={{ bottom: "calc(var(--tabs-h) + var(--action-h) + 92px)" }}>
          {state === "listening" ? t("mic_listening") : t("mic_unsupported")}
        </div>
      )}
      <button
        type="button"
        onClick={start}
        aria-label={t("mic_label")}
        className={`fixed right-4 z-50 grid size-16 place-items-center rounded-full bg-apple text-white shadow-lg active:bg-apple-dark ${state === "listening" ? "listening" : ""}`}
        style={{ bottom: "calc(var(--tabs-h) + var(--action-h) + 14px)" }}
      >
        <Icon name="mic" className="size-8" />
      </button>
    </>
  );
}
