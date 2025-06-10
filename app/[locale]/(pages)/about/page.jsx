import AboutPage from "./about";

export async function generateMetadata({ params }) {
  const baseUrl = "https://dentalpro-gzla.vercel.app";
  const locale = params?.locale || "uk";

  const metadataByLocale = {
    uk: {
      title: "Про нас",
      description:
        "Дізнайтеся більше про стоматологічну клініку Status — команду досвідчених лікарів, сучасне обладнання та індивідуальний підхід до кожного пацієнта. Наша стоматологія у Дарницькому районі м. Києва, на Осокорках, пропонує високоякісні послуги для всієї родини, поєднуючи турботу, професіоналізм і новітні технології.",
    },
    en: {
      title: "About Us",
      description:
        "Learn more about Status dental clinic — a team of experienced doctors, modern equipment, and personalized care for every patient. Our clinic in Darnytskyi district, Kyiv, provides high-quality services for the whole family.",
    },
  };

  const t = metadataByLocale[locale] || metadataByLocale.uk;

  return {
    title: t.title,
    description: t.description,
    openGraph: {
      title: t.title,
      description: t.description,
      url: `${baseUrl}/${locale}/about`,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/about`,
      languages: {
        "uk-UA": `${baseUrl}/uk/about`,
        "en-US": `${baseUrl}/en/about`,
      },
    },
  };
}

export default function About() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Про клініку «Status»",
    url: "https://dentalpro-gzla.vercel.app/about",
    mainEntity: {
      "@type": "MedicalClinic",
      name: "Стоматологічна клініка «Status»",
      image: "https://dentalpro-gzla.vercel.app/openGraph.jpg",
      url: "https://dentalpro-gzla.vercel.app",
      logo: "https://dentalpro-gzla.vercel.app/Logo.png",
      description:
        "Стоматологічна клініка «Status» у Києві (Дарницький район, Осокорки) — це поєднання сучасних технологій, досвідчених лікарів і турботи про кожного пацієнта. Ми надаємо повний спектр стоматологічних послуг: лікування зубів, імплантація, професійна гігієна, естетична стоматологія, ортодонтія та дитяча стоматологія. Дізнайтеся більше про нашу команду, прочитайте реальні відгуки пацієнтів та скористайтеся зручним онлайн-записом.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "вул. Софії Русової, 3",
        addressLocality: "Київ",
        addressCountry: "UA",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+380667668819",
          contactType: "customer service",
        },
        {
          "@type": "ContactPoint",
          telephone: "+380637668819",
          contactType: "customer service",
        },
      ],
      priceRange: "$$",
      medicalSpecialty: [
        "https://schema.org/Dentistry",
        "https://schema.org/CosmeticDentistry",
        "https://schema.org/Diagnostic",
        "https://schema.org/Preventive",
        "https://schema.org/Prosthodontics",
        "https://schema.org/Orthodontics",
        "https://schema.org/OralSurgery",
        "https://health-lifesci.schema.org/Implantology",
        "https://health-lifesci.schema.org/Gnathology",
        "https://health-lifesci.schema.org/RestorativeDentistry",
        "https://health-lifesci.schema.org/DentalHygiene",
      ],
      employee: [
        {
          "@type": "Person",
          name: "Олександр Олександрович",
          jobTitle: "Лікар-стоматолог",
          image: "https://dentalpro-gzla.vercel.app/Doc1.png",
        },
        {
          "@type": "Person",
          name: "Іван Миколайович",
          jobTitle: "Стоматолог-терапевт",
          image: "https://dentalpro-gzla.vercel.app/Doc3.png",
        },
        {
          "@type": "Person",
          name: "Володимир Володимирович",
          jobTitle: "Стоматолог-ортопед",
          image: "https://dentalpro-gzla.vercel.app/Doc2.png",
        },
      ],
      potentialAction: {
        "@type": "ReserveAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://dentalpro-gzla.vercel.app/appointment",
          inLanguage: "uk",
          actionPlatform: [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform",
          ],
        },
        name: "Записатися онлайн",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <AboutPage />
    </>
  );
}
