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
// -----------Import React icons--------------//
import { BsArrowUpRightCircle } from "react-icons/bs";

const About = () => {
  // -----Translation-----//
  const t = useTranslations("AboutSection");
  // -----Get the path-----//
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  return (
    <>
      <section className="flex flex-col lg:flex-row w-full h-auto items-center lg:items-start py-[2rem] container-padding">
        <div className="flex relative order-2 lg:order-1 w-full md:w-[80%] lg:w-[50%] h-auto items-end sm:pl-[4rem] lg:pl-0 pb-20 mb-10 lg:mb-0">
          <div className="flex w-1/2 h-full rounded-xl overflow-hidden border-l-8 border-t-8 border-[#006eff]">
            <Image
              src="/About1.webp"
              alt="equipments1"
              width={555}
              height={555}
            />
          </div>
          <div className="flex absolute -bottom-0 right-[15%] w-[50%] h-[40%] rounded-xl overflow-hidden border-l-8 border-t-8 border-[#006eff]">
            <Image
              src="/About2.webp"
              alt="equipments2"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col order-1 lg:order-2 w-auto sm:w-[80%] lg:w-1/2 h-full items-center lg:items-end lg:ml-5">
          <p className="blue-text text-center lg:text-end">{t("nameTitle")}</p>
          <h2 className="title-text-m sm:title-text text-center lg:text-end">
            {t("Title1")} <span className="blue-text">{t("Title2")}</span>{" "}
            {t("Title3")}
          </h2>
          <p className="font-medium text-center lg:text-end my-10">
            {t("Description")}
          </p>
          <Link
            href={`/${locale}/about`}
            className="hidden lg:flex justify-start items-center my-5 lg:my-10"
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
        <Link
          href={`/${locale}/about`}
          className="flex order-3 lg:hidden justify-start items-center my-5 lg:my-10"
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
    </>
  );
};

export default About;
