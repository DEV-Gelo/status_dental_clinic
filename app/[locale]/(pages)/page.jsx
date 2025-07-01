import HomePage from "./Home";

export async function generateMetadata({ params }) {
  const baseUrl = "https://status-dental-clinic.com.ua";

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
      siteName: "Status",
      locale: locale === "en" ? "en-US" : "uk-UA",
      type: "website",
      images: [
        {
          url: `${baseUrl}/openGraph_IMG.jpg`,
          width: 1200,
          height: 630,
          alt: "Стоматологічна клініка Status",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Стоматологічна клініка Status",
      description:
        "Індивідуальний підхід, сучасне обладнання, професійна команда стоматологів — довірте свою усмішку клініці Status.",
      images: [`${baseUrl}/openGraph_IMG.jpg`],
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
