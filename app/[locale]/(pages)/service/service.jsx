"use client";
import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
// -----------Import React Icon--------------//
import { BsCheck2Circle, BsArrowRightCircle } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa6";
// -----------Import MUI components--------------//
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
// ----------Stylisation buttons MUI-----------------//
import { theme } from "@/components/Stylisation_MUI/stylisation_button_MUI";
// ----------Import Iternal Component----------------//
import Team from "@/sections/Team/Team";
import OnlineAppointment from "@/sections/OnlineAppointment/OnlineAppointment";
import Cases from "@/sections/Cases/Cases";

const ServicePage = () => {
  // --------Translations---------//
  const t = useTranslations("ServicePage");
  // -----Get the path-----//
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const [hasMounted, setHasMounted] = useState(false);
  const [idService, setIdService] = useState("");
  const [serviceIMG, setServiceIMG] = useState("/Diagnostic.webp");
  const [nameService, setNameService] = useState(t("Services.Name1"));
  const [descriptionService, setDescriptionService] = useState(
    t("Services.Description1")
  );
  const [advantages, setAdvantages] = useState([
    t("Services.Advantages1.Av1"),
    t("Services.Advantages1.Av2"),
    t("Services.Advantages1.Av3"),
    t("Services.Advantages1.Av4"),
  ]);

  // -----MediaQuery-----//
  const isMobile = useMediaQuery({ maxWidth: 1023 }); // <lg
  const isDesktop = useMediaQuery({ minWidth: 1024 }); // >=lg

  // Wait for the component to be fully mounted to avoid SSR errors
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null; // Don't render anything before mounting

  // -----------Service Data-----------//
  const services = [
    {
      id: 1,
      name: t("Services.Name1"),
      link: "/Diagnostic.webp",
      description: t("Services.Description1"),
      advantages: [
        t("Services.Advantages1.Av1"),
        t("Services.Advantages1.Av2"),
        t("Services.Advantages1.Av3"),
        t("Services.Advantages1.Av4"),
      ],
    },
    {
      id: 2,
      name: t("Services.Name2"),
      link: "/Prevention.webp",
      description: t("Services.Description2"),
      advantages: [
        t("Services.Advantages2.Av1"),
        t("Services.Advantages2.Av2"),
        t("Services.Advantages2.Av3"),
        t("Services.Advantages2.Av4"),
      ],
    },
    {
      id: 3,
      name: t("Services.Name3"),
      link: "/Orthopedics.webp",
      description: t("Services.Description3"),
      advantages: [
        t("Services.Advantages3.Av1"),
        t("Services.Advantages3.Av2"),
        t("Services.Advantages3.Av3"),
        t("Services.Advantages3.Av4"),
      ],
    },
    {
      id: 4,
      name: t("Services.Name4"),
      link: "/Orthodontic.webp",
      description: t("Services.Description4"),
      advantages: [
        t("Services.Advantages4.Av1"),
        t("Services.Advantages4.Av2"),
        t("Services.Advantages4.Av3"),
        t("Services.Advantages4.Av4"),
      ],
    },
    {
      id: 5,
      name: t("Services.Name5"),
      link: "/Surgery.webp",
      description: t("Services.Description5"),
      advantages: [
        t("Services.Advantages5.Av1"),
        t("Services.Advantages5.Av2"),
        t("Services.Advantages5.Av3"),
        t("Services.Advantages5.Av4"),
      ],
    },
    {
      id: 6,
      name: t("Services.Name6"),
      link: "/Implant.webp",
      description: t("Services.Description6"),
      advantages: [
        t("Services.Advantages6.Av1"),
        t("Services.Advantages6.Av2"),
        t("Services.Advantages6.Av3"),
        t("Services.Advantages6.Av4"),
      ],
    },
    {
      id: 7,
      name: t("Services.Name7"),
      link: "/Gnathology.webp",
      description: t("Services.Description7"),
      advantages: [
        t("Services.Advantages7.Av1"),
        t("Services.Advantages7.Av2"),
        t("Services.Advantages7.Av3"),
        t("Services.Advantages7.Av4"),
      ],
    },
    {
      id: 8,
      name: t("Services.Name8"),
      link: "/Restoration.webp",
      description: t("Services.Description8"),
      advantages: [
        t("Services.Advantages8.Av1"),
        t("Services.Advantages8.Av2"),
        t("Services.Advantages8.Av3"),
        t("Services.Advantages8.Av4"),
      ],
    },
    {
      id: 9,
      name: t("Services.Name9"),
      link: "/Hygiene.webp",
      description: t("Services.Description9"),
      advantages: [
        t("Services.Advantages9.Av1"),
        t("Services.Advantages9.Av2"),
        t("Services.Advantages9.Av3"),
        t("Services.Advantages9.Av4"),
      ],
    },
  ];
  if (isMobile) {
    return (
      <>
        <section className="flex flex-col w-full h-auto py-[5rem] container-padding">
          {/* Title */}
          <div className="flex flex-col w-full max-w-[40rem] lg:max-w-[50rem] h-auto mx-auto m-10">
            <p className="blue-text mx-auto">{t("nameTitle")}</p>
            <h1 className="title-text-m text-center">
              {t("Title1")} <span className="blue-text">{t("Title2")}</span>{" "}
              {t("Title3")}
            </h1>
          </div>
          <div className="flex flex-col w-full h-full items-center">
            <div className="flex flex-col w-full max-w-[30rem] justify-center h-auto my-10">
              <h2 className="blue-text font-medium">{t("menuServices")}</h2>
              <FormControl fullWidth>
                <Select
                  id="service-select"
                  value={idService}
                  displayEmpty
                  onChange={(event) => {
                    const selectedId = event.target.value;
                    setIdService(selectedId);

                    const selected = services.find((s) => s.id === selectedId);
                    if (selected) {
                      setServiceIMG(selected.link);
                      setNameService(selected.name);
                      setDescriptionService(selected.description);
                      setAdvantages(selected.advantages);
                    } else {
                      setServiceIMG("");
                      setNameService("");
                      setDescriptionService("");
                      setAdvantages([]);
                    }
                  }}
                  inputProps={{
                    "aria-label": t("OurServices"),
                    "aria-labelledby": "service-select-label",
                  }}
                  IconComponent={FaChevronDown}
                  sx={{
                    "& .MuiSelect-icon": {
                      color: "#ffffff",
                      fontSize: "2rem",
                      marginRight: "8px",
                    },
                    backgroundColor: "#006eff",
                    color: "#ffffff",
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 600,
                    borderRadius: "10px",
                    textAlign: "center",
                    "& .MuiSelect-select": {
                      textAlign: "center",
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    {t("chooseService")}
                  </MenuItem>
                  {services.map((service) => (
                    <MenuItem key={service.id} value={service.id}>
                      {service.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="flex flex-col w-auto max-w-[55rem] h-auto">
              <div className="flex relative w-full min-h-[25rem] rounded-lg overflow-hidden">
                <Image
                  src={serviceIMG}
                  alt={nameService}
                  priority
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col w-full h-full justify-between">
                <div className="flex flex-col w-full h-auto">
                  <h2 className="text-[2rem] font-bold my-5">{nameService}</h2>
                  <p className="font-normal">{descriptionService}</p>
                </div>
                <div className="flex flex-col w-full justify-end">
                  <h3 className="font-semibold my-5">{t("AdvantageTitle")}</h3>
                  <div className="flex w-full h-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-4 gap-y-5 w-full h-auto">
                      {advantages.map((advantage, index) => (
                        <p key={index} className="flex items-center">
                          <span className="text-[#006eff] text-[2rem] mr-3">
                            <BsCheck2Circle />
                          </span>
                          {advantage}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Our Team Sections */}
        <Team />
        {/* Online Appointment Section */}
        <OnlineAppointment />
        {/* Cases Section */}
        <Cases />
      </>
    );
  }

  if (isDesktop) {
    return (
      <>
        <section className="flex flex-col w-full h-auto py-[5rem] px-[1rem] lg:px-[2rem] xl:px-[10rem] 2xl:px-[20rem]">
          {/* Title */}
          <div className="flex flex-col w-full max-w-[40rem] lg:max-w-[50rem] h-auto mx-auto m-10">
            <p className="blue-text mx-auto">{t("nameTitle")}</p>
            <h1 className="title-text-m sm:title-text text-center">
              {t("Title1")} <span className="blue-text">{t("Title2")}</span>{" "}
              {t("Title3")}
            </h1>
          </div>
          <div className="flex w-full h-full">
            <div className="flex flex-col w-1/3 h-full mr-10">
              <div className="flex flex-col w-full h-[41rem] items-center justify-start border-[1px] shadow-lg rounded-lg bg-[#fdfdfd] mb-4 p-4">
                <h2 className="text-[1.5rem] font-semibold my-4">
                  {t("OurServices")}
                </h2>
                {services.map((service) => (
                  <button
                    onClick={() => {
                      setIdService(service.id);
                      setServiceIMG(service.link);
                      setNameService(service.name);
                      setDescriptionService(service.description);
                      setAdvantages(service.advantages);
                    }}
                    key={service.id}
                    className={`flex w-full h-[2.8rem] justify-center items-center border-[1px] border-[#006eff] rounded-lg my-2 p-3 ${
                      idService === service.id ? "bg-[#006eff] text-white" : ""
                    }`}
                  >
                    <p className="flex w-full font-semibold justify-center items-center text-nowrap ml-[1.5rem]">
                      {service.name}
                    </p>
                    <span
                      className={`${
                        idService === service.id
                          ? "text-white"
                          : "text-[#006eff]"
                      } text-[1.5rem] ml-2`}
                    >
                      <BsArrowRightCircle />
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex flex-col w-full h-[20rem] justify-center items-center border-[1px] shadow-lg rounded-lg bg-[#fdfdfd] mt-4 p-5">
                <div className="flex flex-col w-auto h-auto justify-start">
                  <h3 className="font-semibold mb-3">{t("StepTitle")}</h3>
                  <p className="flex m-3">
                    <span className="flex w-6 h-6 justify-center items-center text-white rounded-full bg-[#006eff] mr-3">
                      1
                    </span>
                    {t("Step1")}
                  </p>
                  <p className="flex m-3">
                    <span className="flex w-6 h-6 justify-center items-center text-white rounded-full bg-[#006eff] mr-3">
                      2
                    </span>
                    {t("Step2")}
                  </p>
                  <p className="flex m-3">
                    <span className="flex w-6 h-6 justify-center items-center text-white rounded-full bg-[#006eff] mr-3">
                      3
                    </span>
                    {t("Step3")}
                  </p>
                  <Link href={`/${locale}/appointment`} className="mt-5">
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
                        {t("appointment")}
                      </Button>
                    </ThemeProvider>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-2/3 h-[64rem]">
              <div className="flex relative w-full min-h-[25rem] rounded-lg overflow-hidden">
                <Image
                  src={serviceIMG}
                  alt="Diagnostic"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col w-full h-full justify-between">
                <div className="flex flex-col w-full h-auto">
                  <h2 className="text-[2rem] font-bold my-5">{nameService}</h2>
                  <p className="font-normal">{descriptionService}</p>
                </div>
                <div className="flex flex-col w-full justify-end">
                  <h3 className="font-semibold my-5">{t("AdvantageTitle")}</h3>
                  <div className="flex w-full h-[10rem]">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-5 w-full h-auto">
                      {advantages.map((advantage, index) => (
                        <p key={index} className="flex items-center">
                          <span className="text-[#006eff] text-[2rem] mr-3">
                            <BsCheck2Circle />
                          </span>
                          {advantage}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Our Team Sections */}
        <Team />
        {/* Online Appointment Section */}
        <OnlineAppointment />
        {/* Cases Section */}
        <Cases />
      </>
    );
  }
};

export default ServicePage;
