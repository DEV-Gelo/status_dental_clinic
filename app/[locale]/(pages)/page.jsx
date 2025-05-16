"use client";
import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
// -----------Import MUI components--------------//
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
// ----------Stylisation buttons MUI-----------------//
import { theme } from "@/components/Stylisation_MUI/stylisation_button_MUI";
import SEOHead from "@/components/SEOHead/SEOHead";
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
      {/* ---------------SEO-META-TAG---------------- */}
      <SEOHead
        title="Стоматологічна клініка Status"
        description="Запишіться на прийом до досвідчених стоматологів у Status."
        url="https://dentalpro-production.up.railway.app"
        image="https://dentapro.com/images/home-preview.jpg" //Image for preview in social media size: 1200 x 630px
      />
      {/* ----------Main Section---------- */}
      <div>
        <section className="flex relative flex-col md:flex-row w-full min-h-[35rem] mt-[6rem] px-[1rem] lg:px-[2rem] xl:px-[10rem] 2xl:px-[20rem]">
          <div className="flex flex-col w-full md:w-[50%] h-full md:pr-10">
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
          <div className="flex w-full md:w-[50%] h-full justify-center z-10 my-auto lg:mt-auto lg:my-0 md:pl-10">
            <Image
              src="/Main_img.png"
              alt="main doctor"
              width={450}
              height={450}
              priority
            />
          </div>
          <div className="flex md:hidden w-screen h-[14rem] absolute bottom-[133px] left-0 z-0 bg-[#006eff]" />
          <Link
            // href={`/${locale}/appointment`}
            href="#"
            className="flex md:hidden justify-center items-center my-5 lg:my-10"
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
      </div>
    </>
  );
};

export default Home;
