import AboutPage from "./about";

export const metadata = {
  title: "Про нас",
  description:
    "Дізнайтеся більше про стоматологічну клініку Status — команду досвідчених лікарів, сучасне обладнання та індивідуальний підхід до кожного пацієнта. Наша стоматологія у Дарницькому районі м. Києва, на Осокорках, пропонує високоякісні послуги для всієї родини, поєднуючи турботу, професіоналізм і новітні технології.",
  openGraph: {
    title: "Про нас",
    description:
      "Дізнайтеся більше про стоматологічну клініку Status — команду досвідчених лікарів, сучасне обладнання та індивідуальний підхід до кожного пацієнта. Наша стоматологія у Дарницькому районі м. Києва, на Осокорках, пропонує високоякісні послуги для всієї родини, поєднуючи турботу, професіоналізм і новітні технології.",
    url: "https://dentalpro-gzla.vercel.app/about",
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

export default function About() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Про клініку «Status»",
    url: "https://example.com/about",
    mainEntity: {
      "@type": "DentalClinic",
      name: "Стоматологічна клініка «Status»",
      image: "https://example.com/banner.jpg",
      url: "https://example.com",
      logo: "https://example.com/logo.png",
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
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "137",
      },
      review: [
        {
          "@type": "Review",
          author: {
            "@type": "Person",
            name: "Шляхетна Анастасія",
          },
          datePublished: "2024-12-12",
          reviewBody:
            "Дуже задоволена якістю обслуговування! Лікування пройшло абсолютно безболісно. Обов'язково повернусь і рекомендую всім!",
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
          },
        },
        {
          "@type": "Review",
          author: {
            "@type": "Person",
            name: "Боровий Олександр",
          },
          datePublished: "2025-05-20",
          reviewBody:
            "Звернувся з гострим болем — прийняли в той же день. Вразила швидкість і професіоналізм лікаря. Cучасне обладнання та приємний персонал.",
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
          },
        },
        {
          "@type": "Review",
          author: {
            "@type": "Person",
            name: "Галетова Вікторія",
          },
          datePublished: "2023-08-10",
          reviewBody:
            "Робила чистку та відбілювання зубів. Результат перевершив очікування! Лікарка була дуже уважна. Приємно, що в клініці дбають про комфорт пацієнта.",
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
          },
        },
      ],
      employee: [
        {
          "@type": "Person",
          name: "Олександр Олександрович",
          jobTitle: "Лікар-стоматолог",
          image: "https://example.com/images/oleksandr.jpg",
        },
        {
          "@type": "Person",
          name: "Іван Миколайович",
          jobTitle: "Стоматолог-терапевт",
          image: "https://example.com/images/oleksandr.jpg",
        },
        {
          "@type": "Person",
          name: "Володимир Володимирович",
          jobTitle: "Стоматолог-ортопед",
          image: "https://example.com/images/oleksandr.jpg",
        },
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
