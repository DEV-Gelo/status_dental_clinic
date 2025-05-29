"use client";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
// -----Import Iternal Components-----//
import Advantages from "@/sections/Advantages/Advantages";
import Testimonials from "@/sections/Testimonials/Testimonials";
import OnlineAppointment from "@/sections/OnlineAppointment/OnlineAppointment";
import Team from "@/sections/Team/Team";

export default function AboutPage() {
  // ------Translations--------//
  const t = useTranslations("AboutPage");

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
        {/* Image + Description block #1 */}
        <div className="flex flex-col lg:flex-row w-full h-auto min-h-[25rem]">
          <div className="flex relative w-full lg:w-1/2 aspect-[70/45]">
            <Image
              src="/About3.png"
              alt="Modern dental clinic"
              priority
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col w-auto lg:w-1/2 h-full md:p-[2rem] lg:p-[4rem] py-5">
            <h2 className="text-[1.5rem] lg:text-[2rem] font-semibold leading-tight mb-2">
              {t("DescriptionTitle1")}
            </h2>
            <p>{t("Description1")}</p>
          </div>
        </div>
        {/* Image + Description block #2 */}
        <div className="flex flex-col lg:flex-row w-full h-auto min-h-[25rem]">
          <div className="flex flex-col w-auto lg:w-1/2 h-full order-2 lg:order-1 md:p-[2rem] lg:p-[4rem] py-5">
            <h2 className="text-[1.5rem] lg:text-[2rem] font-semibold leading-tight mb-2">
              {t("DescriptionTitle2")}
            </h2>
            <p>{t("Description2")}</p>
          </div>
          <div className="flex relative w-full lg:w-1/2 aspect-[70/45] order-1 lg:order-2">
            <Image
              src="/About4.png"
              alt="Dental equipment"
              priority
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
        {/* Image + Description block #3 */}
        <div className="flex flex-col lg:flex-row w-full h-auto min-h-[25rem]">
          <div className="flex relative w-full lg:w-1/2 aspect-[70/45]">
            <Image
              src="/About5.jpg"
              alt="Staff"
              priority
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col w-auto lg:w-1/2 h-full md:p-[2rem] lg:p-[4rem] py-5">
            <h2 className="text-[1.5rem] lg:text-[2rem] font-semibold leading-tight mb-2">
              {t("DescriptionTitle3")}
            </h2>
            <p>{t("Description3")}</p>
          </div>
        </div>
      </section>
      {/* Advantages Section */}
      <Advantages />
      {/* Testimonials Section */}
      <Testimonials />
      {/* Online Appointment Section */}
      <OnlineAppointment />
      {/* Team Section */}
      <Team />
    </>
  );
}
