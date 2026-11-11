// Simple labelled line icons (24px grid, 2px stroke).
const PATHS: Record<string, string> = {
  home: "M3 11.5 12 4l9 7.5M5.5 9.5V20h13V9.5M10 20v-5h4v5",
  learn: "M4 5.5C6.5 4 9.5 4 12 6c2.5-2 5.5-2 8-.5V19c-2.5-1.5-5.5-1.5-8 .5-2.5-2-5.5-2-8-.5zM12 6v13.5",
  doctor: "M12 21c-4-3-7-6.5-7-10.5C5 7 7.5 5 10 5c1 0 1.6.3 2 .8.4-.5 1-.8 2-.8 2.5 0 5 2 5 5.5 0 4-3 7.5-7 10.5zM12 9v6M9 12h6",
  shop: "M4 9h16l-1.5 10.5h-13zM8.5 9 12 4l3.5 5M9 13v3M12 13v3M15 13v3",
  sell: "M12 3v18M16.5 7.5c0-1.7-2-3-4.5-3s-4.5 1.3-4.5 3S9.5 10 12 10.5s4.5 1.3 4.5 3.5-2 3-4.5 3-4.5-1.3-4.5-3",
  mic: "M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zM6 11a6 6 0 0 0 12 0M12 17v4M9 21h6",
  speaker: "M4 9.5h3.5L12 5.5v13l-4.5-4H4zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11",
  stop: "M7 7h10v10H7z",
  back: "M15 5 8 12l7 7",
  camera: "M4 8h3.5L9 5.5h6L16.5 8H20v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14.2 3h-4.4l-.4 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2 1.2l.4 2.6h4.4l.4-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z",
  chevron: "M9 5l7 7-7 7",
};

export function Icon({ name, className = "size-6" }: { name: keyof typeof PATHS | string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={PATHS[name]} />
    </svg>
  );
}
