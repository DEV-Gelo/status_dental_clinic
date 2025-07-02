"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
// -----Import React icons---------//
import {
  FaFacebookF,
  FaInstagram,
  FaViber,
  FaTelegramPlane,
} from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import { MdOutlineAccessTime } from "react-icons/md";
import { BiSolidPhone } from "react-icons/bi";

export async function getContactData() {
  const response = await fetch("/api/admin_setting/contact", {
    cache: "force-cache",
  });
  if (!response.ok) throw new Error("Failed to fetch contact data");
  return response.json();
}

const Footer = () => {
  // ----- Get local--------//
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  // ------Translations-----//
  const t = useTranslations("Footer");
  const resurce = [
    { title: t("Resurce.About"), link: `/${locale}/about` },
    { title: t("Resurce.Service"), link: `/${locale}/service` },
    { title: t("Resurce.Doctors"), link: `/${locale}/doctors` },
    { title: t("Resurce.Cases"), link: `/${locale}/cases` },
    { title: t("Resurce.Price"), link: `/${locale}/price` },
    { title: t("Resurce.Contact"), link: `/${locale}/contacts` },
  ];
  const legal = [
    { title: t("Legal.Policy"), link: `/${locale}/polityka_konfidentsiynosti` },
    { title: t("Legal.Agreement"), link: `/${locale}/uhoda_korystuvacha` },
  ];
  // ------------Social network icons--------------//
  const socialIcons = [
    {
      id: 1,
      icon: <FaInstagram />,
      link: "https://www.instagram.com/status.dental.clinic/",
    },
    {
      id: 2,
      icon: <FaFacebookF />,
      link: "https://www.facebook.com/dentalclinicStatus/",
    },
  ];

  return (
    <footer className="flex relative flex-wrap w-full h-auto min-h-[25rem] p-[4rem] justify-between bg-[#000] px-[1rem] lg:px-[2rem] xl:px-[10rem] 2xl:px-[20rem]">
      {/* ------Logo ------ */}
      <div className="flex flex-col w-[15.6rem] m-4 mt-3 pr-4">
        <div className="flex w-[14rem] justify-start items-center mt-1">
          <div className="flex relative w-[44px] h-[60px]">
            <Image
              src="/Tooth.webp"
              alt="logo"
              width={44}
              height={60}
              className="object-contain h-auto"
            />
          </div>
          <Link href="/" className="w-[10rem] ml-2">
            <p className="w-auto text-[1.75rem] text-center leading-none font-astron font-bold blue-text">
              STATUS
            </p>
            <p className="w-auto text-nowrap text-center text-[#fff] leading-none">
              dental clinic
            </p>
          </Link>
        </div>
        {/* Slogan */}
        <p className="flex w-full h-[5rem] justify-start items-center text-[#fff] text-[0.8rem] font-normal mt-5">
          {t("Slogan")}
        </p>

        {/* Social network block */}
        <h3 className="text-[#fff] font-semibold mt-5">{t("StayConnected")}</h3>
        <ul className="flex w-full justify-center items-center gap-10">
          {socialIcons.map((item) => (
            <li key={item.id} className="text-[#fff] text-[2rem] my-2 ">
              <a
                href={item.link}
                rel="noopener noreferrer"
                target="_blank"
                aria-label={item.link.split(".")[0].split("/")[2]}
              >
                {item.icon}
              </a>
            </li>
          ))}
        </ul>
      </div>
      {/* -----Contact + Time block ----- */}
      <div className="flex flex-col w-[15.6rem] m-4">
        {/* Time block*/}
        <div className=" flex flex-col w-auto h-auto text-[#fff] mb-4 mt-0">
          <h3 className="font-semibold  my-2">{t("Time.title")}</h3>
          <p className="my-1">{t("Time.Mon")} | 9:00 - 21:00</p>
          <div className="flex">
            <span className="text-[2.5rem] m-2 ml-0">
              <MdOutlineAccessTime />
            </span>
            <div className="flex flex-col">
              <p className="my-1">{t("Time.Sat")} | 9:00 - 15:00</p>
              <p className="my-1">
                {t("Time.Sun")} | {t("Time.By appointment")}
              </p>
            </div>
          </div>
        </div>
        {/*Contact us block*/}
        <div className=" flex flex-col w-auto h-auto text-[#fff] mt-4">
          <h3 className="font-semibold my-2">{t("ContactTitle")}</h3>
          <p className="flex justify-start items-start my-2">
            <span className="text-[1.5rem] mr-3">
              <FaViber />
            </span>
            <span className="text-[1.5rem] mr-3">
              <FaTelegramPlane />
            </span>
            <span className="text-[1.5rem] mr-3">
              <BiSolidPhone />
            </span>{" "}
            066 766 88 19
          </p>
          <p className="flex justify-start items-start my-2">
            <span className="text-[1.5rem] mr-3">
              <FaViber />
            </span>
            <span className="text-[1.5rem] mr-3">
              <FaTelegramPlane />
            </span>
            <span className="text-[1.5rem] mr-3">
              <BiSolidPhone />
            </span>{" "}
            063 766 88 19
          </p>
        </div>
      </div>
      {/* ------Resurce block ------ */}
      <div className="flex flex-col w-[15.6rem] text-[#fff] m-4">
        <div className="w-auto h-auto md:mx-auto">
          <h3 className="font-semibold text-[#fff] my-2">
            {t("Resurce.title")}
          </h3>
          <ul>
            {resurce.map((item, index) => (
              <li key={index} className="my-3 hover:underline">
                <Link href={item.link}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* -----Legal block----- */}
      <div className="flex flex-col w-[15.6rem] text-[#fff] m-4">
        <h3 className="font-semibold text-[#fff] my-2">{t("Legal.title")}</h3>
        <ul>
          {legal.map((item, index) => (
            <li key={index} className="my-3 hover:underline">
              <Link href={item.link}>{item.title}</Link>
            </li>
          ))}
        </ul>

        {/* E-mail */}
        <p className="flex justify-start items-center text-[#fff] font-normal gap-2 mt-5">
          <span className="text-[2rem]">
            <AiOutlineMail />
          </span>
          <a href="mailto:statusclinic89@gmail.com" className="hover:underline">
            statusclinic89@gmail.com
          </a>
        </p>
      </div>
      <div className="flex absolute bottom-0 left-[10%] w-[80%] h-auto text-[0.8rem] text-[#fdfdfd] justify-center items-center border-white border-t-2 py-5 mx-auto">
        <p>2025 “STATUS” All Rights Received</p>
      </div>
    </footer>
  );
};

export default Footer;
