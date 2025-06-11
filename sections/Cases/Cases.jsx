import React from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
// -----------Import MUI components--------------//
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
// ----------Stylisation buttons MUI-----------------//
import { theme } from "@/components/Stylisation_MUI/stylisation_button_MUI";
// -----------Import React icons--------------//
import { BsArrowUpRightCircle } from "react-icons/bs";
// -----------Import Iternal Component--------------//
import { Slider } from "@/components/Compare_Image/Slider";

const Cases = () => {
  // -----Translation-----//
  const t = useTranslations("CasesSection");
  // -----Get the path-----//
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  return (
    <>
      <section className="flex flex-col w-full h-auto py-[2rem] container-padding">
        <div className="flex flex-col lg:flex-row w-full h-full justify-center items-center lg:justify-start lg:items-start lg:mt-10">
          <div className="flex flex-col w-full sm:w-[80%] lg:w-1/2 h-full lg:mr-5">
            <p className="blue-text text-center lg:text-start">
              {t("nameTitle")}
            </p>
            <h2 className="title-text-m sm:title-text text-center lg:text-start">
              {t("Title1")} <span className="blue-text">{t("Title2")}</span>{" "}
              {t("Title3")}
            </h2>
            <p className="font-medium text-center lg:text-start mt-10 mb-10 lg:mb-0">
              {t("Description")}
            </p>
          </div>
          <div className="flex w-full sm:w-[80%] lg:w-1/2 h-full rounded-md overflow-hidden lg:ml-5">
            <Slider Before="/Before.webp" After="/After.webp" />
          </div>
        </div>
        <div className="flex w-full justify-center lg:justify-start items-start mt-10 lg:mt-0">
          <Link
            href={`/${locale}/cases`}
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
    </>
  );
};

export default Cases;
