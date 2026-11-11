"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Button, Card, Chip, Page, SectionTitle, Speaker } from "@/components/ui";
import { useLang } from "@/components/useLang";
import { update, uid, useStore, type Question } from "@/lib/store";
import { answer, listen, speechRecognitionSupported } from "@/lib/services";
import { translate } from "@/lib/i18n";
import { ARTICLES } from "@/lib/data/articles";
import { bsDate } from "@/lib/format";

export default function AskPage() {
  return (
    <Suspense>
      <Ask />
    </Suspense>
  );
}

/** Phase 1 demo: with no expert console yet, a sample expert reply arrives after two minutes. */
const DEMO_EXPERT_DELAY = 2 * 60000;

function Ask() {
  const { t, tr, lang } = useLang();
  const params = useSearchParams();
  const questions = useStore((s) => s.questions);
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const asked = useRef<string | null>(null);

  const ask = (q: string) => {
    const body = q.trim();
    if (!body) return;
    const a = answer(body, lang);
    const record: Question = { id: uid(), text: body, createdAt: Date.now(), ai: a, expert: { status: "none" } };
    update((s) => ({ ...s, questions: [record, ...s.questions] }));
    setText("");
  };

  // A question spoken through the floating mic arrives as ?q=
  useEffect(() => {
    const q = params.get("q");
    if (q && asked.current !== q) {
      asked.current = q;
      ask(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // Demo expert replies (clearly labelled as samples).
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      update((s) => ({
        ...s,
        questions: s.questions.map((q) =>
          q.expert.status === "waiting" && q.expert.askedAt && now - q.expert.askedAt > DEMO_EXPERT_DELAY
            ? { ...q, expert: { ...q.expert, status: "answered", reply: translate(s.lang, "expert_demo_reply") } }
            : q,
        ),
      }));
    };
    tick();
    const h = setInterval(tick, 15000);
    return () => clearInterval(h);
  }, []);

  const needPerson = (id: string) =>
    update((s) => ({ ...s, questions: s.questions.map((q) => (q.id === id ? { ...q, expert: { status: "waiting", askedAt: Date.now() } } : q)) }));

  return (
    <Page
      title={t("ask_title")}
      back
      action={<Button onClick={() => ask(text)} disabled={!text.trim()} icon="➤">{t("ask_send")}</Button>}
    >
      <div className="flex gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("ask_ph")}
          aria-label={t("ask_ph")}
          rows={3}
          className="w-full flex-1 rounded-card border-2 border-line bg-card p-3 text-[19px]"
        />
        {speechRecognitionSupported() && (
          <button
            type="button"
            aria-label={t("mic_label")}
            onClick={() => {
              setListening(true);
              listen(lang, (txt) => setText(txt), () => setListening(false));
            }}
            className={`grid w-16 shrink-0 place-items-center rounded-card bg-apple text-[28px] text-white ${listening ? "listening" : ""}`}
          >
            🎙️
          </button>
        )}
      </div>

      {questions.length > 0 && <SectionTitle>{t("my_questions")}</SectionTitle>}
      {questions.map((q) => (
        <article key={q.id} className="space-y-2">
          <div className="ml-10 rounded-card rounded-tr-none bg-soil px-4 py-3 text-white">
            <p className="text-[19px]">{q.text}</p>
            <p className="text-right text-[14px] opacity-80">{bsDate(new Date(q.createdAt), lang)}</p>
          </div>
          <Card className="mr-6 space-y-2 rounded-tl-none">
            <div className="flex items-center justify-between gap-2">
              <Chip tone="red">🤖 {t("ai_label")}</Chip>
              <Speaker text={q.ai.known ? q.ai.text : t("ai_dont_know")} />
            </div>
            {q.ai.known ? (
              <>
                <p className="whitespace-pre-line">{q.ai.text}</p>
                <p className="text-[16px]">{t("ai_no_dose")}</p>
                <p className="text-[16px] font-medium">{t("ai_from")}</p>
                <ul className="space-y-1">
                  {q.ai.sources.map((slug) => {
                    const a = ARTICLES.find((x) => x.slug === slug);
                    return a ? (
                      <li key={slug}>
                        <Link href={`/learn/${slug}`} className="font-bold text-apple underline">{a.icon} {tr(a.title)}</Link>
                      </li>
                    ) : null;
                  })}
                </ul>
              </>
            ) : (
              <p>{t("ai_dont_know")}</p>
            )}
          </Card>
          {q.expert.status === "none" && (
            <Button tone="secondary" icon="👩‍🔬" onClick={() => needPerson(q.id)}>{t("need_person")}</Button>
          )}
          {q.expert.status === "waiting" && <Card tone="warn">⏳ {t("waiting_expert")}</Card>}
          {q.expert.status === "answered" && (
            <Card tone="success" className="mr-6">
              <p className="font-bold">👩‍🔬 {t("expert_reply")}</p>
              <p>{q.expert.reply}</p>
            </Card>
          )}
        </article>
      ))}
    </Page>
  );
}
