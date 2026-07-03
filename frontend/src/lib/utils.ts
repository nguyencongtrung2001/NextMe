import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugifyText(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/([^a-z0-9\s-]|_)+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getLocalTodayString(): string {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
}

const FLOWER_THEME_MAP: Record<string, { bg: string; border: string; text: string }> = {
  sunflower: { bg: "var(--amber-bg)", border: "var(--amber-border)", text: "var(--amber)" },
  lavender: { bg: "var(--sage-bg)", border: "var(--sage-border)", text: "var(--sage)" },
  tulip: { bg: "var(--rose-bg)", border: "var(--rose-border)", text: "var(--rose)" },
  daisy: { bg: "var(--yellow-bg)", border: "var(--yellow-border)", text: "var(--yellow)" },
  rose: { bg: "var(--red-bg)", border: "var(--red-border)", text: "var(--red)" },
  sprout: { bg: "var(--emerald-bg)", border: "var(--emerald-border)", text: "var(--emerald)" },
  palm: { bg: "var(--teal-bg)", border: "var(--teal-border)", text: "var(--teal)" },
  cherry_blossom: { bg: "var(--pink-bg)", border: "var(--pink-border)", text: "var(--pink)" },
  pine: { bg: "var(--green-bg)", border: "var(--green-border)", text: "var(--green)" },
  cactus: { bg: "var(--lime-bg)", border: "var(--lime-border)", text: "var(--lime)" },
};

export function getFlowerTheme(type: string) {
  const defaultTheme = { bg: "var(--primary-bg)", border: "var(--primary-border)", text: "var(--primary)" };
  return FLOWER_THEME_MAP[type] || defaultTheme;
}
