import DoctorsPage from "./doctors";

export async function generateMetadata({ params }) {
  const baseUrl = "https://dentalpro-gzla.vercel.app";
  const locale = params?.locale || "uk";

  const metadataByLocale = {
    uk: {
      title: "Лікарі",
      description:
        "Познайомтесь з командою стоматологічної клініки «Status». Досвідчені лікарі, сучасні підходи до лікування та індивідуальний підхід до кожного пацієнта.",
    },
    en: {
      title: "Doctors",
      description:
        "Meet the team of the Status Dental Clinic. Experienced doctors, modern treatment approaches, and an individual approach to each patient.",
    },
  };

  const t = metadataByLocale[locale] || metadataByLocale.uk;

  return {
    title: t.title,
    description: t.description,
    openGraph: {
      title: t.title,
      description: t.description,
      url: `${baseUrl}/${locale}/doctors`,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/doctors`,
      languages: {
        "uk-UA": `${baseUrl}/uk/doctors`,
        "en-US": `${baseUrl}/en/doctors`,
      },
    },
  };
}

export default function Doctors() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://dentalpro-gzla.vercel.app/doctors#webpage",
    name: "Наша команда",
    url: "https://dentalpro-gzla.vercel.app/doctors",
    description:
      "Команда лікарів стоматологічної клініки Status. Кваліфіковані стоматологи, імплантологи, ортодонти та гігієністи з багаторічним досвідом.",
    inLanguage: "uk",
    lastReviewed: "2025-05-28",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Person",
            name: "Олександр Олександрович",
            jobTitle: "Лікар-стоматолог",
            worksFor: {
              "@type": "MedicalClinic",
              name: "Стоматологічна клініка «Status»",
            },
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "Person",
            name: "Іван Миколайович",
            jobTitle: "Стоматолог-терапевт",
            worksFor: {
              "@type": "MedicalClinic",
              name: "Стоматологічна клініка «Status»",
            },
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "Person",
            name: "Володимир Володимирович",
            jobTitle: "Стоматолог-ортопед",
            worksFor: {
              "@type": "MedicalClinic",
              name: "Стоматологічна клініка «Status»",
            },
          },
        },
      ],
    },
    about: {
      "@type": "MedicalClinic",
      "@id": "https://dentalpro-gzla.vercel.app/#dental-clinic",
      name: "Стоматологічна клініка «Status»",
      image: {
        "@type": "ImageObject",
        url: "https://dentalpro-gzla.vercel.app/openGraph_IMG.jpg",
        width: "1200",
        height: "630",
      },
      url: "hhttps://dentalpro-gzla.vercel.app",
      logo: {
        "@type": "ImageObject",
        url: "https://dentalpro-gzla.vercel.app/Logo.webp",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "вул. Софії Русової, 3",
        addressLocality: "Київ",
        postalCode: "02144",
        addressCountry: "UA",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "50.3888611",
        longitude: "30.6233163",
      },
      hasMap:
        "https://www.google.com/maps/place/Софії+Русової+3/@50.3888611,30.6233163",

      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+380667668819",
          contactType: "customer service",
          areaServed: "UA",
          availableLanguage: ["Ukrainian", "Russian"],
        },
        {
          "@type": "ContactPoint",
          telephone: "+380637668819",
          contactType: "customer service",
          areaServed: "UA",
          availableLanguage: ["Ukrainian", "Russian"],
        },
      ],
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
        name: "Записатися на прийом",
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
      <DoctorsPage />
    </>
  );
}
