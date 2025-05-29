const homeStructuredData = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "@id": "https://dentalpro-gzla.vercel.app/#dental-clinic",
  name: "Стоматологічна клініка «Status»",
  image: "https://dentalpro-gzla.vercel.app/Main.webp",
  url: "https://dentalpro-gzla.vercel.app",
  logo: "https://dentalpro-gzla.vercel.app/Logo.png",
  description:
    "Стоматологічна клініка Status надає високоякісні послуги з лікування зубів для дорослих та дітей. Сучасні технології, безболісне лікування, індивідуальний підхід — ваша здорова усмішка в надійних руках.",
  sameAs: [
    "https://facebook.com/status-dental",
    "https://instagram.com/status-dental",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "вул. Софії Русової, 3",
    addressLocality: "Київ",
    addressRegion: "Київська область",
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
  areaServed: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Київ",
      addressCountry: "UA",
    },
  },
  priceRange: "$$",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Наші послуги",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: { "@type": "MedicalTherapy", name: "Діагностика" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "MedicalTherapy", name: "Профілактика" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "MedicalTherapy", name: "Ортопедія" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "MedicalTherapy", name: "Ортодонтія" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "MedicalTherapy", name: "Хірургія" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "MedicalTherapy", name: "Імплантація" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "MedicalTherapy", name: "Гнатологія" },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "MedicalTherapy",
          name: "Професійна реставрація",
        },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "MedicalTherapy", name: "Професійна гігієна" },
      },
    ],
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "21:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "15:00",
    },
  ],
  isAcceptingNewPatients: true,
  paymentAccepted: ["Cash", "Credit Card", "Insurance"],
};

export default homeStructuredData;
