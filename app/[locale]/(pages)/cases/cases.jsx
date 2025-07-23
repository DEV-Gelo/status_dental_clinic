"use client";
import React from "react";
import { useTranslations } from "next-intl";
// ------Iternal Component------//
import { Slider } from "@/components/Compare_Image/Slider";
import Services from "@/sections/Services/Services";
import OnlineAppointment from "@/sections/OnlineAppointment/OnlineAppointment";
import Team from "@/sections/Team/Team";

const Cases = () => {
  // ------Translations--------//
  const t = useTranslations("CasesPage");
  return (
    <>
      <section className="flex flex-col w-full h-auto items-center py-16 sm:py-[5rem] container-padding">
        {/* Title */}
        <div className="flex flex-col w-full max-w-[40rem] lg:max-w-[50rem] h-auto items-center m-10">
          <p className="blue-text">{t("nameTitle")}</p>
          <h1 className="title-text-m sm:title-text text-center">
            {t("Title1")} <span className="blue-text">{t("Title2")}</span>{" "}
            {t("Title3")}
          </h1>
        </div>
        {/* Slider + Description block #1 */}
        <div className="flex flex-col lg:flex-row w-full max-w-[44rem] lg:max-w-full h-auto min-h-[30rem] my-5">
          <div className="flex relative w-full lg:w-1/2 h-full">
            <Slider
              Before="/Case1Before.webp"
              After="/Case1After.webp"
              priority
            />
          </div>
          <div className="flex flex-col w-auto lg:w-1/2 h-auto py-5 lg:py-0 lg:pl-5">
            <h2 className="text-[1.5rem] font-semibold leading-tight mb-2">
              {t("DescriptionTitle1")}
            </h2>
            <p>
              <span className="font-semibold">{t("boldText1")}</span>{" "}
              <span>{t("beforeText1")}</span>{" "}
            </p>
            <p className="font-semibold">{t("whatWeDidTitle1")}</p>
            <p>{t("whatWeDidText1")}</p>
            <p className="font-semibold">{t("resultTitle1")}</p>
            <p>{t("resultText1")}</p>
          </div>
        </div>
        {/* Slider + Description block #2 */}
        <div className="flex flex-col lg:flex-row w-full max-w-[44rem] lg:max-w-full h-auto min-h-[30rem] my-5">
          <div className="flex flex-col w-auto lg:w-1/2 h-auto order-2 py-5 lg:py-0 lg:pr-5">
            <h2 className="text-[1.5rem] font-semibold leading-tight mb-2">
              {t("DescriptionTitle2")}
            </h2>
            <p>
              <span className="font-semibold">{t("boldText2")}</span>{" "}
              <span>{t("beforeText2")}</span>{" "}
            </p>
            <p className="font-semibold">{t("whatWeDidTitle2")}</p>
            <p>{t("whatWeDidText2")}</p>
            <p className="font-semibold">{t("resultTitle2")}</p>
            <p>{t("resultText2")}</p>
          </div>
          <div className="flex relative w-full lg:w-1/2 h-full lg:aspect-[70/45] order-1 lg:order-2">
            <Slider Before="/Case3Before.webp" After="/Case3After.webp" />
          </div>
        </div>
        {/* Slider + Description block #3 */}
        <div className="flex flex-col lg:flex-row w-full max-w-[44rem] lg:max-w-full h-auto min-h-[30rem] my-5">
          <div className="flex relative w-full lg:w-1/2 lg:aspect-[70/45]">
            <Slider Before="/Case2Before.webp" After="/Case2After.webp" />
          </div>
          <div className="flex flex-col w-auto lg:w-1/2 h-auto py-5 lg:py-0 lg:pl-5">
            <h2 className="text-[1.5rem] font-semibold leading-tight mb-2">
              {t("DescriptionTitle3")}
            </h2>
            <p>
              <span className="font-semibold">{t("boldText3")}</span>{" "}
              <span>{t("beforeText3")}</span>{" "}
            </p>
            <p className="font-semibold">{t("whatWeDidTitle3")}</p>
            <p>{t("whatWeDidText3")}</p>
            <p className="font-semibold">{t("resultTitle3")}</p>
            <p>{t("resultText3")}</p>
          </div>
        </div>
      </section>
      {/* ------Services Section------- */}
      <Services />
      {/* -----Online Appointment Section----- */}
      <OnlineAppointment />
      {/* -----Team Section----- */}
      <Team />
    </>
  );
};

export default Cases;
