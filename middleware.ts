import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./src/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const hasLocalePrefix = routing.locales.some(
    (locale) =>
      request.nextUrl.pathname === `/${locale}` ||
      request.nextUrl.pathname.startsWith(`/${locale}/`),
  );

  const hasLocaleCookie = request.cookies.has("NEXT_LOCALE");

  // First visit: choose locale from country (NL => Dutch), otherwise default to English.
  if (!hasLocalePrefix && !hasLocaleCookie) {
    const country = request.headers.get("x-vercel-ip-country")?.toUpperCase();
    const locale = country === "NL" ? "nl" : "en";

    const url = request.nextUrl.clone();
    url.pathname =
      request.nextUrl.pathname === "/"
        ? `/${locale}`
        : `/${locale}${request.nextUrl.pathname}`;

    const response = NextResponse.redirect(url);
    response.cookies.set("NEXT_LOCALE", locale, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
