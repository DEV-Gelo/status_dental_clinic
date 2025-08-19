import React from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
// -----------Import MUI components--------------//
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
// ----------Stylisation buttons MUI-----------------//
import { theme } from "@/components/Stylisation_MUI/stylisation_button_MUI";
// -----Import React icons---------//
import { FaViber, FaTelegramPlane } from "react-icons/fa";
import { MdOutlineAccessTime } from "react-icons/md";
import { BiSolidPhone } from "react-icons/bi";
// --------------Map component---------------------//
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/Map/CustomMap"), {
  ssr: false,
});

const Contact = () => {
  // -----------Translations--------------//
  const t = useTranslations("ContactSection");
  // -----Get the path-----//
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  return (
    <>
      <section className="flex w-full h-[75rem] md:h-[70rem] justify-start items-center flex-col">
        <div className="flex relative flex-col h-auto xl:h-1/2 items-center mx-[1rem]">
          <div className="flex flex-col w-auto max-w-[51rem] h-auto text-center lg:text-left my-10">
            <p className="blue-text">{t("nameTitle")}</p>
            <h2 className="title-text-m sm:title-text">
              {t("Title1")}{" "}
              <span className="blue-text">
                {t("Title2")} {t("Title3")}
              </span>{" "}
              {t("Title4")}
            </h2>
          </div>
          <div className="flexflex-col z-30 w-auto sm:w-full h-auto justify-center items-center border-[1px] shadow-lg rounded-lg bg-[#fdfdfd] p-[2rem] md:p-[5rem] mb-2">
            <div className="flex flex-col sm:flex-row w-full h-auto justify-between items-start">
              {/*Contact us block*/}
              <div className=" flex flex-col w-auto h-auto">
                <h3 className="font-semibold my-2">{t("nameTitle")}</h3>
                <p className="flex justify-start items-start my-2">
                  <span className="text-[1.5rem] mr-3">
                    <FaViber />
                  </span>
                  <span className="text-[1.5rem] mr-3">
                    <FaTelegramPlane />
                  </span>
                  <span className="text-[1.5rem] mr-3">
                    <BiSolidPhone />
                  </span>{" "}
                  066 755 88 00
                </p>
                <p className="flex justify-start items-start my-2">
                  <span className="text-[1.5rem] mr-3">
                    <FaViber />
                  </span>
                  <span className="text-[1.5rem] mr-3">
                    <FaTelegramPlane />
                  </span>
                  <span className="text-[1.5rem] mr-3">
                    <BiSolidPhone />
                  </span>{" "}
                  063 755 88 00
                </p>
              </div>
              {/* Time block*/}
              <div className=" flex flex-col w-auto h-auto mb-4 mt-0">
                <h3 className="font-semibold  my-2">{t("Time.title")}</h3>
                <p className="my-1">{t("Time.Mon")} | 9:00 - 21:00</p>
                <div className="flex">
                  <span className="text-[2.5rem] m-2 ml-0">
                    <MdOutlineAccessTime />
                  </span>
                  <div className="flex flex-col">
                    <p className="my-1">{t("Time.Sat")} | 9:00 - 15:00</p>
                    <p className="my-1">
                      {t("Time.Sun")} | {t("Time.By appointment")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row w-full h-auto justify-between items-start">
              {/* Address block */}
              <div className="flex flex-col w-auto h-auto">
                <h3 className="font-semibold  my-2">{t("Address.Title")}</h3>
                <p className="flex max-w-[20rem]">{t("Address.Address")}</p>
              </div>
              {/* Appointment block */}
              <div className="flex flex-col w-auto h-auto items-center">
                <h3 className="font-semibold  my-2">
                  {t("Appointment.Title")}
                </h3>
                <div className="flex flex-col justify-end items-center">
                  <Link href={`/${locale}/appointment`}>
                    <ThemeProvider theme={theme}>
                      <Button
                        size="large"
                        color="appointment"
                        variant="contained"
                        sx={{
                          whiteSpace: "nowrap",
                          borderRadius: 10,
                          fontWeight: "semibold",
                          fontFamily: "var(--font-montserrat)",
                        }}
                      >
                        {t("Appointment.Appointment")}
                      </Button>
                    </ThemeProvider>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full h-1/2 min-h-[25rem] bg-gray-200">
          <MapComponent position={[50.389, 30.6258]} />
        </div>
      </section>
    </>
  );
};

export default Contact;
