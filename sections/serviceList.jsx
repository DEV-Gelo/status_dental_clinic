import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoArrowRight } from "react-icons/go";
import Image from "next/image";

export const ShortServicesList = () => {
  const pathname = usePathname();
  const local = pathname.split("/")[1];

  const services = [
    {
      id: 1,
      name: "Preventive Care",
      link: `/${local}/service`,
    },
    {
      id: 2,
      name: "Restorative Care",
      link: `/${local}/service`,
    },
    {
      id: 3,
      name: "Orthodontic Care",
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
            Learn More{" "}
            <span className="ml-2">
              <GoArrowRight />
            </span>
          </Link>
        </div>
      ))}
    </>
  );
};
export const ServicesList = () => {
  const pathname = usePathname();
  const local = pathname.split("/")[1];

  const services = [
    {
      id: 1,
      name: "Preventive Care",
      link: `/${local}/service`,
      icon: "/Preventive.svg",
      description:
        "Regular check-ups and fluoride treatments to prevent tooth decay and gum disease.",
    },
    {
      id: 2,
      name: "Restorative Care",
      link: `/${local}/service`,
      icon: "/Restorative.svg",
      description:
        "Fillings, crowns, bridges, and dentures to restore damaged or missing teeth.",
    },
    {
      id: 3,
      name: "Orthodontic Care",
      link: `/${local}/service`,
      icon: "/Orthodontic.svg",
      description:
        "Braces and clear aligners to straighten teeth and correct bite issues.",
    },
    {
      id: 4,
      name: "Oral Surgery",
      link: `/${local}/service`,
      icon: "/Oral.svg",
      description:
        "Extractions, wisdom teeth removal, and other surgical procedures.",
    },
    {
      id: 5,
      name: "Cosmetic Dentistry",
      link: `/${local}/service`,
      icon: "/Cosmetic.svg",
      description:
        "Teeth whitening, veneers, and other procedures to improve the appearance of teeth.",
    },
    {
      id: 6,
      name: "Dental Implants",
      link: `/${local}/service`,
      icon: "/Implants.svg",
      description:
        "Dental implants are a popular and effective way to replace missing teeth.",
    },
  ];

  return (
    <>
      {services.map((item) => (
        <div
          key={item.id}
          className="flex flex-col w-[15rem] h-[11rem] items-start m-[1.5rem]"
        >
          <span>
            <Image src={item.icon} alt="Preventive" width={50} height={50} />
          </span>
          <h6 className="text-[1rem] sm:text-[1.2rem] font-semibold tracking-wide mb-3">
            {item.name}
          </h6>
          <p className="text-[0.8rem] sm:text-[1rem] text-[#A7ADAF] leading-loose">
            {item.description}
          </p>
        </div>
      ))}
    </>
  );
};
