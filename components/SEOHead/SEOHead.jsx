import Head from "next/head";

const SEOHead = ({
  title = "Стоматологічна клініка DentaPro",
  description = "Запишіться на прийом до досвідченого стоматолога у DentaPro.",
  url = "https://dentapro.com",
  image = "https://dentapro.com/images/preview.jpg",
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* Опціонально */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />
    </Head>
  );
};

export default SEOHead;
