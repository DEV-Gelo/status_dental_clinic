import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import localFont from "next/font/local";
import homeStructuredData from "@/lib/structured-data/home";
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
  title: {
    template: "%s | Стоматологічна клініка Status",
    default: "Стоматологічна клініка Status",
  },
  description:
    "Стоматологічна клініка Status у Києві — сучасне, безболісне лікування зубів для дорослих та дітей. Індивідуальний підхід для вашої здорової посмішки.",
  keywords: [
    "стоматологічна клініка",
    "лікування зубів",
    "профілактика карієсу",
    "безболісна стоматологія",
    "сучасні стоматологічні технології",
    "дитяча стоматологія",
    "естетична стоматологія",
    "Status стоматологія",
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  metadataBase: new URL("https://dentalpro-gzla.vercel.app"),
  openGraph: {
    title: "Стоматологічна клініка Status",
    description:
      "Відвідайте стоматологічну клініку Status — сучасний підхід, професійні лікарі, безболісне лікування та дбайливе ставлення до кожного пацієнта.",
    url: "https://dentalpro-gzla.vercel.app",
    siteName: "Status",
    images: [
      {
        url: "https://dentalpro-gzla.vercel.app/openGraph_IMG.jpg",
        width: 1200,
        height: 630,
        alt: "Стоматологічна клініка Status",
      },
    ],
    locale: "uk-UA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Стоматологічна клініка Status",
    description:
      "Індивідуальний підхід, сучасне обладнання, професійна команда стоматологів — довірте свою усмішку клініці Status.",
    images: ["https://dentalpro-gzla.vercel.app/openGraph_IMG.jpg"],
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(homeStructuredData).replace(/</g, "\\u003c"),
          }}
        />
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
