export const authCallbackPath = "/auth/callback";

export function getAuthRedirectUrl(next = "/reframe") {
  const safeNext =
    next.startsWith("/") && !next.startsWith("//") ? next : "/reframe";
  return `${window.location.origin}${authCallbackPath}?next=${encodeURIComponent(safeNext)}`;
}
