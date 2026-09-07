import { NextRequest, NextResponse } from "next/server";

const previewCookieName = "remixkit-admin-preview";

function isMaintenanceModeEnabled() {
  return process.env.MAINTENANCE_MODE === "true";
}

function hasAdminPreview(request: NextRequest) {
  const previewToken = process.env.ADMIN_PREVIEW_TOKEN;
  return Boolean(
    previewToken &&
    request.cookies.get(previewCookieName)?.value === previewToken,
  );
}

export function proxy(request: NextRequest) {
  if (!isMaintenanceModeEnabled()) {
    return NextResponse.next();
  }

  const configuredToken = process.env.ADMIN_PREVIEW_TOKEN;
  const requestedToken = request.nextUrl.searchParams.get("preview");

  if (configuredToken && requestedToken === configuredToken) {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.searchParams.delete("preview");

    const response = NextResponse.redirect(cleanUrl);
    response.cookies.set(previewCookieName, configuredToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: request.nextUrl.protocol === "https:",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  }

  if (hasAdminPreview(request) || request.nextUrl.pathname === "/maintenance") {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL("/maintenance", request.url));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|site.webmanifest|robots.txt|sitemap.xml|opengraph-image).*)",
  ],
};
