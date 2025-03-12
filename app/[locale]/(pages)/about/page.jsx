import SocialAside from "@/components/SocialAside/SocialAside";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  // ------Translations--------//
  const t = useTranslations("About_page");

  return (
    <div className="flex flex-col w-full h-full overflow-x-hidden py-[5rem]">
      {/* -------Social component--------- */}
      <SocialAside />
      {/* ----------Dental clinic section----------- */}
      <div
        id="Up"
        className="flex flex-col sm:flex-row items-center w-full h-auto pr-[2rem] sm:pr-[4rem] py-[4rem]"
      >
        <div className="flex w-full h-full justify-center items-center sm:w-[40%] mr-0 sm:mr-[4rem] xl:mr-[8rem] z-10 order-2 sm:order-1">
          <div className="flex flex-col relative w-auto h-auto pt-[4rem] pl-[4rem] bg-[#ccdde4]">
            <Image
              src="/Dental_Clinic.jpg"
              alt="Dental Clinic"
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
            {t("ModernClinic.title")}
          </h2>
          <p className="text-[#A7ADAF] my-[3rem]">
            {t("ModernClinic.description")}
          </p>
        </div>
      </div>

      {/* ----------Staff section----------- */}
      <div className="flex flex-col sm:flex-row items-center justify-end w-full h-auto pl-[2rem] sm:pl-[4rem] py-[4rem]">
        <div className="flex w-full h-full justify-center items-center sm:w-[40%] mr-0 sm:mr-[4.5rem] ml-0 sm:ml-[4rem] xl:ml-[8rem] z-10 order-2">
          <div className="flex flex-col relative w-auto h-auto pt-[4rem] pr-[4rem] bg-[#ccdde4]">
            <Image
              src="/Team.jpg"
              alt="Team"
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
            {t("Staff.title")}
          </h2>
          <p className="text-[#A7ADAF] my-[3rem]">{t("Staff.description")}</p>
        </div>
      </div>

      {/* ----------Equipment section----------- */}
      <div className="flex flex-col sm:flex-row items-center w-full h-auto pr-[2rem] sm:pr-[4rem] py-[4rem]">
        <div className="flex w-full h-full justify-center items-center sm:w-[40%] mr-0 sm:mr-[4rem] xl:mr-[8rem] z-10 order-2 sm:order-1">
          <div className="flex flex-col relative w-auto h-auto pt-[4rem] pl-[4rem] bg-[#ccdde4]">
            <Image
              src="/Equipment.jpg"
              alt="Equipment"
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
            {t("Euip.title")}
          </h2>
          <p className="text-[#A7ADAF] my-[3rem]">{t("Euip.description")}</p>
        </div>
      </div>

      {/* ----------Services section----------- */}
      <div className="flex flex-col sm:flex-row items-center justify-end w-full h-auto pl-[2rem] sm:pl-[4rem] py-[4rem]">
        <div className="flex w-full h-full justify-center items-center sm:w-[40%] mr-0 sm:mr-[4.5rem] ml-0 sm:ml-[4rem] xl:ml-[8rem] z-10 order-2">
          <div className="flex flex-col relative w-auto h-auto pt-[4rem] pr-[4rem] bg-[#ccdde4]">
            <Image
              src="/Service.jpg"
              alt="Service"
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
            {t("Service.title")}
          </h2>
          <p className="text-[#A7ADAF] my-[3rem]">{t("Service.description")}</p>
        </div>
      </div>

      {/* ----------Comfort section----------- */}
      <div className="flex flex-col sm:flex-row items-center w-full h-auto pr-[2rem] sm:pr-[4rem] py-[4rem]">
        <div className="flex w-full h-full justify-center items-center sm:w-[40%] mr-0 sm:mr-[4rem] xl:mr-[8rem] z-10 order-2 sm:order-1">
          <div className="flex flex-col relative w-auto h-auto pt-[4rem] pl-[4rem] bg-[#ccdde4]">
            <Image
              src="/Comfort.jpg"
              alt="Comfort"
              width={700}
              height={700}
              className="z-30"
            />
            <div className="flex absolute bottom-0 right-0 z-0 w-[4rem] h-full bg-[#fff]"></div>
            <div className="flex absolute bottom-0 left-0 z-0 w-full h-[4rem] bg-[#fff]"></div>
          </div>
        </div>
        <div
          id="Down"
          className="flex flex-col justify-center items-center w-full sm:w-[40%] pl-10 sm:pl-0 order-1 sm:order-2"
        >
          <h2 className="font-bold text-[2rem] md:text-[2.5rem] xl:text-[3rem]">
            {t("Comfort.title")}
          </h2>
          <p className="text-[#A7ADAF] my-[3rem]">{t("Comfort.description")}</p>
        </div>
      </div>
    </div>
  );
}
