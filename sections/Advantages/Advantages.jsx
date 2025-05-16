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
          <Image src="/Patients.svg" alt="patients" width={40} height={50} />
          <p className="text-nowrap font-astron text-[2rem] mt-3">750 +</p>
          <p className="">{t("Title1")}</p>
        </div>
        <div className="flex flex-col w-[7rem] h-auto justify-center items-start text-white m-[1rem]">
          <Image src="/Services.svg" alt="patients" width={50} height={50} />
          <p className="text-nowrap font-astron text-[2rem] mt-3">985 +</p>
          <p className="">{t("Title2")}</p>
        </div>
        <div className="flex flex-col w-[7rem] h-auto justify-center items-start text-white m-[1rem]">
          <Image src="/Experience.svg" alt="patients" width={50} height={50} />
          <p className="text-nowrap font-astron text-[2rem] mt-3">10 +</p>
          <p className="">{t("Title3")}</p>
        </div>
        <div className="flex flex-col w-[7rem] h-auto justify-center items-start text-white m-[1rem]">
          <Image src="/Staff.svg" alt="patients" width={50} height={50} />
          <p className="text-nowrap font-astron text-[2rem] mt-3">50 +</p>
          <p className="">{t("Title4")}</p>
        </div>
      </section>
    </>
  );
};

export default Advantages;
