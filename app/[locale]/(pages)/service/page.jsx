import ServicePage from "./service";

export const metadata = {
  title: "Послуги",
  description:
    "Ознайомтеся з повним переліком стоматологічних послуг клініки «Status» у Києві: лікування карієсу, імплантація, протезування, ортодонтія, естетична стоматологія, професійна гігієна, хірургія, реставрація, діагностика, профілактика. Індивідуальний підхід та сучасне обладнання.",
  openGraph: {
    title: "Послуги",
    description:
      "Ознайомтеся з повним переліком стоматологічних послуг клініки «Status» у Києві: лікування карієсу, імплантація, протезування, ортодонтія, естетична стоматологія, професійна гігієна, хірургія, реставрація, діагностика, профілактика. Індивідуальний підхід та сучасне обладнання.",
    url: "https://dentalpro-gzla.vercel.app/service",
  },
};

export default function Service() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": "hhttps://dentalpro-gzla.vercel.app/service#webpage",
    name: "Стоматологічні послуги",
    url: "https://dentalpro-gzla.vercel.app/service",
    description:
      "Повний спектр стоматологічних послуг у клініці «Status»: лікування карієсу, імплантація, протезування, ортодонтія, естетична стоматологія, професійна гігієна, хірургія, реставрація, діагностика та профілактика. Помірні ціни, безболісне лікування, індивідуальний підхід та професійне обладнання.",
    inLanguage: "uk",
    lastReviewed: "2025-05-28",
    mainEntityOfPage: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "MedicalProcedure",
            name: "Лікування карієсу",
            description:
              "Сучасні методи лікування карієсу із використанням мікроскопа та безболісної анестезії.",
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "MedicalProcedure",
            name: "Імплантація зубів",
            description:
              "Встановлення дентальних імплантів для повного відновлення зубного ряду.",
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@type": "MedicalProcedure",
            name: "Естетична стоматологія",
            description:
              "Вініри, реставрації та професійне відбілювання для ідеальної усмішки.",
          },
        },
        {
          "@type": "ListItem",
          position: 4,
          item: {
            "@type": "MedicalProcedure",
            name: "Ортодонтія",
            description:
              "Виправлення прикусу за допомогою брекет-систем та кап.",
          },
        },
        {
          "@type": "ListItem",
          position: 5,
          item: {
            "@type": "MedicalProcedure",
            name: "Професійна гігієна",
            description:
              "Ультразвукове чищення зубів, Air Flow та ремінералізація емалі.",
          },
        },
        {
          "@type": "ListItem",
          position: 6,
          item: {
            "@type": "MedicalProcedure",
            name: "Діагностика",
            description:
              "Комплексна діагностика стану зубів та ясен, включаючи 3D-томографію, прицільні знімки та огляд із використанням мікроскопа.",
          },
        },
        {
          "@type": "ListItem",
          position: 7,
          item: {
            "@type": "MedicalProcedure",
            name: "Профілактика",
            description:
              "Професійна гігієна порожнини рота, ремінералізація, фторування, герметизація фісур для попередження карієсу.",
          },
        },
        {
          "@type": "ListItem",
          position: 8,
          item: {
            "@type": "MedicalProcedure",
            name: "Хірургічна стоматологія",
            description:
              "Видалення зубів, включно з зубами мудрості, пластика ясен, резекція коренів, кісткова пластика.",
          },
        },
        {
          "@type": "ListItem",
          position: 9,
          item: {
            "@type": "MedicalProcedure",
            name: "Ортопедія",
            description:
              "Протезування зубів: коронки, мости, вкладки та знімні протези з високоякісних матеріалів.",
          },
        },
        {
          "@type": "ListItem",
          position: 10,
          item: {
            "@type": "MedicalProcedure",
            name: "Гнатологія",
            description:
              "Діагностика та лікування дисфункцій скронево-нижньощелепного суглоба, корекція прикусу та положення щелеп.",
          },
        },
      ],
    },
    mainEntity: {
      "@type": "DentalClinic",
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
      <ServicePage />
    </>
  );
}
