export type Category = {
  label: string; // display label with emoji
  value: string; // stored value (no emoji)
  emoji: string;
};

export const CATEGORIES: Category[] = [
  { label: "Cinematic", value: "Cinematic", emoji: "🎬" },
  { label: "Golden Hour", value: "Golden Hour", emoji: "🌅" },
  { label: "A24 Poster", value: "A24 Poster", emoji: "🎞️" },
  { label: "Editorial", value: "Editorial", emoji: "📰" },
  { label: "Vintage", value: "Vintage", emoji: "🕰️" },
  { label: "Street", value: "Street", emoji: "🛣️" },
  { label: "Cartoon/Chibi", value: "Cartoon/Chibi", emoji: "🎨" },
];

export const FILTER_PILLS: { label: string; value: string }[] = [
  { label: "All", value: "All" },
  { label: "🎬 Cinematic", value: "Cinematic" },
  { label: "🌅 Golden Hour", value: "Golden Hour" },
  { label: "🎞️ A24 Poster", value: "A24 Poster" },
  { label: "📰 Editorial", value: "Editorial" },
  { label: "🕰️ Vintage", value: "Vintage" },
  { label: "🛣️ Street", value: "Street" },
  { label: "🎨 Cartoon/Chibi", value: "Cartoon/Chibi" },
];

export function categoryEmoji(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.emoji ?? "✨";
}

export const CATEGORY_COLORS: Record<string, string> = {
  Cinematic: "text-amber-800 bg-amber-50",
  "Golden Hour": "text-orange-800 bg-orange-50",
  "A24 Poster": "text-emerald-800 bg-emerald-50",
  Editorial: "text-sky-800 bg-sky-50",
  Vintage: "text-stone-800 bg-stone-100",
  Street: "text-slate-800 bg-slate-100",
  "Cartoon/Chibi": "text-fuchsia-700 bg-fuchsia-50",
};

export function categoryClass(value: string): string {
  return CATEGORY_COLORS[value] ?? "text-neutral-700 bg-neutral-100";
}
