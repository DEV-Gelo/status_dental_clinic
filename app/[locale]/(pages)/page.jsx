import HomePage from "./Home";

export async function generateMetadata({ params }) {
  const baseUrl = "https://status-dental-clinic.vercel.app";

  const metadataByLocale = {
    uk: {
      title: "Головна",
      description:
        "Дізнайтеся більше про стоматологічну клініку Status — команду досвідчених лікарів, сучасне обладнання та індивідуальний підхід до кожного пацієнта. Наша стоматологія у Дарницькому районі м. Києва, на Осокорках, пропонує високоякісні послуги для всієї родини, поєднуючи турботу, професіоналізм і новітні технології.",
    },
    en: {
      title: "Home",
      description:
        "Learn more about Status dental clinic — a team of experienced doctors, modern equipment, and personalized care for every patient. Our clinic in Darnytskyi district, Kyiv, provides high-quality services for the whole family.",
    },
  };

  const locale = params?.locale || "uk";
  const t = metadataByLocale[locale] || metadataByLocale.uk;

  return {
    title: t.title,
    description: t.description,
    openGraph: {
      title: t.title,
      description: t.description,
      url: `${baseUrl}/${locale}`,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        "x-default": `${baseUrl}/uk`,
        "uk-UA": `${baseUrl}/uk`,
        "en-US": `${baseUrl}/en`,
      },
    },
  };
}

export default function Home() {
  return <HomePage />;
}
