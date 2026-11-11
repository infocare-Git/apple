import { test } from "node:test";
import assert from "node:assert/strict";

// The brief requires 7:1 contrast. These are every text/background pair the
// design system uses (see src/app/globals.css).
const C = {
  apple: "#a51f1f",
  leafdeep: "#1b5e20",
  cream: "#fff8f0",
  soil: "#4e342e",
  amber: "#ffe082",
  card: "#ffffff",
  redtint: "#fdecea",
  greentint: "#eef6ee",
  white: "#ffffff",
};

function lum(hex: string) {
  const ch = (i: number) => {
    const v = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(0) + 0.7152 * ch(1) + 0.0722 * ch(2);
}
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const PAIRS: [fg: keyof typeof C, bg: keyof typeof C][] = [
  ["soil", "cream"], ["soil", "card"], ["soil", "amber"], ["soil", "redtint"], ["soil", "greentint"],
  ["white", "apple"], ["white", "leafdeep"], ["white", "soil"],
  ["apple", "cream"], ["apple", "card"], ["leafdeep", "card"], ["leafdeep", "greentint"],
];

for (const [fg, bg] of PAIRS) {
  test(`${fg} on ${bg} is at least 7:1`, () => {
    const r = ratio(C[fg], C[bg]);
    assert.ok(r >= 7, `${fg}/${bg} = ${r.toFixed(2)}`);
  });
}
