"use client";
import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
// -----------Import React Icon--------------//
import { BsCheck2Circle } from "react-icons/bs";
import OnlineAppointment from "@/sections/OnlineAppointment/OnlineAppointment";
import Services from "@/sections/Services/Services";

const Doctors = () => {
  // --------Translations---------//
  const t = useTranslations("DoctorsPage");

  return (
    <>
      <section className="flex flex-col w-full h-auto py-[5rem] container-padding">
        {/* Title */}
        <div className="flex flex-col w-full max-w-[40rem] lg:max-w-[50rem] h-auto mx-auto m-10">
          <p className="blue-text mx-auto">{t("nameTitle")}</p>
          <h1 className="title-text-m sm:title-text text-center">
            {t("Title1")} <span className="blue-text">{t("Title2")}</span>{" "}
          </h1>
          <p className="text-center font-medium m-5">{t("Description")}</p>
        </div>
        {/* Doctor block #1 */}
        <div className="flex flex-col md:flex-row w-full h-auto my-5">
          <div className="flex relative min-w-[17.5rem] w-[17.5rem] h-[22rem] rounded-lg overflow-hidden mb-5 md:mb-0">
            <Image
              src="/Doc1.webp"
              alt="Doctor1"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col w-full h-auto md:min-h-[22rem] justify-between md:pl-[3rem]">
            <div className="flex flex-col">
              <h2>{t("Doctor1.Position")}</h2>
              <h3 className="text-[2rem]">{t("Doctor1.Name")}</h3>
              <p className="my-5">{t("Doctor1.Description")}</p>
            </div>
            <ul className="flex flex-col">
              <li className="flex items-center mb-2">
                <span className="text-[#006eff] text-[2rem] mr-3">
                  <BsCheck2Circle />
                </span>
                {t("Doctor1.qualities1")}
              </li>
              <li className="flex items-center mt-2">
                <span className="text-[#006eff] text-[2rem] mr-3">
                  <BsCheck2Circle />
                </span>
                {t("Doctor1.qualities2")}
              </li>
            </ul>
          </div>
        </div>
        {/* Doctor block #2 */}
        <div className="flex flex-col md:flex-row w-full items-end h-auto my-5">
          <div className="flex order-2 md:order-1 flex-col w-full h-auto md:min-h-[22rem] justify-between items-end md:pr-[3rem]">
            <div className="flex flex-col">
              <h2 className="text-right">{t("Doctor2.Position")}</h2>
              <h3 className="text-[2rem] text-right">{t("Doctor2.Name")}</h3>
              <p className="my-5 text-right">{t("Doctor2.Description")}</p>
            </div>
            <ul className="flex flex-col">
              <li className="flex items-center mb-2">
                <span className="text-[#006eff] text-[2rem] mr-3">
                  <BsCheck2Circle />
                </span>
                {t("Doctor2.qualities1")}
              </li>
              <li className="flex items-center mt-2">
                <span className="text-[#006eff] text-[2rem] mr-3">
                  <BsCheck2Circle />
                </span>
                {t("Doctor2.qualities2")}
              </li>
            </ul>
          </div>
          <div className="flex order-1 md:order-2 relative min-w-[17.5rem] w-[17.5rem] h-[22rem] rounded-lg overflow-hidden mb-5 md:mb-0">
            <Image
              src="/Doc3.webp"
              alt="Doctor3"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
        {/* Doctor block #3 */}
        <div className="flex flex-col md:flex-row w-full h-auto my-5">
          <div className="flex relative min-w-[17.5rem] w-[17.5rem] h-[22rem] rounded-lg overflow-hidden mb-5 md:mb-0">
            <Image
              src="/Doc2.webp"
              alt="Doctor2"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col w-full h-auto md:min-h-[22rem] justify-between md:pl-[3rem]">
            <div className="flex flex-col">
              <h2>{t("Doctor3.Position")}</h2>
              <h3 className="text-[2rem]">{t("Doctor3.Name")}</h3>
              <p className="my-5">{t("Doctor3.Description")}</p>
            </div>
            <ul className="flex flex-col">
              <li className="flex items-center mb-2">
                <span className="text-[#006eff] text-[2rem] mr-3">
                  <BsCheck2Circle />
                </span>
                {t("Doctor3.qualities1")}
              </li>
              <li className="flex items-center mt-2">
                <span className="text-[#006eff] text-[2rem] mr-3">
                  <BsCheck2Circle />
                </span>
                {t("Doctor3.qualities2")}
              </li>
            </ul>
          </div>
        </div>
      </section>
      {/* Online Appointment Section */}
      <OnlineAppointment />
      {/* Services Section */}
      <Services />
    </>
  );
};

export default Doctors;
