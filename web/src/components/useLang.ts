"use client";

import { useCallback } from "react";
import { useStore, update } from "@/lib/store";
import { translate, type Key } from "@/lib/i18n";
import type { Lang } from "@/lib/format";
import type { L } from "@/lib/types";

export function useLang() {
  const lang = useStore((s) => s.lang);
  const t = useCallback((key: Key, vars?: Record<string, string | number>) => translate(lang, key, vars), [lang]);
  const tr = useCallback((l: L) => l[lang], [lang]);
  const setLang = useCallback((l: Lang) => {
    update((s) => ({ ...s, lang: l }));
    document.documentElement.lang = l;
  }, []);
  return { lang, t, tr, setLang };
}
