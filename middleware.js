import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

// Configure next-intl
const intlMiddleware = createMiddleware({
  locales: ["en", "uk"], // Supported languages
  defaultLocale: "uk", // Default locale
});

// Main middleware
export function middleware(request) {
  // Authorization logic for /admin

  if (/^\/(en|uk)\/admin/.test(request.nextUrl.pathname)) {
    const cookie = request.cookies.get("auth"); // Check the cookie

    if (!cookie) {
      // Get the locale from the URL, if there is one
      let locale = request.nextUrl.pathname.split("/")[1]; // Checking the second element

      // If the locale is not specified in the URL, we try to get it from the Accept-Language header
      if (!locale) {
        const acceptLanguage = request.headers.get("accept-language");

        if (acceptLanguage) {
          // List of languages ​​supported by the application
          const supportedLocales = ["en", "uk"];
          const preferredLocale = acceptLanguage.split(",")[0].toLowerCase(); // Get the first language in the list

          // If the language is in the supported list, use it, otherwise, use the default language
          locale = supportedLocales.includes(preferredLocale)
            ? preferredLocale
            : "uk";
        } else {
          locale = "uk"; // If header is not present, use 'en' by default
        }
      }

      // Redirect to the /login page, taking into account the locale
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  // Execute middleware for i18n
  const response = intlMiddleware(request);

  return response; // Return the processed response
}

// Setup matcher for middleware operation on the corresponding routes
export const config = {
  matcher: [
    "/", // Root page (automatically redirects to /en)
    "/(en|uk)/:path*", // All pages with locales
    "/admin/:path*", // All admin pages
  ],
};
