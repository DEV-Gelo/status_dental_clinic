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
      <section className="flex flex-col w-full h-auto items-center py-10 sm:py-[5rem] container-padding">
        {/* Title */}
        <div className="flex flex-col w-full max-w-[40rem] lg:max-w-[50rem] h-auto items-center m-10">
          <p className="blue-text">{t("nameTitle")}</p>
          <h1 className="title-text-m sm:title-text text-center">
            {t("Title1")} <span className="blue-text">{t("Title2")}</span>{" "}
            {t("Title3")}
          </h1>
        </div>
        {/* Slider + Description block #1 */}
        <div className="flex flex-col lg:flex-row w-full max-w-[48rem] lg:max-w-full h-auto min-h-[22.8rem]">
          <div className="flex relative w-full lg:w-1/2 lg:aspect-[70/45]">
            <Slider Before="/Case1Before.jpg" After="/Case1After.jpg" />
          </div>
          <div className="flex flex-col w-auto lg:w-1/2 h-auto md:p-[2rem] lg:p-[4rem] py-5">
            <h2 className="text-[1.5rem] lg:text-[2rem] font-semibold leading-tight mb-2">
              {t("DescriptionTitle1")}
            </h2>
            <p>{t("Description1")}</p>
          </div>
        </div>
        {/* Slider + Description block #2 */}
        <div className="flex flex-col lg:flex-row w-full max-w-[48rem] lg:max-w-full h-auto min-h-[22.8rem]">
          <div className="flex flex-col w-auto lg:w-1/2 h-full order-2 lg:order-1 md:p-[2rem] lg:p-[4rem] py-5">
            <h2 className="text-[1.5rem] lg:text-[2rem] font-semibold leading-tight mb-2">
              {t("DescriptionTitle2")}
            </h2>
            <p>{t("Description2")}</p>
          </div>
          <div className="flex relative w-full lg:w-1/2 lg:aspect-[70/45] order-1 lg:order-2">
            <Slider Before="/Case2Before.jpg" After="/Case2After.jpg" />
          </div>
        </div>
        {/* Slider + Description block #3 */}
        <div className="flex flex-col lg:flex-row w-full max-w-[48rem] lg:max-w-full h-auto min-h-[22.8rem]">
          <div className="flex relative w-full lg:w-1/2 lg:aspect-[70/45]">
            <Slider Before="/Case3Before.jpg" After="/Case3After.jpg" />
          </div>
          <div className="flex flex-col w-auto lg:w-1/2 h-full md:p-[2rem] lg:p-[4rem] py-5">
            <h2 className="text-[1.5rem] lg:text-[2rem] font-semibold leading-tight mb-2">
              {t("DescriptionTitle3")}
            </h2>
            <p>{t("Description3")}</p>
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
