import React from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
// -----------Import MUI components--------------//
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
// ----------Stylisation buttons MUI-----------------//
import { theme } from "@/components/Stylisation_MUI/stylisation_button_MUI";

const OnlineAppointment = () => {
  // -----Translation-----//
  const t = useTranslations("OnlineAppointmentSection");
  // -----Get the path-----//
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  return (
    <>
      <section className="flex relative w-full h-auto sm:h-[50rem] lg:h-[45rem] mb-28 lg:mb-10 mt-10">
        <div className="flex flex-col lg:flex-row w-full h-full items-center lg:items-end justify-end z-10 container-padding">
          <div className="flex relative w-[15rem] sm:w-[45%] aspect-[3/4] order-2 lg:order-1">
            <Image
              src="/OnlineAppointment.webp"
              alt="online appointment"
              fill
              className="object-contain object-bottom"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="flex flex-col w-full sm:w-[80%] lg:w-[55%] h-auto lg:h-full order-1 lg:order-2  py-10 sm:py-[4.5rem]">
            {/* Title */}
            <div className="flex flex-col w-full h-auto">
              <p className="blue-text text-center">{t("nameTitle")}</p>
              <h1 className="title-text-xs xs:title-text-m sm:title-text text-center">
                {t("Title1")} <span className="blue-text">{t("Title2")}</span>{" "}
                {t("Title3")}
              </h1>
            </div>
            <div className="hidden lg:flex flex-col w-full h-auto justify-center items-center mt-10">
              <Link href={`/${locale}/appointment`}>
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
              <p className="font-semibold p-5">{t("call")}</p>
            </div>
          </div>
        </div>
        <div className="flex w-full h-[10rem] sm:h-[12.5rem] absolute bottom-0 z-0 bg-[#006eff]" />
        <div className="flex flex-col lg:hidden absolute bottom-[-5.5rem] w-full h-auto justify-center items-center">
          <Link href={`/${locale}/appointment`}>
            <ThemeProvider theme={theme}>
              <Button
                size="large"
                color="appointment"
                variant="contained"
                sx={{
                  whiteSpace: "nowrap",
                  borderRadius: 10,
                  fontWeight: "600",
                  fontFamily: "var(--font-montserrat)",
                  borderWidth: 2,
                  color: "#ffffff",
                }}
              >
                {t("appointment")}
              </Button>
            </ThemeProvider>
          </Link>
          <p className="w-full text-center font-semibold text-[0.8rem] mt-1">
            {t("call")}
          </p>
        </div>
      </section>
    </>
  );
};

export default OnlineAppointment;
