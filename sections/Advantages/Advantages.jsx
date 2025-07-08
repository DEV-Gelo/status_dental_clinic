import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const Advantages = () => {
  // -----Translations--------//
  const t = useTranslations("AdvantagesSection");
  return (
    <>
      <section className="hidden md:flex w-full h-[12.5rem] justify-between items-center bg-[#006eff] px-[1rem] lg:px-[2rem] xl:px-[10rem] 2xl:px-[20rem]">
        <div className="flex flex-col w-[7rem] h-auto justify-center items-start text-white m-[1rem]">
          <div className="flex relative w-[2.5rem] h-[3.125rem]">
            <Image
              src="/Patients.svg"
              alt="patients"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <p className="text-nowrap font-astron text-[2rem] mt-3">1575 +</p>
          <p className="">{t("Title1")}</p>
        </div>
        <div className="flex flex-col w-[7rem] h-auto justify-center items-start text-white m-[1rem]">
          <div className="flex relative w-[3.125rem] h-[3.125rem]">
            <Image
              src="/Services.svg"
              alt="services"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <p className="text-nowrap font-astron text-[2rem] mt-3">1795 +</p>
          <p className="">{t("Title2")}</p>
        </div>
        <div className="flex flex-col w-[7rem] h-auto justify-center items-start text-white m-[1rem]">
          <div className="flex relative w-[3.125rem] h-[3.125rem]">
            <Image
              src="/Experience.svg"
              alt="experience"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <p className="text-nowrap font-astron text-[2rem] mt-3">15 +</p>
          <p className="">{t("Title3")}</p>
        </div>
        <div className="flex flex-col w-[7rem] h-auto justify-center items-start text-white m-[1rem]">
          <div className="flex relative w-[3.125rem] h-[3.125rem]">
            <Image
              src="/Staff.svg"
              alt="staff"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <p className="text-nowrap font-astron text-[2rem] mt-3">10 +</p>
          <p className="">{t("Title4")}</p>
        </div>
      </section>
    </>
  );
};

export default Advantages;
