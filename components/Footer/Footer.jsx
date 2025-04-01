"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
// -----Import React icons---------//
import {
  FaFacebookF,
  FaInstagramSquare,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import { LiaPhoneSolid } from "react-icons/lia";

const Footer = () => {
  const [contactData, setContactData] = useState([]);
  // ----- Get local--------//
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  // ------Translations-----//
  const t = useTranslations("Footer");

  const patientInformation = [
    { title: t("PatientInfo.AboutUs"), link: `/${locale}/about` },
    { title: t("PatientInfo.History"), link: "#" },
    { title: t("PatientInfo.B/A"), link: "#" },
    { title: t("PatientInfo.Testimonials"), link: "#" },
    { title: t("PatientInfo.Contact"), link: `/${locale}/contacts` },
  ];
  const services = [
    { title: t("Services.PreventiveCare"), link: "#" },
    { title: t("Services.ImplantDentistry"), link: "#" },
    { title: t("Services.CosmeticDentistry"), link: "#" },
    { title: t("Services.ClearBraces"), link: "#" },
    { title: t("Services.DentalEmergency"), link: "#" },
  ];
  const legal = [
    { title: t("Legal.PrivacyPolicy"), link: "#" },
    { title: t("Legal.Terms"), link: "#" },
    { title: t("Legal.Insurance"), link: "#" },
  ];
  // ------------Social network icons--------------//
  const socialIcons = [
    { id: 1, icon: <FaFacebookF />, link: "https://facebook.com" },
    { id: 2, icon: <FaInstagramSquare />, link: "https://instagram.com" },
    { id: 3, icon: <FaYoutube />, link: "https://youtube.com" },
    { id: 4, icon: <FaTwitter />, link: "https://twitter.com" },
  ];
  //   -------- Fetch contact data ---------------//
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/admin_setting/contact");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "An error occurred while receiving data"
          );
        }
        const data = await response.json();
        setContactData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-wrap w-full min-h-[25rem] p-[4rem] justify-between bg-[#000]">
      <div className=" flex flex-col w-auto h-auto p-2 m-2">
        <h4 className="font-semibold text-[1.2rem] text-[#fff] my-2">
          {t("PatientInfo.title")}
        </h4>
        <ul>
          {patientInformation.map((item, index) => (
            <li key={index} className="text-[#A7ADAF] my-1">
              <Link href={item.link}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className=" flex flex-col w-auto h-auto p-2 m-2">
        <h4 className="font-semibold text-[1.2rem] text-[#fff] my-2">
          {t("Services.title")}
        </h4>
        <ul>
          {services.map((item, index) => (
            <li key={index} className="text-[#A7ADAF] my-1">
              <Link href={item.link}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className=" flex flex-col w-auto h-auto p-2 m-2">
        <h4 className="font-semibold text-[1.2rem] text-[#fff] my-2">
          {t("Legal.title")}
        </h4>
        <ul>
          {legal.map((item, index) => (
            <li key={index} className="text-[#A7ADAF] my-1">
              <Link href={item.link}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className=" flex flex-col w-auto h-auto p-2 m-2">
        <h4 className="font-semibold text-[1.2rem] text-[#fff] my-2">
          {t("ContactTitle")}
        </h4>
        {contactData.length > 0 && (
          <ul>
            <li className="text-[#A7ADAF] my-2 ">{contactData[0].country}</li>
            <li className="text-[#A7ADAF] my-2 ">
              {contactData[0].city} {contactData[0].zipcode}
            </li>
            <li className="text-[#A7ADAF] my-2 ">
              {contactData[0].street} {contactData[0].house}{" "}
              {contactData[0].office}
            </li>
            <li className="flex items-center text-[#A7ADAF] my-2 ">
              <AiOutlineMail /> &nbsp; {contactData[0].email}
            </li>
            <li className="flex flex-col text-[#A7ADAF] my-2 ">
              {contactData[0]?.phoneNumbers?.map((number, index) => (
                <span key={index} className="flex items-center">
                  <LiaPhoneSolid /> &nbsp; {number}
                </span>
              ))}
            </li>
          </ul>
        )}
      </div>
      <div className=" flex flex-col w-auto h-auto p-2 m-2">
        <h4 className="font-semibold text-[1.2rem] text-[#fff] my-2">
          {t("StayConnected")}
        </h4>
        <ul className="flex justify-between gap-10">
          {socialIcons.map((item) => (
            <li key={item.id} className="text-[#A7ADAF] my-2 ">
              <Link href={item.link}>{item.icon}</Link>
            </li>
          ))}
        </ul>
        <div className="flex justify-end">
          <p className="text-[#A7ADAF] text-[0.8rem] my-1">
            Copyright © 2023 DentaPro.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
