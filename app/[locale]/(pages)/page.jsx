"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ServicesList, ShortServicesList } from "@/sections/serviceList";
import { useTranslations } from "next-intl";
import SocialAside from "@/components/SocialAside/SocialAside";

// -----------Import MUI components--------------//
import Button from "@mui/material/Button";
// -----Import React icons---------//
import { BiSolidQuoteAltLeft } from "react-icons/bi";

const Home = () => {
  // -----Translations--------//
  const t = useTranslations("Home_page");

  return (
    <div className="flex flex-col w-full h-full overflow-x-hidden">
      {/* ------------Social component----------- */}
      <SocialAside />

      {/*-------- Treat yourself sections -----------*/}
      <div
        id="Up"
        className="flex flex-col xl:flex-row h-auto xl:h-[49.5rem] w-full justify-end px-[2rem] sm:px-[4rem]"
      >
        <div className="flex h-full w-full xl:w-[45%] flex-col ">
          <div className="flex w-full h-[5rem] bg-[#fff]"></div>
          <div className="flex relative flex-col w-full h-full justify-start items-start">
            <h1 className="w-full sm:w-[26rem] absolute top-0 sm:top-10 left-5 text-center sm:text-left text-[2.5rem] sm:text-[4rem] font-bold pr-[2.5rem] sm:pr-0">
              {t("mainTitle.treatYourself")}{" "}
              <span className="text-[#5ba3bb]">{t("mainTitle.white")}</span>{" "}
              {t("mainTitle.smile")}
            </h1>
            <div className="flex w-full h-auto justify-end items-center">
              <div className="flex w-[8.9rem] h-[8.9rem] bg-[#fff]" />
              <div className="hidden sm:flex w-[8.9rem] h-[8.9rem] bg-[#5ba3bb]" />
            </div>
            <div className="flex w-full h-auto justify-end items-center">
              <div className="flex w-[8.9rem] h-[8.9rem] bg-[#fff]" />
              <div className="hidden sm:flex w-[8.9rem] h-[8.9rem] bg-[#ccdde4]" />
              <div className="hidden sm:flex w-[8.9rem] h-[8.9rem] bg-[#5ba3bb]" />
            </div>
            <div className="hidden sm:flex w-full h-auto justify-end items-center">
              <div className="hidden xl:hidden lg:flex w-[8.9rem] h-[8.9rem] bg-[#ccdde4]" />
              <div className="flex w-[8.9rem] h-[8.9rem] bg-[#fff]" />
              <div className="hidden lg:flex w-[8.9rem] h-[8.9rem] bg-[#ccdde4]" />
            </div>
            <div className="flex w-full h-auto min-h-[9.5rem] justify-between items-center px-[1rem] sm:px-[4rem]">
              <ShortServicesList />
            </div>
            <div className="hidden xl:flex w-full h-auto justify-end items-center">
              <div className="flex w-[8.9rem] h-[8.9rem] bg-[#5ba3bb]" />
              <div className="flex w-[8.9rem] h-[8.9rem] bg-[#ccdde4]" />
            </div>
          </div>
        </div>
        <div className="flex relative w-full xl:w-[55%] flex-col h-full">
          <div className="hidden xl:flex w-full h-[5rem] bg-[#ccdde4]" />
          <div className="hidden sm:flex absolute top-[4.5rem] left-0 w-[8.9rem] h-[8.9rem] bg-[#ccdde4]" />
          <div className="hidden sm:flex absolute bottom-0 right-0 w-[8.9rem] h-[8.9rem] bg-[#ccdde470]" />
          <div className="hidden sm:flex absolute bottom-0 right-[17.8rem] w-[8.9rem] h-[8.9rem] bg-[#ccdde470]" />
          <div className="hidden sm:flex absolute bottom-[8.9rem] right-[8.9rem] w-[8.9rem] h-[8.9rem] bg-[#ccdde470]" />
          <div className="flex w-full h-full">
            <Image
              src="/MainImage.jpg"
              alt="Smile"
              width={1000}
              height={1000}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
      {/* ----------Expert dental section----------- */}
      <div className="flex flex-col sm:flex-row items-center w-full h-auto sm:h-[47.5rem] my-[2rem] lg:my-[4rem] xl:my-[8rem] pr-[2rem] sm:pr-[4rem] py-[4rem]">
        <div className="flex w-full h-full justify-center items-center sm:w-[40%] mr-0 sm:mr-[4rem] xl:mr-[8rem] z-10 order-2 sm:order-1">
          <div className="flex flex-col relative w-auto h-auto pt-[4rem] pl-[4rem] bg-[#ccdde4]">
            <Image
              src="/Expert dental.jpg"
              alt="Expert dental"
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
            {t("ExpertDental.title")}
          </h2>
          <p className="text-[#A7ADAF] my-[3rem]">
            {t("ExpertDental.descriptions")}
          </p>
          <div className="hidden sm:flex lg:flex-row sm:flex-col w-full h-auto items-center p-2">
            <Button
              size="large"
              variant="contained"
              className="text-nowrap blue rounded-none mb-5 mr-0 lg:mr-5"
            >
              {t("ExpertDental.buttonName")}
            </Button>
            <Link
              href="#"
              className="font-semibold text-[#5ba3bb] text-nowrap underline underline-offset-8 decoration-4 ml-0 lg:ml-5 mb-5"
            >
              {t("ExpertDental.Learn More")}
            </Link>
          </div>
        </div>
        <div className="flex sm:hidden w-full h-auto justify-center items-center order-3 my-5">
          <Button
            size="large"
            variant="contained"
            className="text-nowrap blue text-[0.8rem] rounded-none mr-5"
          >
            {t("ExpertDental.buttonName")}
          </Button>
          <Link
            href="#"
            className="font-semibold text-[#5ba3bb] text-[0.8rem] text-nowrap underline underline-offset-4 decoration-2 ml-5"
          >
            {t("ExpertDental.Learn More")}
          </Link>
        </div>
      </div>
      {/* ------Everything you need section -------- */}
      <div className="flex flex-col lg:flex-row w-full h-auto bg-[#ccdde470] px-[4rem] py-[2rem] sm:py-[6rem]">
        <div className="flex w-full lg:w-[30%] h-auto justify-center pr-10 py-[2rem]">
          <h2 className="font-bold text-[2rem] md:text-[2.5rem] xl:text-[3rem]">
            {t("Service.ServiceTitle")}
          </h2>
        </div>
        <div className="flex justify-center w-full lg:w-[70%] h-full flex-wrap">
          <ServicesList />
        </div>
      </div>
      {/* ---------Professionals section------------ */}
      <div className="flex flex-col lg:flex-row w-full h-auto items-center p-[2rem] sm:p-[6rem]">
        <div className="flex relative w-full h-auto sm:w-[30rem] sm:h-[33rem] order-2 lg:order-1">
          <div className="hidden lg:flex absolute top-[-8rem] left-[2rem] w-[87%] h-full lg:h-[90%] xl:h-full border-[1px] border-[#5BA3BB]" />
          <div className="flex lg:absolute top-[-10rem] left-0 w-full h-full pr-0 sm:pr-[4rem] lg:pb-[4rem] xl:pb-0">
            <Image
              src="/Professionals.jpg"
              alt="Professionals"
              width={500}
              height={500}
            />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-full sm:w-[65%] lg:pl-[4rem] xl:pl-[8rem] order-1 lg:order-2">
          <h2 className="font-bold text-[2rem] md:text-[2.5rem] xl:text-[3rem]">
            {t("Professionals.title")}
          </h2>
          <p className="text-[#A7ADAF] my-[3rem]">
            {t("Professionals.descriptions")}
          </p>
          <div className="hidden lg:flex lg:flex-row sm:flex-col w-full h-auto items-center p-2">
            <Button
              size="large"
              variant="contained"
              className="text-nowrap blue rounded-none mb-5 mr-0 lg:mr-5"
            >
              {t("Professionals.buttonName")}
            </Button>
          </div>
        </div>
      </div>
      {/* -----------Be featured sections-------------- */}
      <div className="hidden sm:flex w-full h-auto px-[4rem] mb-[6rem]">
        <div className="flex items-end w-[60%] h-full pt-[8rem]">
          <div className="flex w-auto h-full items-end justify-start">
            <p className="[writing-mode:vertical-lr]  [direction:ltr] font-medium">
              {t("Review.wName")}
            </p>
          </div>
          <div className="flex mr-[6rem]">
            <Image
              src="/AnnaMarie.jpg"
              alt="AnnaMarie"
              width={500}
              height={500}
            />
          </div>
        </div>
        <div className="flex relative flex-col items-end w-[50%] h-full">
          <div className="absolute top-0 left-[-14rem]">
            <h2 className="font-bold text-[2rem] lg:text-[2.5rem] xl:text-[3rem]">
              {t("Review.Be featured")}
            </h2>
            <h2 className="font-bold text-[2rem] lg:text-[2.5rem] xl:text-[3rem] text-[#5BA3BB]">
              {t("Review.happysmile")}
            </h2>
          </div>
          <div className="flex w-[80%] mr-5">
            <Image
              src="/MarcoPolono.jpg"
              alt="MarcoPolono"
              width={500}
              height={500}
            />
            <div className="flex w-auto h-full items-start justify-end">
              <p className="[writing-mode:vertical-lr]  [direction:ltr] font-medium">
                {t("Review.mName")}
              </p>
            </div>
          </div>
          <div className="flex relative w-full h-full items-center py-16">
            <span className="absolute top-[-1rem] lg:top-7 left-[-2.5rem] text-[#5ba3bb50] text-[4rem]">
              <BiSolidQuoteAltLeft />
            </span>
            <p className="font-secondary italic text-[2rem] xl:text-[2rem] text-[#5ba3bb] mr-2">
              {t("Review.feedback")}
            </p>
          </div>
        </div>
      </div>
      {/* -----------Be featured < 640px -------------- */}
      <div className="flex sm:hidden flex-col w-full h-auto mb-[4rem] px-[2rem]">
        <div className="flex items-end w-full h-full">
          <div className="flex w-auto h-full items-end justify-start">
            <p className="[writing-mode:vertical-lr]  [direction:ltr] font-medium">
              {t("Review.wName")}
            </p>
          </div>
          <div className="flex mr-[1rem]">
            <Image
              src="/AnnaMarie.jpg"
              alt="AnnaMarie"
              width={500}
              height={500}
            />
          </div>
          <div className="flex relative w-full h-full items-center pr-5">
            <span className="absolute top-[-1rem] left-0 text-[#5ba3bb50] text-[2rem]">
              <BiSolidQuoteAltLeft />
            </span>
            <p className="font-secondary italic tetx-[1rem] xs:text-[1.5rem] text-[#5ba3bb]">
              {t("Review.feedback")}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end w-full h-full">
          <div className="">
            <h2 className="font-bold text-[2rem] ">
              {t("Review.Be featured")}
            </h2>
            <h2 className="font-bold text-[2rem]  text-[#5BA3BB]">
              {t("Review.happysmile")}
            </h2>
          </div>
          <div className="flex w-[80%]">
            <Image
              src="/MarcoPolono.jpg"
              alt="MarcoPolono"
              width={500}
              height={500}
            />
            <div className="flex w-auto h-full items-start justify-end">
              <p className="[writing-mode:vertical-lr]  [direction:ltr] font-medium">
                {t("Review.mName")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div id="Down" />
      </div>
    </div>
  );
};

export default Home;
