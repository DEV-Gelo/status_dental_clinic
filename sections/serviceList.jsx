import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoArrowRight } from "react-icons/go";
import Image from "next/image";
import { useTranslations } from "next-intl";

export const ShortServicesList = () => {
  const t = useTranslations("Home_page");
  const pathname = usePathname();
  const local = pathname.split("/")[1];

  const services = [
    {
      id: 1,
      name: t("Service.Preventive Care"),
      link: `/${local}/service`,
    },
    {
      id: 2,
      name: t("Service.Restorative Care"),
      link: `/${local}/service`,
    },
    {
      id: 3,
      name: t("Service.Orthodontic Care"),
      link: `/${local}/service`,
    },
  ];

  return (
    <>
      {services.slice(0, 3).map((item) => (
        <div
          key={item.id}
          className="flex flex-col h-[9rem] w-auto justify-center mx-2"
        >
          <span className="text-[1rem] sm:text-[1.2rem] font-bold text-[#5BA3BB]">
            {`0${item.id}.`}
          </span>
          <h6 className="text-[0.8rem] sm:text-[1rem] font-semibold tracking-wide mb-3">
            {item.name}
          </h6>
          <Link
            href={item.link}
            className="flex items-center text-[0.6rem] sm:text-[0.8rem] text-nowrap text-[#A7ADAF] tracking-widest"
          >
            {t("Service.Learn More")}
            <span className="ml-2">
              <GoArrowRight />
            </span>
          </Link>
        </div>
      ))}
    </>
  );
};
export const ServicesList = ({ showDescription = true, centering = false }) => {
  const t = useTranslations("Home_page");
  const pathname = usePathname();
  const local = pathname.split("/")[1];

  const services = [
    {
      id: 1,
      name: t("Service.Preventive Care"),
      link: `/${local}/service`,
      icon: "/Preventive.svg",
      description: t("Service.PreventiveDescription"),
    },
    {
      id: 2,
      name: t("Service.Restorative Care"),
      link: `/${local}/service`,
      icon: "/Restorative.svg",
      description: t("Service.RestorativeDescription"),
    },
    {
      id: 3,
      name: t("Service.Orthodontic Care"),
      link: `/${local}/service`,
      icon: "/Orthodontic.svg",
      description: t("Service.OrthodonticDescription"),
    },
    {
      id: 4,
      name: t("Service.Oral Surgery"),
      link: `/${local}/service`,
      icon: "/Oral.svg",
      description: t("Service.OralDescription"),
    },
    {
      id: 5,
      name: t("Service.Cosmetic Dentistry"),
      link: `/${local}/service`,
      icon: "/Cosmetic.svg",
      description: t("Service.CosmeticDescription"),
    },
    {
      id: 6,
      name: t("Service.Dental Implants"),
      link: `/${local}/service`,
      icon: "/Implants.svg",
      description: t("Service.DentalDescription"),
    },
  ];

  return (
    <>
      {services.map((item) => (
        <div
          key={item.id}
          className={`flex flex-col w-[15rem] h-auto m-[1.5rem] ${
            centering ? "items-center" : "items-start"
          }`}
        >
          <span>
            <Image src={item.icon} alt="Preventive" width={50} height={50} />
          </span>
          <h6 className="text-nowrap text-[1rem] sm:text-[1.2rem] font-semibold tracking-wide mb-3">
            {item.name}
          </h6>
          {showDescription && (
            <p className="text-[0.8rem] sm:text-[1rem] text-[#A7ADAF] leading-loose">
              {item.description}
            </p>
          )}
        </div>
      ))}
    </>
  );
};
