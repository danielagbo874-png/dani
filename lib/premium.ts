export const PREMIUM_PLAN_COOKIE = "nexa-plan";

export function getPremiumPlanFromCookie(cookieHeader?: string | null): "prime" | "free" {
  if (!cookieHeader) return "free";

  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${PREMIUM_PLAN_COOKIE}=`));

  if (!match) return "free";

  const rawValue = decodeURIComponent(match.split("=")[1] ?? "");
  return rawValue === "prime" ? "prime" : "free";
}

export function getStoredPremiumPlan(): "prime" | "free" {
  if (typeof window === "undefined") return "free";

  const saved = window.localStorage.getItem(PREMIUM_PLAN_COOKIE);
  return saved === "prime" ? "prime" : "free";
}

export function setStoredPremiumPlan(plan: "prime" | "free") {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(PREMIUM_PLAN_COOKIE, plan);
  document.cookie = `${PREMIUM_PLAN_COOKIE}=${encodeURIComponent(plan)}; path=/; max-age=${60 * 60 * 24 * 365}`;
}
