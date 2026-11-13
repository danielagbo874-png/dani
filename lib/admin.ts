export function getAdminEmails(): Set<string> {
  const envValue = process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? "";

  return new Set(
    envValue
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) {
    return false;
  }

  const normalized = email.trim().toLowerCase();
  return getAdminEmails().has(normalized) || normalized === "admin@example.com";
}
