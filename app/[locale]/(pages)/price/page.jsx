"use client";
import React, { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { useTranslations } from "next-intl";

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

const pricePage = () => {
  // ------- Calling function for receiving data from server------------//
  const { data, error } = useSWR("/api/admin_setting/category", fetchData);
  const { data: dataPricing, error: errorPricing } = useSWR(
    "/api/admin_setting/pricing",
    fetchPricingData
  );
  console.log("Category :", data);
  console.log("Pricing :", dataPricing);
  return (
    <>
      <div className="flex w-full h-[100vh] bg-[#222] justify-center items-center">
        <h1 className="text-white font-bold text-[45px]">Price page</h1>
      </div>
    </>
  );
};

export default pricePage;
