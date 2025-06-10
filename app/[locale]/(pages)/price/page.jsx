import PricePage from "./price";

export async function generateMetadata({ params }) {
  const baseUrl = "https://dentalpro-gzla.vercel.app";
  const locale = params?.locale || "uk";

  const metadataByLocale = {
    uk: {
      title: "Ціни",
      description:
        "Дізнайтеся актуальні ціни на стоматологічні послуги в клініці «Status». Якісна стоматологія за доступною вартістю у Києві. Помірні ціни на всі види стоматологічних послуг",
    },
    en: {
      title: "Prices",
      description:
        "Find out the current prices for dental services at the Status Clinic. Quality dentistry at affordable prices in Kyiv. Moderate prices for all types of dental services.",
    },
  };

  const t = metadataByLocale[locale] || metadataByLocale.uk;

  return {
    title: t.title,
    description: t.description,
    openGraph: {
      title: t.title,
      description: t.description,
      url: `${baseUrl}/${locale}/price`,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/price`,
      languages: {
        "uk-UA": `${baseUrl}/uk/price`,
        "en-US": `${baseUrl}/en/price`,
      },
    },
  };
}

export default function Cases() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://dentalpro-gzla.vercel.app/price#webpage",
    name: "Ціни на стоматологічні послуги",
    url: "https://dentalpro-gzla.vercel.app/price",
    description:
      "Актуальні ціни на стоматологічні послуги клініки Status. Якісна стоматологія за доступною вартістю у Києві. Помірні ціни на всі види стоматологічних послуг.",
    inLanguage: "uk",
    lastReviewed: "2025-05-28",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Service",
            name: "Лікування карієсу",
            description:
              "Якісне лікування карієсу з використанням сучасних матеріалів.",
            serviceType: "Стоматологічні послуги",
            offers: {
              "@type": "Offer",
              priceCurrency: "UAH",
              price: "від 700",
            },
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "Service",
            name: "Імплантація зубів",
            description:
              "Сучасна дентальна імплантація для відновлення зубного ряду.",
            serviceType: "Стоматологічні послуги",
            offers: {
              "@type": "Offer",
              priceCurrency: "UAH",
              price: "від 15000",
            },
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@type": "Service",
            name: "Ортодонтія",
            description:
              "Виправлення прикусу і вирівнювання зубів за допомогою брекет-систем.",
            serviceType: "Стоматологічні послуги",
            offers: {
              "@type": "Offer",
              priceCurrency: "UAH",
              price: "від 10000",
            },
          },
        },
        {
          "@type": "ListItem",
          position: 4,
          item: {
            "@type": "Service",
            name: "Ортодонтія",
            description:
              "Виправлення прикусу і вирівнювання зубів за допомогою брекет-систем.",
            serviceType: "Стоматологічні послуги",
            offers: {
              "@type": "Offer",
              priceCurrency: "UAH",
              price: "від 10000",
            },
          },
        },
        {
          "@type": "ListItem",
          position: 4,
          item: {
            "@type": "Service",
            name: "Ортопедія",
            description:
              "Відновлення зубного ряду за допомогою протезування та коронок.",
            serviceType: "Стоматологічні послуги",
            offers: {
              "@type": "Offer",
              priceCurrency: "UAH",
              price: "від 12000",
            },
          },
        },
        {
          "@type": "ListItem",
          position: 5,
          item: {
            "@type": "Service",
            name: "Реставрація зубів",
            description:
              "Відновлення форми та функції зубів за допомогою сучасних композитних матеріалів.",
            serviceType: "Стоматологічні послуги",
            offers: {
              "@type": "Offer",
              priceCurrency: "UAH",
              price: "від 800",
            },
          },
        },
        {
          "@type": "ListItem",
          position: 6,
          item: {
            "@type": "Service",
            name: "Хірургія",
            description:
              "Видалення зубів, складні операції та імплантація зубів.",
            serviceType: "Стоматологічні послуги",
            offers: {
              "@type": "Offer",
              priceCurrency: "UAH",
              price: "від 900",
            },
          },
        },
        {
          "@type": "ListItem",
          position: 7,
          item: {
            "@type": "Service",
            name: "Професійна гігієна",
            description:
              "Ультразвукове чищення зубів, Air Flow та ремінералізація емалі.",
            serviceType: "Стоматологічні послуги",
            offers: {
              "@type": "Offer",
              priceCurrency: "UAH",
              price: "від 800",
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
      <PricePage />
    </>
  );
}
