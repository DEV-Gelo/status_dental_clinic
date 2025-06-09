import HomePage from "./Home";

export const metadata = {
  title: "Головна",
  description:
    "Дізнайтеся більше про стоматологічну клініку Status — команду досвідчених лікарів, сучасне обладнання та індивідуальний підхід до кожного пацієнта. Наша стоматологія у Дарницькому районі м. Києва, на Осокорках, пропонує високоякісні послуги для всієї родини, поєднуючи турботу, професіоналізм і новітні технології.",
  openGraph: {
    title: "Головна",
    description:
      "Стоматологічна клініка Status у Києві — сучасне, безболісне лікування зубів для дорослих та дітей. Індивідуальний підхід для вашої здорової посмішки.",
    url: "https://dentalpro-gzla.vercel.app/about",
  },
  alternates: {
    canonical: "https://dentalpro-gzla.vercel.app/ua",
    languages: {
      "uk-UA": "https://dentalpro-gzla.vercel.app/ua",
      "en-US": "https://dentalpro-gzla.vercel.app/en",
    },
  },
};

export default function Home() {
  return (
    <>
      <HomePage />
    </>
  );
}
