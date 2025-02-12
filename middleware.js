import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

// Налаштовуємо next-intl
const intlMiddleware = createMiddleware({
  locales: ["en", "uk"], // Підтримувані мови
  defaultLocale: "en", // Локаль за замовчуванням
});

// Головний middleware
export function middleware(request) {
  // Виконуємо middleware для i18n
  const response = intlMiddleware(request);

  // Логіка авторизації для /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const cookie = request.cookies.get("auth"); // Перевіряємо cookie

    if (!cookie) {
      // Отримуємо локаль з URL, якщо вона є
      let locale = request.nextUrl.pathname.split("/")[0];

      // Якщо локаль не вказана в URL, намагаємось отримати її з заголовку Accept-Language
      if (!locale) {
        const acceptLanguage = request.headers.get("accept-language");

        if (acceptLanguage) {
          // Список мов, що підтримуються в додатку
          const supportedLocales = ["en", "uk"];
          const preferredLocale = acceptLanguage.split(",")[0].toLowerCase(); // Отримуємо першу мову в списку

          // Якщо мова є в списку підтримуваних, використовуємо її, інакше — мову за замовчуванням
          locale = supportedLocales.includes(preferredLocale)
            ? preferredLocale
            : "en";
        } else {
          locale = "en"; // Якщо заголовок не присутній, використовуємо 'en' за замовчуванням
        }
      }

      // Вивести в консоль, щоб перевірити локаль
      console.log("locale from request:", locale);

      // Перенаправляємо на сторінку /login з врахуванням локалі
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  return response; // Повертаємо оброблений response
}

// Налаштування matcher для роботи middleware на відповідних маршрутах
export const config = {
  matcher: [
    "/", // Коренева сторінка (автоматично перенаправляє на /en)
    "/(en|uk)/:path*", // Усі сторінки з локалями
    "/admin/:path*", // Усі сторінки адмінки
  ],
};
