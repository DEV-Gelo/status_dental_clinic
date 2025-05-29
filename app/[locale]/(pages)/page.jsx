"use client";
import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import homeStructuredData from "@/lib/structured-data/home";
// -----------Import MUI components--------------//
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
// ----------Stylisation buttons MUI-----------------//
import { theme } from "@/components/Stylisation_MUI/stylisation_button_MUI";
// -----------Import React icons--------------//
import { FaStar } from "react-icons/fa";
// -----------Import Iternal Component--------------//
import Services from "@/sections/Services/Services";
import Team from "@/sections/Team/Team";
import Cases from "@/sections/Cases/Cases";
import About from "@/sections/About/About";
import Testimonials from "@/sections/Testimonials/Testimonials";
import Contact from "@/sections/Contact/Contact";
import Advantages from "@/sections/Advantages/Advantages";

const Home = () => {
  // -----Translations--------//
  const t = useTranslations("Home_page");

  return (
    <>
      {/* -----Script Structured Data----- */}
      <Script
        id="structured-data-home"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeStructuredData),
        }}
      />
      {/* ----------Main Section---------- */}

      <section className="flex relative flex-col md:flex-row w-full h-auto min-h-[35rem] items-end mt-[6rem] container-padding">
        <div className="flex flex-col w-full md:w-1/2 md:pr-10">
          <p className="blue-text text-center md:text-start mt-3">
            {t("mainSection.nameTitle")}
          </p>
          <h1 className="title-text-m sm:title-text my-3 text-center md:text-start">
            {t("mainSection.Title1")}{" "}
            <span className="blue-text">{t("mainSection.Title2")}</span>{" "}
            {t("mainSection.Title3")}
          </h1>
          <p className="text-[0.8rem] sm:text-[1rem] text-center md:text-start my-3">
            {t("mainSection.Description")}
          </p>
          <Link
            // href={`/${locale}/appointment`}
            href="#"
            className="hidden md:flex justify-start items-center my-5 lg:my-10"
          >
            <ThemeProvider theme={theme}>
              <Button
                size="large"
                color="appointment"
                variant="outlined"
                sx={{
                  whiteSpace: "nowrap",
                  borderRadius: 10,
                  fontWeight: "600",
                  fontFamily: "var(--font-montserrat)",
                  borderWidth: 2,
                  borderColor: "#006eff",
                  color: "#006eff",
                }}
              >
                {t("appointment")}
              </Button>
            </ThemeProvider>
          </Link>
          <p className="flex flex-wrap text-[0.8rem] sm:text-[1rem] items-center justify-center md:justify-start my-5">
            {t("mainSection.google1")}
            <span className="flex mx-2 text-[#FF9800]">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </span>
            {t("mainSection.google2")}
          </p>
        </div>
        <div className="flex relative w-full md:w-1/2 h-[25rem] sm:h-[35rem] z-10 lg:mt-auto md:pl-10">
          <Image
            src="/Main.webp"
            alt="main doctor"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
            priority
          />
        </div>
        <div className="flex md:hidden w-screen h-[14rem] absolute bottom-[130px] left-0 z-0 bg-[#006eff]" />
        <Link
          // href={`/${locale}/appointment`}
          href="#"
          className="flex md:hidden justify-center items-center mx-auto my-5 lg:my-10"
        >
          <ThemeProvider theme={theme}>
            <Button
              size="large"
              color="appointment"
              variant="contained"
              sx={{
                my: 3,
                whiteSpace: "nowrap",
                borderRadius: 10,
                fontWeight: "600",
                fontFamily: "var(--font-montserrat)",
                borderWidth: 2,
                borderColor: "#006eff",
                color: "#fff",
              }}
            >
              {t("appointment")}
            </Button>
          </ThemeProvider>
        </Link>
      </section>
      {/* ----------Advantages Section---------- */}
      <Advantages />
      {/* ----------Services Section---------- */}
      <Services />
      {/* ----------Team Section---------- */}
      <Team />
      {/* ----------Cases Section---------- */}
      <Cases />
      {/* ----------About Section---------- */}
      <About />
      {/* ----------Testimonials Section---------- */}
      <Testimonials />
      {/* ----------Contact Section---------- */}
      <Contact />
    </>
  );
};

export default Home;
