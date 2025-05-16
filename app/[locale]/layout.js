import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import localFont from "next/font/local";
import "./globals.css";
// ---------Fonts-----------//
const montserrat = localFont({
  variable: "--font-montserrat",
  src: [
    {
      path: "../fonts/Montserrat-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Montserrat-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Montserrat-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/Montserrat-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});
export const benzin = localFont({
  src: [
    {
      path: "../fonts/Benzin-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-benzin",
});
export const astron = localFont({
  src: [
    {
      path: "../fonts/Astron-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-astron",
});

export const metadata = {
  title: "Status",
  description:
    "Стоматологічна клініка Status пропонує широкий спектр стоматологічних послуг для дорослих і дітей. Наша команда професіоналів забезпечує індивідуальний підхід до кожного пацієнта, використовуючи сучасні технології та безболісні методи лікування. Від профілактики до складних хірургічних втручань — ми дбаємо про вашу усмішку!",
  openGraph: {
    title: "Status",
    description:
      "Стоматологічна клініка DentaPro пропонує широкий спектр стоматологічних послуг для дорослих та дітей. Від профілактики до складних хірургічних втручань — ми дбаємо про вашу усмішку!",
    url: "https://status-gzla.vercel.app/",
    siteName: "Status",
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

  // Checking if a locale is in the list of available ones
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${montserrat.variable} ${benzin.variable} ${astron.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
