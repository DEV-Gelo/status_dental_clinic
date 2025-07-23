"use client";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { popup_form_variants } from "@/utils/variants";
// --------------Import MUI components-----------------//
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
// -----------Import React icons--------------//
import { BsArrowDownCircle, BsArrowUpCircle } from "react-icons/bs";
import { BsInfoSquare, BsInfoSquareFill } from "react-icons/bs";
// ----------Import Iternal Components----------//
import OnlineAppointment from "@/sections/OnlineAppointment/OnlineAppointment";
import Cases from "@/sections/Cases/Cases";
import Team from "@/sections/Team/Team";

// Function for receiving category data
const fetchData = async () => {
  const response = await fetch("/api/admin_setting/category");
  if (!response.ok) throw new Error("An error occurred while receiving data");
  return response.json();
};
// Function for receiving pricing data
const fetchPricingData = async () => {
  const response = await fetch("/api/admin_setting/pricing");
  if (!response.ok) throw new Error("An error occurred while receiving data");
  return response.json();
};

const PricePage = () => {
  const [isOpenCategory, setIsOpenCategory] = useState({});
  const [priceID, setPriceID] = useState(null);
  const [isOpenDescription, setIsOpenDescription] = useState(false);
  // ------- Calling function for receiving data from server------------//
  const { data, error } = useSWR("/api/admin_setting/category", fetchData);
  const { data: dataPricing, error: errorPricing } = useSWR(
    "/api/admin_setting/pricing",
    fetchPricingData
  );
  // -----Translations------//
  const t = useTranslations("PricePage");

  useEffect(() => {
    if (isOpenDescription) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpenDescription]);

  const toggleCategory = (categoryId) => {
    setIsOpenCategory((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId], // Toggle status for each category separately
    }));
  };
  const toggleOpenDescription = (id) => {
    setPriceID(id);
    setIsOpenDescription((prev) => !prev);
  };

  return (
    <>
      <section className="flex relative flex-col w-full h-auto items-center py-10 sm:py-[5rem] container-padding">
        {/* Title */}
        <div className="flex flex-col w-full max-w-[40rem] lg:max-w-[50rem] h-auto items-center m-10">
          <p className="blue-text">{t("nameTitle")}</p>
          <h1 className="title-text-m sm:title-text text-center">
            {t("Title1")} <span className="blue-text">{t("Title2")}</span>{" "}
            {t("Title3")}
          </h1>
        </div>
        {!data && !error && (
          <div className="flex justify-center items-center w-full h-full">
            <p className="font-semibold text-[1.5rem]">{t("loading")}</p>
            <CircularProgress size="1rem" />
          </div>
        )}
        {error && (
          <div className="flex justify-center items-center w-full h-full">
            <Alert
              className="flex justify-center items-center"
              severity="warning"
            >
              <p>{t("Error loading data")}</p>
            </Alert>
          </div>
        )}
        <div
          id="Down"
          className="flex flex-wrap w-full h-auto min-h-[38rem] justify-center items-center"
        >
          {!error &&
            data
              ?.sort((a, b) => a.order - b.order)
              .map((category) => (
                <div
                  key={category.id}
                  className="flex flex-col w-full h-auto my-2 mx-[1rem] sm:mx-[4rem] lg:mx-[8rem] border-[1px] border-[#006eff] rounded-md cursor-pointer overflow-hidden"
                >
                  <div
                    onClick={() => toggleCategory(category.id)}
                    className={`flex w-full h-[3rem] justify-end items-center p-5 ${
                      isOpenCategory[category.id] ? "bg-[#006eff]" : "bg-white"
                    }`}
                  >
                    <h2
                      className={`font-semibold text-[1rem] sm:text-[1.25rem] mx-auto ${
                        isOpenCategory[category.id]
                          ? "text-white"
                          : "text-black"
                      }`}
                    >
                      {category.name}
                    </h2>
                    <span
                      className={`text-[1.5rem] ${
                        isOpenCategory[category.id] ? "text-white" : "blue-text"
                      }`}
                    >
                      {isOpenCategory[category.id] ? (
                        <BsArrowUpCircle />
                      ) : (
                        <BsArrowDownCircle />
                      )}
                    </span>
                  </div>
                  <AnimatePresence mode="wait">
                    {isOpenCategory[category.id] && (
                      <motion.ul
                        key={category.id} // Unique `key` for correct animation
                        initial="closed"
                        animate="open"
                        exit="closed" // Using `exit` for a graceful shutdown
                        variants={popup_form_variants}
                        className="overflow-hidden cursor-default"
                      >
                        {dataPricing &&
                          dataPricing
                            .filter(
                              (pricing) => pricing.categoryId === category.id
                            )
                            .sort((a, b) => a.id - b.id) // fixed order
                            .map((pricing, index) => (
                              <li
                                key={pricing.id}
                                className="flex w-full min-h-[3rem] justify-between border-b-[1px] items-center px-1 sm:px-5 py-2"
                              >
                                {/* -----Service name----- */}
                                <p className="flex mx-2">
                                  <span className="min-w-6">
                                    {index + 1 + "."}
                                  </span>
                                  {/* -----Information Icon----- */}
                                  {pricing.description && (
                                    <span
                                      onClick={() =>
                                        toggleOpenDescription(pricing.id)
                                      }
                                      className="group relative flex justify-center items-center mx-2 cursor-pointer text-[#006eff]"
                                    >
                                      <BsInfoSquare className="block group-hover:hidden" />
                                      <BsInfoSquareFill className="hidden group-hover:block" />
                                    </span>
                                  )}
                                  {pricing.name}
                                </p>{" "}
                                {/* -----Price----- */}
                                <p className="flex text-nowrap mx-2">
                                  {pricing.price}
                                  {/* <span>{t("currence")}</span>{" "} */}
                                </p>
                              </li>
                            ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ))}
        </div>
        {/* -----Description window----- */}
        {isOpenDescription && (
          <div className="fixed inset-0 z-50 bg-white/30 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full border-[#006eff] border-[1px] mx-4">
              <div className="flex justify-end p-1">
                <IconButton
                  onClick={() => setIsOpenDescription(false)}
                  size="small"
                  edge="start"
                  color="inherit"
                  aria-label="close"
                  className="text-[#44444495]"
                  title={t("close")}
                >
                  <CloseIcon />
                </IconButton>
              </div>
              {/* Access to description via ID */}
              <p className="flex p-6 pt-0">
                {dataPricing?.find((item) => item.id === priceID)
                  ?.description ?? ""}
              </p>
            </div>
          </div>
        )}
      </section>
      {/* -----Online Appointment Section----- */}
      <OnlineAppointment />
      {/* -----Cases Section----- */}
      <Cases />
      {/* -----Team Section----- */}
      <Team />
    </>
  );
};

export default PricePage;
