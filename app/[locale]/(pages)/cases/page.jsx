import CasesPage from "./cases";

export const metadata = {
  title: "Наші роботи",
  description:
    "Переконайтеся в якості нашої роботи! На цій сторінці ви знайдете реальні приклади лікування, реставрації, встановлення імплантів та естетичних змін усмішок наших пацієнтів. Фото «до» та «після» демонструють професіоналізм лікарів клініки «Status» та сучасні підходи до стоматології.",
  openGraph: {
    title: "Наші роботи",
    description:
      "Переконайтеся в якості нашої роботи! На цій сторінці ви знайдете реальні приклади лікування, реставрації, встановлення імплантів та естетичних змін усмішок наших пацієнтів. Фото «до» та «після» демонструють професіоналізм лікарів клініки «Status» та сучасні підходи до стоматології.",
    url: "https://dentalpro-gzla.vercel.app/cases",
  },
  alternates: {
    canonical: "https://dentalpro-gzla.vercel.app/uk/cases",
    languages: {
      "uk-UA": "https://dentalpro-gzla.vercel.app/uk/cases",
      "en-US": "https://dentalpro-gzla.vercel.app/en/cases",
    },
  },
};

export default function Cases() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://dentalpro-gzla.vercel.app/cases#webpage",
    name: "Наші роботи",
    url: "https://dentalpro-gzla.vercel.app/cases",
    description:
      "Приклади реальних клінічних випадків стоматологічної клініки Status: лікування, імплантація, естетична стоматологія та реставрації",
    inLanguage: "uk",
    lastReviewed: "2025-05-28",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "MedicalCondition",
            name: "Реставрація передніх зубів",
            description: "Повна реставрація естетики посмішки",
            possibleTreatment: {
              "@type": "MedicalProcedure",
              name: "Естетична реставрація",
            },
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "MedicalCondition",
            name: "Імплантація зубів",
            description: "Повне відновлення зубного ряду",
            possibleTreatment: {
              "@type": "MedicalProcedure",
              name: "Естетична реставрація",
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
        url: "https://dentalpro-gzla.vercel.app/openGraph.jpg",
        width: "1200",
        height: "630",
      },
      url: "https://dentalpro-gzla.vercel.app",
      logo: {
        "@type": "ImageObject",
        url: "https://dentalpro-gzla.vercel.app/Logo.png",
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
        "https://www.google.com/maps/place/%D0%A1%D0%BE%D1%84%D1%96%D1%97+%D0%A0%D1%83%D1%81%D0%BE%D0%B2%D0%BE%D1%97+3/@50.3888611,30.6233163",

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
      <CasesPage />
    </>
  );
}
