"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
// --------------Import MUI components-----------------//
import Skeleton from "@mui/material/Skeleton";
// --------------Map component---------------------//
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/Map/CustomMap"), {
  ssr: false,
});
// ----------Import React icons-------------//
import { AiOutlineMail } from "react-icons/ai";
import { LiaPhoneSolid } from "react-icons/lia";

const contactPage = () => {
  const [contactData, setContactData] = useState([]);
  const [position, setPosition] = useState([]);

  // -----------Translation-----------//
  const t = useTranslations("Contact_page");

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

  // ------------Saving coordinates in a state------------------//
  useEffect(() => {
    const x = contactData[0]?.x ?? null;
    const y = contactData[0]?.y ?? null;

    if (x !== null && y !== null) {
      setPosition([x, y]);
    } else {
      setPosition([51.5287398, -0.2664034]); // Default fallback coordinates
    }
  }, [contactData]);

  return (
    <>
      <div className="flex flex-col w-full min-h-[100vh] items-center py-[5rem] xs:px-[2rem] lg:px-[5rem]">
        <h1 className="font-bold text-[1.5rem] sm:text-[2.5rem] text-[#555] m-10 mt-[3rem]">
          {t("title")}
        </h1>
        <div className="flex flex-col md:flex-row w-full h-full justify-end items-end bg-[#000] rounded-md p-5">
          <address className="flex w-auto h-[35rem] items-start mx-auto sm:p-10">
            {contactData.length === 0 ? (
              <div className="flex flex-col mx-auto my-auto font-semibold text-[1.2rem] text-[#fff] text-nowrap">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton
                    variant="rounded"
                    width="15rem"
                    height={20}
                    sx={{ m: "0.5rem", bgcolor: "rgba(255, 255, 255, 0.2)" }}
                    key={index}
                  />
                ))}
              </div>
            ) : (
              // <div className="flex w-10 h-10 bg-red-400"></div>
              <div className="flex flex-col mx-auto my-auto font-semibold text-[1rem] sm:text-[1.2rem] text-[#fff] text-nowrap">
                <p className="m-1 ml-8">{contactData[0]?.country}</p>
                <p className="m-1 ml-8">{contactData[0]?.region}</p>
                <p className="m-1 ml-8">{contactData[0]?.district}</p>
                <p className="m-1 ml-8">
                  {contactData[0]?.city} {contactData[0]?.zipcode}
                </p>
                <p className="text-wrap m-1 ml-8">
                  {contactData[0]?.street} {contactData[0]?.house}{" "}
                  {contactData[0]?.office}
                </p>
                {contactData[0]?.phoneNumbers.map((number, index) => (
                  <p key={index} className="flex items-center m-1">
                    <span>
                      <LiaPhoneSolid />
                    </span>
                    &nbsp; {number}
                  </p>
                ))}
                <p className="flex items-center m-1">
                  <span>
                    <AiOutlineMail />
                  </span>
                  &nbsp; {contactData[0]?.email}
                </p>
              </div>
            )}
          </address>

          <div className="flex w-full h-[35rem] justify-center items-center z-0">
            <MapComponent
              position={
                position.length === 2 ? position : [51.5287398, -0.2664034]
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default contactPage;
