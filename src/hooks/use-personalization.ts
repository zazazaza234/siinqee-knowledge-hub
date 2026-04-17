import { useEffect, useState, useCallback } from "react";

export type BookmarkType = "document" | "expert" | "lesson" | "idea" | "quicklink";

export interface BookmarkItem {
  id: string;
  type: BookmarkType;
  titleEn: string;
  titleAm: string;
  subtitleEn?: string;
  subtitleAm?: string;
  addedAt: number;
}

const BOOKMARK_KEY = "kms.bookmarks.v1";
const LIKE_KEY = "kms.likes.v1";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("kms-personalization-update", { detail: { key } }));
  } catch {
    /* ignore */
  }
}

export function useBookmarks() {
  const [items, setItems] = useState<BookmarkItem[]>(() => read<BookmarkItem[]>(BOOKMARK_KEY, []));

  useEffect(() => {
    const handler = () => setItems(read<BookmarkItem[]>(BOOKMARK_KEY, []));
    window.addEventListener("kms-personalization-update", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("kms-personalization-update", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const isBookmarked = useCallback(
    (id: string, type: BookmarkType) => items.some((b) => b.id === id && b.type === type),
    [items]
  );

  const toggle = useCallback(
    (item: Omit<BookmarkItem, "addedAt">): boolean => {
      const current = read<BookmarkItem[]>(BOOKMARK_KEY, []);
      const exists = current.some((b) => b.id === item.id && b.type === item.type);
      const next = exists
        ? current.filter((b) => !(b.id === item.id && b.type === item.type))
        : [{ ...item, addedAt: Date.now() }, ...current];
      write(BOOKMARK_KEY, next);
      setItems(next);
      return !exists; // returns new state (true = now bookmarked)
    },
    []
  );

  const remove = useCallback((id: string, type: BookmarkType) => {
    const current = read<BookmarkItem[]>(BOOKMARK_KEY, []);
    const next = current.filter((b) => !(b.id === id && b.type === type));
    write(BOOKMARK_KEY, next);
    setItems(next);
  }, []);

  return { bookmarks: items, isBookmarked, toggle, remove };
}

export function useLikes() {
  const [likes, setLikes] = useState<Record<string, number>>(() => read<Record<string, number>>(LIKE_KEY, {}));

  useEffect(() => {
    const handler = () => setLikes(read<Record<string, number>>(LIKE_KEY, {}));
    window.addEventListener("kms-personalization-update", handler);
    return () => window.removeEventListener("kms-personalization-update", handler);
  }, []);

  const isLiked = useCallback((id: string) => Boolean(likes[id]), [likes]);

  const toggleLike = useCallback((id: string): boolean => {
    const current = read<Record<string, number>>(LIKE_KEY, {});
    const liked = Boolean(current[id]);
    const next = { ...current };
    if (liked) delete next[id];
    else next[id] = Date.now();
    write(LIKE_KEY, next);
    setLikes(next);
    return !liked;
  }, []);

  return { likes, isLiked, toggleLike, count: Object.keys(likes).length };
}

export async function shareItem(title: string, text: string): Promise<"shared" | "copied" | "failed"> {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const shareData = { title, text, url };
  try {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share(shareData);
      return "shared";
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(`${title}\n${text}\n${url}`);
      return "copied";
    }
  } catch {
    return "failed";
  }
  return "failed";
}
