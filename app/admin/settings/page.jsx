"use client";
import React, { useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import LanguageIcon from "@mui/icons-material/Language";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import IconButton from "@mui/material/IconButton";

const Settings = () => {
  const [isOpenAside, setIsOpenAside] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const menu = [
    { icon: <LanguageIcon />, text: "Мова", id: "language" },
    { icon: <MedicalServicesIcon />, text: "Послуги", id: "services" },
    { icon: <PriceChangeIcon />, text: "Прайс", id: "pricing" },
    { icon: <ContactEmergencyIcon />, text: "Контакти", id: "contacts" },
  ];
  const titles = {
    language: "мови",
    services: "послуг",
    pricing: "прайсу",
    contacts: "контактів",
  };

  return (
    <>
      <main className="flex flex-col h-full w-full">
        <div className="flex w-full h-auto justify-center items-center">
          <h1 className="text-[1.5rem] font-semibold text-[#44444460]">
            Налаштування{" "}
            {activeIndex >= 0 ? titles[menu[activeIndex]?.id] || "" : ""}
          </h1>
        </div>
        <div className="flex w-full h-full">
          <aside
            className={`flex flex-col h-full justify-start items-center bg-[#cccccc40] rounded-r-lg transition-all duration-500 ${
              isOpenAside ? "w-[10rem]" : "w-[4rem]"
            }`}
          >
            <div className="flex w-full h-auto justify-end items-center p-2">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setIsOpenAside((prev) => !prev)}
                className="text-[#44444495]"
              >
                {!isOpenAside ? (
                  <ArrowForwardIosIcon />
                ) : (
                  <ArrowBackIosNewIcon />
                )}
              </IconButton>
            </div>
            <div
              id="active"
              className="flex flex-col h-full w-full items-center justify-center overflow-hidden"
            >
              {menu.map((item, index) => (
                <div
                  key={index}
                  className={`flex w-full h-auto justify-start items-center pl-4 py-2 cursor-pointer hover:outline hover:outline-1 hover:outline-[#cccccc] hover:bg-[#cccccc60] ${
                    activeIndex === index ? "bg-[#cccccc60]" : ""
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className="text-[#808080]">{item.icon}</span>
                  <p
                    className={`ml-4 transition-all duration-500 ${
                      isOpenAside ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </aside>
          {/* Контент для активного меню */}

          {activeIndex !== null && (
            <div className="flex w-full h-full p-4">
              {menu[activeIndex].id === "language" && (
                <h1>Language settings</h1>
              )}
              {menu[activeIndex].id === "services" && <h1>Service settings</h1>}
              {menu[activeIndex].id === "pricing" && <h1>Pricing settings</h1>}
              {menu[activeIndex].id === "contacts" && <h1>Contact settings</h1>}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Settings;
