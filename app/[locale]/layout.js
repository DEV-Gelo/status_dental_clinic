import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import localFont from "next/font/local";
import "./globals.css";

const kollektif = localFont({
  src: "../fonts/Kollektif.woff2",
  variable: "--font-kollektif",
  weight: "100 900",
});
const playfairDisplay = localFont({
  src: "../fonts/PlayfairDisplay-Italic.woff2",
  variable: "--font-display",
  weight: "100 900",
});

export const metadata = {
  title: "DentaPro",
  description:
    "Стоматологічна клініка DentaPro пропонує широкий спектр стоматологічних послуг для дорослих і дітей. Наша команда професіоналів забезпечує індивідуальний підхід до кожного пацієнта, використовуючи сучасні технології та безболісні методи лікування. Від профілактики до складних хірургічних втручань — ми дбаємо про вашу усмішку!",
  openGraph: {
    title: "DentaPro",
    description:
      "Стоматологічна клініка DentaPro пропонує широкий спектр стоматологічних послуг для дорослих і дітей. Від профілактики до складних хірургічних втручань — ми дбаємо про вашу усмішку!",
    url: "https://denta-pro.com/",
    siteName: "DentaPro",
    locale: "uk-UA",
    type: "website",
  },
  keywords: [
    "стоматологічна клініка",
    "лікування зубів",
    "профілактика карієсу",
    "безболісна стоматологія",
    "сучасні стоматологічні технології",
  ],
  icons: "/favicon.ico",
};

export default async function RootLayout({ children, params }) {
  const { locale } = params;

  // Перевірка, чи є локаль в списку доступних
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${kollektif.variable} ${playfairDisplay.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
