import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

// Configure next-intl
const intlMiddleware = createMiddleware({
  locales: ["en", "uk"], // Supported languages
  defaultLocale: "uk", // Default locale
});

// Main middleware
export function middleware(request) {
  const urlPathname = request.nextUrl.pathname;

  // Checking if the URL already contains a supported locale
  let locale = urlPathname.split("/")[1];

  if (!["en", "uk"].includes(locale)) {
    // Get the accept-language header
    const acceptLanguage = request.headers.get("accept-language");

    if (acceptLanguage) {
      const preferredLocale = acceptLanguage.split(",")[0].split("-")[0]; // take the first priority option
      if (["en", "uk"].includes(preferredLocale)) {
        locale = preferredLocale;
      } else {
        locale = "uk"; // If no matches, default locale
      }
    } else {
      locale = "uk"; // If the accept-language is missing, also the default locale
    }

    // Redirect to a specific locale
    return NextResponse.redirect(
      new URL(`/${locale}${urlPathname}`, request.url)
    );
  }

  // If this is an administrator page, check authorization
  if (/^\/(en|uk)\/admin/.test(urlPathname)) {
    const cookie = request.cookies.get("auth"); // Checking the authorization cookie
    if (!cookie) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  // Execute middleware for i18n
  return intlMiddleware(request);
}

// Setup matcher for middleware operation on the corresponding routes
export const config = {
  matcher: [
    "/", // Root page (automatically redirects to /uk or /en)
    "/(en|uk)/:path*", // All pages with locales
    "/admin/:path*", // Admin pages without explicit locale
  ],
};
