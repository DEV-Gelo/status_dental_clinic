import ContactPage from "./contacts";

export async function generateMetadata({ params }) {
  const baseUrl = "https://dentalpro-gzla.vercel.app";

  const metadataByLocale = {
    uk: {
      title: "Контакти",
      description:
        "Зв’яжіться з нами — адреса, телефон, email та зручна форма для онлайн-запису. Стоматологічна клініка «Status» знаходиться в Києві на вул. Софії Русової, 3. Працюємо щодня, запис за телефоном або онлайн.",
    },
    en: {
      title: "Contacts",
      description:
        "Get in touch with us — address, phone, email, and a convenient online appointment form. The Status Dental Clinic is located in Kyiv at 3 Sofiya Rusova Street. We work every day, appointments by phone or online.",
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
      url: `${baseUrl}/${locale}/contacts`,
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
        "Зв’яжіться з нами — адреса, телефон, email та зручна форма для онлайн-запису. Стоматологічна клініка «Status» знаходиться в Києві на вул. Софії Русової, 3. Працюємо щодня, запис за телефоном або онлайн.",
      images: [`${baseUrl}/openGraph_IMG.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/contacts`,
      languages: {
        "x-default": `${baseUrl}/uk/contacts`,
        "uk-UA": `${baseUrl}/uk/contacts`,
        "en-US": `${baseUrl}/en/contacts`,
      },
    },
  };
}

export default function Contacts() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": "https://dentalpro-gzla.vercel.app/contacts#webpage",
    name: "Контакти",
    url: "https://dentalpro-gzla.vercel.app/contacts",
    description:
      "Контактна інформація стоматологічної клініки «Status» у Києві: адреса, телефони, email, карта проїзду та форма запису онлайн.",
    inLanguage: "uk",
    mainEntity: {
      "@type": "MedicalClinic",
      "@id": "https://dentalpro-gzla.vercel.app/#dental-clinic",
      name: "Стоматологічна клініка «Status»",
      image: {
        "@type": "ImageObject",
        url: "https://dentalpro-gzla.vercel.app/openGraph_IMG.jpg",
        width: 1200,
        height: 630,
      },
      logo: {
        "@type": "ImageObject",
        url: "https://dentalpro-gzla.vercel.app/Logo.webp",
      },
      url: "https://dentalpro-gzla.vercel.app",
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
      <ContactPage />
    </>
  );
}
