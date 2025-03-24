"use client";
import React, { useState } from "react";
import useSWR from "swr";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { popup_form_variants } from "@/utils/variants";
import SocialAside from "@/components/SocialAside/SocialAside";
// --------------Import MUI components-----------------//
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

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
  // ------- Calling function for receiving data from server------------//
  const { data, error } = useSWR("/api/admin_setting/category", fetchData);
  const { data: dataPricing, error: errorPricing } = useSWR(
    "/api/admin_setting/pricing",
    fetchPricingData
  );
  // -----Translations------//
  const t = useTranslations("Price_page");

  const toggleCategory = (categoryId) => {
    setIsOpenCategory((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId], // Toggle status for each category separately
    }));
  };

  return (
    <>
      <div className="flex flex-col w-full min-h-[100vh] justify-center items-center py-[5rem] px-[1rem] sm:px-[2rem]">
        {/* -------Social component--------- */}
        <SocialAside />
        <h1
          id="Up"
          className="font-bold text-[1.5rem] sm:text-[3rem] text-[#555] m-10"
        >
          {t("title")}
        </h1>
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
              <h6>{t("Error loading data")}</h6>
            </Alert>
          </div>
        )}
        <div
          id="Down"
          className="flex flex-wrap w-full h-auto justify-center items-center"
        >
          {!error &&
            data?.map((category) => (
              <div
                onClick={() => toggleCategory(category.id)}
                key={category.id}
                className="flex flex-col w-full h-auto my-5 mx-[1rem] sm:mx-[4rem] lg:mx-[8rem] bg-[#f5f5f5] border-[1px] rounded-md cursor-pointer"
              >
                <div className="flex w-full h-[4rem] justify-center items-center bg-[#ccdde470] p-5">
                  <h3 className="font-semibold text-[1rem] sm:text-[1.5rem] text-[#555]">
                    {category.name}
                  </h3>
                </div>
                <AnimatePresence mode="wait">
                  {isOpenCategory[category.id] && (
                    <motion.ul
                      key={category.id} // Unique `key` for correct animation
                      initial="closed"
                      animate="open"
                      exit="closed" // Using `exit` for a graceful shutdown
                      variants={popup_form_variants}
                      className="overflow-hidden"
                    >
                      {dataPricing &&
                        dataPricing
                          .filter(
                            (pricing) => pricing.categoryId === category.id
                          ) // Filter by category
                          .map((pricing, index) => (
                            <li
                              key={pricing.id}
                              className={`flex w-full min-h-[3rem] justify-between items-center font-semibold text-[#555] text-[0.8rem] sm:text-[1.2rem] px-5 py-2 ${
                                index % 2 === 0
                                  ? "bg-[#f9f9f9]"
                                  : "bg-[#f1f1f1]"
                              }`}
                            >
                              <p className="mx-2">
                                <span>{index + 1 + "."}</span> &nbsp;{" "}
                                {pricing.name}
                              </p>{" "}
                              <p className="mx-2">
                                {pricing.price} <span>{t("currence")}</span>{" "}
                              </p>
                            </li>
                          ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default PricePage;
