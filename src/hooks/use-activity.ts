import { useEffect, useState, useCallback } from "react";

export type ActivityType = "document" | "expert" | "lesson" | "idea" | "quicklink";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  titleEn: string;
  titleAm: string;
  at: number;
}

const KEY = "kms.activity.v1";
const MAX = 12;

function read(): ActivityItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ActivityItem[]) : [];
  } catch {
    return [];
  }
}

export function useActivity() {
  const [items, setItems] = useState<ActivityItem[]>(() => read());

  useEffect(() => {
    const handler = () => setItems(read());
    window.addEventListener("kms-activity-update", handler);
    return () => window.removeEventListener("kms-activity-update", handler);
  }, []);

  const track = useCallback((item: Omit<ActivityItem, "at">) => {
    const current = read().filter((i) => !(i.id === item.id && i.type === item.type));
    const next = [{ ...item, at: Date.now() }, ...current].slice(0, MAX);
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("kms-activity-update"));
    setItems(next);
  }, []);

  const clear = useCallback(() => {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new CustomEvent("kms-activity-update"));
    setItems([]);
  }, []);

  return { activity: items, track, clear };
}

export function trackActivity(item: Omit<ActivityItem, "at">) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(KEY);
    const current = (raw ? (JSON.parse(raw) as ActivityItem[]) : []).filter(
      (i) => !(i.id === item.id && i.type === item.type)
    );
    const next = [{ ...item, at: Date.now() }, ...current].slice(0, MAX);
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("kms-activity-update"));
  } catch {
    /* ignore */
  }
}
