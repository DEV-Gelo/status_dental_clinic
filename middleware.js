import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

// Configure next-intl
const intlMiddleware = createMiddleware({
  locales: ["en", "uk"], // Supported languages
  defaultLocale: "en", // Default locale
});

// Main middleware
export function middleware(request) {
  // Authorization logic for /admin

  if (/^\/(en|uk)\/admin/.test(request.nextUrl.pathname)) {
    const cookie = request.cookies.get("auth"); // Check the cookie

    console.log("NextUrl.pathname :", request.nextUrl.pathname); // Логуємо куку для перевірки
    console.log("Cookie value: ", cookie); // Логуємо куку для перевірки

    if (!cookie) {
      // Get the locale from the URL, if there is one
      let locale = request.nextUrl.pathname.split("/")[1]; // Перевіряємо другий елемент

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
            : "en";
        } else {
          locale = "en"; // If header is not present, use 'en' by default
        }
      }

      // Redirect to the /login page, taking into account the locale
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  // if (request.nextUrl.pathname.startsWith("/admin")) {
  //   const cookie = request.cookies.get("auth"); // Check the cookie

  //   console.log("NextUrl.pathname :", request.nextUrl.pathname); // Логуємо куку для перевірки
  //   console.log("Cookie value: ", cookie); // Логуємо куку для перевірки

  //   if (!cookie) {
  //     // Get the locale from the URL, if there is one
  //     let locale = request.nextUrl.pathname.split("/")[1]; // Перевіряємо другий елемент

  //     // If the locale is not specified in the URL, we try to get it from the Accept-Language header
  //     if (!locale) {
  //       const acceptLanguage = request.headers.get("accept-language");

  //       if (acceptLanguage) {
  //         // List of languages ​​supported by the application
  //         const supportedLocales = ["en", "uk"];
  //         const preferredLocale = acceptLanguage.split(",")[0].toLowerCase(); // Get the first language in the list

  //         // If the language is in the supported list, use it, otherwise, use the default language
  //         locale = supportedLocales.includes(preferredLocale)
  //           ? preferredLocale
  //           : "en";
  //       } else {
  //         locale = "en"; // If header is not present, use 'en' by default
  //       }
  //     }

  //     // Redirect to the /login page, taking into account the locale
  //     return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  //   }
  // }

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
