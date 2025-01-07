import localFont from "next/font/local";
import "./globals.css";

const kollektif = localFont({
  src: "./fonts/Kollektif.woff2",
  variable: "--font-kollektif",
  weight: "100 900",
});
const playfairDisplay = localFont({
  src: "./fonts/PlayfairDisplay-Italic.woff2",
  variable: "--font-display",
  weight: "100 900",
});

export const metadata = {
  title: "DentaPro",
  description:
    "Стоматологічна клініка DentaPro пропонує широкий спектр стоматологічних послуг для дорослих і дітей. Наша команда професіоналів забезпечує індивідуальний підхід до кожного пацієнта, використовуючи сучасні технології та безболісні методи лікування. Від профілактики до складних хірургічних втручань — ми дбаємо про вашу усмішку!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${kollektif.variable} ${playfairDisplay.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
