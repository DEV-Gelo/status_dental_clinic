import DoctorsPage from "./doctors";

export const metadata = {
  title: "Лікарі",
  description:
    "Познайомтесь з командою стоматологічної клініки «Status». Досвідчені лікарі, сучасні підходи до лікування та індивідуальний підхід до кожного пацієнта.",
  openGraph: {
    title: "Лікарі",
    description:
      "Познайомтесь з командою стоматологічної клініки «Status». Досвідчені лікарі, сучасні підходи до лікування та індивідуальний підхід до кожного пацієнта.",
    url: "https://dentalpro-gzla.vercel.app/doctors",
    images: [
      {
        url: "https://dentalpro.com/images/home-preview.jpg",
        width: 1200,
        height: 630,
        alt: "Стоматологічна клініка Status",
      },
    ],
  },
};

export default function Doctors() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": "https://example.com/doctors#webpage",
    name: "Наша команда",
    url: "https://example.com/doctors",
    description:
      "Команда лікарів стоматологічної клініки Status. Кваліфіковані стоматологи, імплантологи, ортодонти та гігієністи з багаторічним досвідом.",
    inLanguage: "uk",
    lastReviewed: "2025-05-28",
    mainEntityOfPage: {
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
              "@type": "DentalClinic",
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
              "@type": "DentalClinic",
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
              "@type": "DentalClinic",
              name: "Стоматологічна клініка «Status»",
            },
          },
        },
      ],
    },
    mainEntity: {
      "@type": "DentalClinic",
      "@id": "https://example.com/#dental-clinic",
      name: "Стоматологічна клініка «Status»",
      image: {
        "@type": "ImageObject",
        url: "https://example.com/banner.jpg",
        width: "1200",
        height: "630",
      },
      url: "https://example.com",
      logo: {
        "@type": "ImageObject",
        url: "https://example.com/logo.png",
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
          urlTemplate: "https://example.com/appointment",
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
