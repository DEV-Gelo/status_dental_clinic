"use client";
import SocialAside from "@/components/SocialAside/SocialAside";
import { ServicesList } from "@/sections/serviceList";
import Image from "next/image";
import { useTranslations } from "next-intl";

const ServicePage = () => {
  // --------Translations---------//
  const t = useTranslations("Service_page");

  return (
    <div className="flex flex-col w-full h-full overflow-x-hidden py-[5rem]">
      {/* -------Social component--------- */}
      <SocialAside />
      {/* ------Our service section -------- */}
      <div
        id="Up"
        className="flex flex-col w-full h-auto justify-center items-center bg-[#ccdde470] px-[4rem] py-[2rem] sm:py-[7.5rem]"
      >
        <h2 className="font-bold text-[2rem] md:text-[2.5rem] xl:text-[3rem] mb-8">
          {t("title")}
        </h2>

        <div className="flex justify-center w-full h-full flex-wrap">
          <ServicesList showDescription={false} centering={true} />
        </div>
      </div>
      {/* ----------Preventive Care section----------- */}
      <div className="flex flex-col sm:flex-row items-center w-full h-auto pr-[2rem] sm:pr-[4rem] py-[4rem]">
        <div className="flex w-full h-full justify-center items-center sm:w-[40%] mr-0 sm:mr-[4rem] xl:mr-[8rem] z-10 order-2 sm:order-1">
          <div className="flex flex-col relative w-auto h-auto pt-[4rem] pl-[4rem] bg-[#ccdde4]">
            <Image
              src="/Preventive_Care.jpg"
              alt="Preventive Care"
              width={700}
              height={700}
              className="z-30"
            />
            <div className="flex absolute bottom-0 right-0 z-0 w-[4rem] h-full bg-[#fff]"></div>
            <div className="flex absolute bottom-0 left-0 z-0 w-full h-[4rem] bg-[#fff]"></div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-full sm:w-[40%] pl-10 sm:pl-0 order-1 sm:order-2">
          <h2 className="font-bold text-[2rem] md:text-[2.5rem] xl:text-[3rem]">
            {t("PreventiveCare.title")}
          </h2>
          <p className="text-[#A7ADAF] my-[3rem]">
            {t("PreventiveCare.description")}
          </p>
        </div>
      </div>

      {/* ----------Restorative Care section----------- */}
      <div className="flex flex-col sm:flex-row items-center justify-end w-full h-auto pl-[2rem] sm:pl-[4rem] py-[4rem]">
        <div className="flex w-full h-full justify-center items-center sm:w-[40%] mr-0 sm:mr-[4.5rem] ml-0 sm:ml-[4rem] xl:ml-[8rem] z-10 order-2">
          <div className="flex flex-col relative w-auto h-auto pt-[4rem] pr-[4rem] bg-[#ccdde4]">
            <Image
              src="/Restorative_Care.jpg"
              alt="Restorative Care"
              width={700}
              height={700}
              className="z-30"
            />
            <div className="flex absolute bottom-0 left-0 z-0 w-[4rem] h-full bg-[#fff]"></div>
            <div className="flex absolute bottom-0 right-0 z-0 w-full h-[4rem] bg-[#fff]"></div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-full sm:w-[40%] pr-8 sm:pr-0 order-1">
          <h2 className="font-bold text-[2rem] md:text-[2.5rem] xl:text-[3rem]">
            {t("RestorativeCare.title")}
          </h2>
          <p className="text-[#A7ADAF] my-[3rem]">
            {t("RestorativeCare.description")}
          </p>
        </div>
      </div>

      {/* ----------Orthodontic Care section----------- */}
      <div className="flex flex-col sm:flex-row items-center w-full h-auto pr-[2rem] sm:pr-[4rem] py-[4rem]">
        <div className="flex w-full h-full justify-center items-center sm:w-[40%] mr-0 sm:mr-[4rem] xl:mr-[8rem] z-10 order-2 sm:order-1">
          <div className="flex flex-col relative w-auto h-auto pt-[4rem] pl-[4rem] bg-[#ccdde4]">
            <Image
              src="/Orthodontic.jpg"
              alt="Orthodontic"
              width={700}
              height={700}
              className="z-30"
            />
            <div className="flex absolute bottom-0 right-0 z-0 w-[4rem] h-full bg-[#fff]"></div>
            <div className="flex absolute bottom-0 left-0 z-0 w-full h-[4rem] bg-[#fff]"></div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-full sm:w-[40%] pl-10 sm:pl-0 order-1 sm:order-2">
          <h2 className="font-bold text-[2rem] md:text-[2.5rem] xl:text-[3rem]">
            {t("OrthodonticCare.title")}
          </h2>
          <p className="text-[#A7ADAF] my-[3rem]">
            {t("OrthodonticCare.description")}
          </p>
        </div>
      </div>

      {/* ----------Oral Surgery section----------- */}
      <div className="flex flex-col sm:flex-row items-center justify-end w-full h-auto pl-[2rem] sm:pl-[4rem] py-[4rem]">
        <div className="flex w-full h-full justify-center items-center sm:w-[40%] mr-0 sm:mr-[4.5rem] ml-0 sm:ml-[4rem] xl:ml-[8rem] z-10 order-2">
          <div className="flex flex-col relative w-auto h-auto pt-[4rem] pr-[4rem] bg-[#ccdde4]">
            <Image
              src="/Oral_Surgery.jpg"
              alt="Oral Surgery"
              width={700}
              height={700}
              className="z-30"
            />
            <div className="flex absolute bottom-0 left-0 z-0 w-[4rem] h-full bg-[#fff]"></div>
            <div className="flex absolute bottom-0 right-0 z-0 w-full h-[4rem] bg-[#fff]"></div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-full sm:w-[40%] pr-8 sm:pr-0 order-1">
          <h2 className="font-bold text-[2rem] md:text-[2.5rem] xl:text-[3rem]">
            {t("OralSurgery.title")}
          </h2>
          <p className="text-[#A7ADAF] my-[3rem]">
            {t("OralSurgery.description")}
          </p>
        </div>
      </div>

      {/* ----------Cosmetic Dentistry section----------- */}
      <div className="flex flex-col sm:flex-row items-center w-full h-auto pr-[2rem] sm:pr-[4rem] py-[4rem]">
        <div className="flex w-full h-full justify-center items-center sm:w-[40%] mr-0 sm:mr-[4rem] xl:mr-[8rem] z-10 order-2 sm:order-1">
          <div className="flex flex-col relative w-auto h-auto pt-[4rem] pl-[4rem] bg-[#ccdde4]">
            <Image
              src="/Cosmetic_Dentistry.jpg"
              alt="Cosmetic Dentistry"
              width={700}
              height={700}
              className="z-30"
            />
            <div className="flex absolute bottom-0 right-0 z-0 w-[4rem] h-full bg-[#fff]"></div>
            <div className="flex absolute bottom-0 left-0 z-0 w-full h-[4rem] bg-[#fff]"></div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-full sm:w-[40%] pl-10 sm:pl-0 order-1 sm:order-2">
          <h2 className="font-bold text-[2rem] md:text-[2.5rem] xl:text-[3rem]">
            {t("CosmeticDentistry.title")}
          </h2>
          <p className="text-[#A7ADAF] my-[3rem]">
            {t("CosmeticDentistry.description")}
          </p>
        </div>
      </div>
      {/* ----------Dental Implants section----------- */}
      <div className="flex flex-col sm:flex-row items-center justify-end w-full h-auto pl-[2rem] sm:pl-[4rem] py-[4rem]">
        <div className="flex w-full h-full justify-center items-center sm:w-[40%] mr-0 sm:mr-[4.5rem] ml-0 sm:ml-[4rem] xl:ml-[8rem] z-10 order-2">
          <div className="flex flex-col relative w-auto h-auto pt-[4rem] pr-[4rem] bg-[#ccdde4]">
            <Image
              src="/Dental_Implants.jpg"
              alt="Dental Implants"
              width={700}
              height={700}
              className="z-30"
            />
            <div className="flex absolute bottom-0 left-0 z-0 w-[4rem] h-full bg-[#fff]"></div>
            <div className="flex absolute bottom-0 right-0 z-0 w-full h-[4rem] bg-[#fff]"></div>
          </div>
        </div>
        <div
          id="Down"
          className="flex flex-col justify-center items-center w-full sm:w-[40%] pr-8 sm:pr-0 order-1"
        >
          <h2 className="font-bold text-[2rem] md:text-[2.5rem] xl:text-[3rem]">
            {t("DentalImplants.title")}
          </h2>
          <p className="text-[#A7ADAF] my-[3rem]">
            {t("DentalImplants.description")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;
