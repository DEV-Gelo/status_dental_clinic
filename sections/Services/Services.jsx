"use client";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
// -----------Import MUI components--------------//
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
// ----------Stylisation buttons MUI-----------------//
import { theme } from "@/components/Stylisation_MUI/stylisation_button_MUI";
// -----------Import React icons--------------//
import { BsArrowUpRightCircle } from "react-icons/bs";

const Services = () => {
  const [hasMounted, setHasMounted] = useState(false);
  // -----MediaQuery-----//
  const isMobile = useMediaQuery({ maxWidth: 639 }); // <sm
  const isDesktop = useMediaQuery({ minWidth: 640 }); // >=sm

  // -----Translation-----//
  const t = useTranslations("ServiceSection");
  // -----Get the path-----//
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  if (isMobile) {
    return (
      <section className="flex w-full h-full justify-start items-center flex-col py-[2rem] container-padding">
        <div className="flex flex-col w-full h-auto justify-center items-center m-5">
          <p className="blue-text">{t("nameTitle")}</p>
          <h2 className="title-text-m text-center">
            {t("Title1")} <span className="blue-text">{t("Title2")}</span>{" "}
            {t("Title3")}
          </h2>
        </div>

        <div className="flex w-[19rem] h-[4.5rem] justify-start items-center shadow-md border-t border-[1px] rounded-lg py-2 px-3 my-3 mx-auto">
          <div className="flex relative w-[3.125rem] h-[3.25rem]">
            <Image
              src="/diagnostic.svg"
              alt="diagnostic"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <h3 className="font-bold text-[1.75rem] ml-3">{t("Diagnostic")}</h3>
        </div>
        <div className="flex w-[19rem] h-[4.5rem] justify-start items-center shadow-md border-t border-[1px] rounded-lg py-2 px-3 my-3 mx-auto">
          <div className="flex relative w-[3.125rem] h-[3.25rem]">
            <Image
              src="/prevention.svg"
              alt="prevention"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <h3 className="font-bold text-[1.75rem] ml-3">{t("Preventive")}</h3>
        </div>
        <div className="flex w-[19rem] h-[4.5rem] justify-start items-center shadow-md border-t border-[1px] rounded-lg py-2 px-3 my-3 mx-auto">
          <div className="flex relative w-[3.125rem] h-[3.25rem]">
            <Image
              src="/orthopedics.svg"
              alt="orthopedics"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <h3 className="font-bold text-[1.75rem] ml-3">{t("Orthopedics")}</h3>
        </div>
        <div className="flex w-[19rem] h-[4.5rem] justify-start items-center shadow-md border-t border-[1px] rounded-lg py-2 px-3 my-3 mx-auto">
          <div className="flex relative w-[3.125rem] h-[3.25rem]">
            <Image
              src="/orthodontics.svg"
              alt="orthodontics"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <h3 className="font-bold text-[1.75rem] ml-3">{t("Orthodontics")}</h3>
        </div>
        <div className="flex w-[19rem] h-[4.5rem] justify-start items-center shadow-md border-t border-[1px] rounded-lg py-2 px-3 my-3 mx-auto">
          <div className="flex relative w-[3.125rem] h-[3.25rem]">
            <Image
              src="/Surgery.svg"
              alt="surgery"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <h3 className="font-bold text-[1.75rem] ml-3">{t("Surgery")}</h3>
        </div>
        <div className="flex w-[19rem] h-[4.5rem] justify-start items-center shadow-md border-t border-[1px] rounded-lg py-2 px-3 my-3 mx-auto">
          <div className="flex relative w-[3.125rem] h-[3.25rem]">
            <Image
              src="/Implant.svg"
              alt="implants"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <h3 className="font-bold text-[1.75rem] ml-3">{t("Implantation")}</h3>
        </div>
        <Link
          href={`/${locale}/service`}
          className="flex justify-start items-center my-5 lg:my-10"
          aria-label={t("MoreLong")}
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
              {t("More")}
              <span className="text-[1.5rem] ml-3">
                <BsArrowUpRightCircle />
              </span>
            </Button>
          </ThemeProvider>
        </Link>
      </section>
    );
  }

  if (isDesktop) {
    return (
      <section className="flex w-full h-full lg:h-[55rem] justify-start items-center flex-col py-[2rem] container-padding">
        <div className="flex flex-col w-full sm:w-[36.5rem] h-auto justify-center items-center m-5">
          <p className="blue-text">{t("nameTitle")}</p>
          <h2 className="title-text-m sm:title-text text-center">
            {t("Title1")} <span className="blue-text">{t("Title2")}</span>{" "}
            {t("Title3")}
          </h2>
        </div>
        <div className="flex w-full h-full lg:bg-none bg-[url('/bg-tooth.webp')] bg-no-repeat bg-contain bg-center">
          <div className="flex flex-col w-1/2 lg:w-1/3 h-full justify-start p-5">
            <div className="flex flex-col w-full h-[10rem] my-5 justify-start">
              <div className="flex w-full h-auto justify-end my-2">
                <h3 className="font-bold text-[1.5rem] lg:text-[1.75rem] mr-3">
                  {t("Diagnostic")}
                </h3>
                <div className="flex relative w-[3.125rem] h-[3.25rem]">
                  <Image
                    src="/diagnostic.svg"
                    alt="diagnostic"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <p className="text-right">{t("DiagnosticDescription")}</p>
            </div>
            <div className="flex flex-col w-full h-[10rem] my-5 justify-start">
              <div className="flex w-full h-auto justify-end my-2">
                <h3 className="font-bold text-[1.5rem] lg:text-[1.75rem] mr-3">
                  {t("Preventive")}
                </h3>
                <div className="flex relative min-w-[3.125rem] w-[3.125rem] h-[3.25rem]">
                  <Image
                    src="/prevention.svg"
                    alt="prevention"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <p className="text-right">{t("PreventiveDescription")}</p>
            </div>
            <div className="flex flex-col w-full h-[10rem] my-5 justify-start">
              <div className="flex w-full h-auto justify-end my-2">
                <h3 className="font-bold text-[1.5rem] lg:text-[1.75rem] mr-3">
                  {t("Orthopedics")}
                </h3>
                <div className="flex relative w-[3.125rem] h-[3.25rem]">
                  <Image
                    src="/orthopedics.svg"
                    alt="orthopedics"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <p className="text-right">{t("OrthopedicsDescription")}</p>
            </div>
          </div>
          <div className="hidden lg:flex flex-col w-1/3 h-full justify-end items-center p-5">
            <Image
              src="/ServiceTooth.webp"
              alt="tooth"
              width={430}
              height={420}
              className="object-cover my-auto"
            />

            <Link
              href={`/${locale}/service`}
              className="hidden md:flex justify-start items-center my-5 lg:my-10"
              aria-label={t("MoreLong")}
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
                  {t("More")}
                  <span className="text-[1.5rem] ml-3">
                    <BsArrowUpRightCircle />
                  </span>
                </Button>
              </ThemeProvider>
            </Link>
          </div>
          <div className="flex flex-col w-1/2 lg:w-1/3 h-full justify-start p-5">
            <div className="flex flex-col w-full h-[10rem] my-5 justify-start">
              <div className="flex w-full h-auto justify-start my-2">
                <div className="flex relative w-[3.125rem] h-[3.25rem]">
                  <Image
                    src="/orthodontics.svg"
                    alt="orthodontics"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-bold text-[1.5rem] lg:text-[1.75rem] ml-3">
                  {t("Orthodontics")}
                </h3>
              </div>
              <p className="text-left">{t("OrthodonticsDescription")}</p>
            </div>
            <div className="flex flex-col w-full h-[10rem] my-5 justify-start end">
              <div className="flex w-full h-auto justify-start my-2">
                <div className="flex relative w-[3.125rem] h-[3.25rem]">
                  <Image
                    src="/Surgery.svg"
                    alt="surgery"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-bold text-[1.5rem] lg:text-[1.75rem] ml-3">
                  {t("Surgery")}
                </h3>
              </div>
              <p className="text-left">{t("SurgeryDescription")}</p>
            </div>
            <div className="flex flex-col w-full h-[10rem] my-5 justify-start end">
              <div className="flex w-full h-auto justify-start my-2">
                <div className="flex relative w-[3.125rem] h-[3.25rem]">
                  <Image
                    src="/Implant.svg"
                    alt="implant"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-bold text-[1.5rem] lg:text-[1.75rem] ml-3">
                  {t("Implantation")}
                </h3>
              </div>
              <p className="text-left">{t("ImplantationDescription")}</p>
            </div>
          </div>
        </div>
        <div className="lg:hidden flex w-full h-auto items-center justify-center">
          <Link
            href={`/${locale}/service`}
            className="flex justify-start items-center my-5 lg:my-10"
            aria-label={t("MoreLong")}
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
                {t("More")}
                <span className="text-[1.5rem] ml-3">
                  <BsArrowUpRightCircle />
                </span>
              </Button>
            </ThemeProvider>
          </Link>
        </div>
      </section>
    );
  }

  return null;
};

export default Services;
