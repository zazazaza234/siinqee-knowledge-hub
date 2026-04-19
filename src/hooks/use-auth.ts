import { useEffect, useState, useCallback } from "react";

export type Role = "officer" | "manager" | "executive";

export interface AuthUser {
  name: string;
  role: Role;
  branch: string;
  loginAt: number;
}

const AUTH_KEY = "kms.auth.v1";

function read(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => read());

  useEffect(() => {
    const handler = () => setUser(read());
    window.addEventListener("kms-auth-update", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("kms-auth-update", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const login = useCallback((u: Omit<AuthUser, "loginAt">) => {
    const next: AuthUser = { ...u, loginAt: Date.now() };
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("kms-auth-update"));
    setUser(next);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_KEY);
    window.dispatchEvent(new CustomEvent("kms-auth-update"));
    setUser(null);
  }, []);

  return { user, login, logout };
}

export const ROLE_META: Record<Role, { en: string; om: string; descEn: string; descOm: string }> = {
  officer: {
    en: "Branch Officer",
    om: "Ofiisara Damee",
    descEn: "Front-line staff serving customers at branches.",
    descOm: "Hojjettoota fuulduraa damee keessatti maamiltoota tajaajilan.",
  },
  manager: {
    en: "Department Manager",
    om: "Bulchaa Kutaa",
    descEn: "Mid-level leaders overseeing a department or function.",
    descOm: "Hooggantoota giddu-galeessaa kutaa tokko geggeessan.",
  },
  executive: {
    en: "Executive Leader",
    om: "Hoggantuu Ol'aanaa",
    descEn: "Senior leadership with bank-wide visibility.",
    descOm: "Hoggansa olaanaa baankii guutuu hordofu.",
  },
};
