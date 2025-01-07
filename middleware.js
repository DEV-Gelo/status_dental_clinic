import { NextResponse } from "next/server";

// Функція middleware повинна приймати параметр request
export function middleware(request) {
  // Перевірка, чи є певний cookie, щоб визначити, чи користувач авторизований
  const cookie = request.cookies.get("auth"); // або інше ім'я cookie

  if (!cookie) {
    // Якщо cookie відсутній, перенаправляємо на сторінку /admin/login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next(); // Якщо cookie є, дозволяємо продовжити доступ
}

// Налаштування matcher для маршруту /admin
export const config = {
  matcher: "/admin/:path*", // Цей middleware працюватиме для всіх підшляхів /admin
};
