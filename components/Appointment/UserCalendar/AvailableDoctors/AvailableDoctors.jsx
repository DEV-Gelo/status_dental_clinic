import React, { useState, useEffect } from "react";
import Image from "next/image";
import useSWR from "swr";
import { useTranslations } from "next-intl";
import CircularProgress from "@mui/material/CircularProgress";
import AccessPhoto from "@/components/DataTable/AccessPhoto/AccessPhoto";

// Data download function
const fetcher = (url) => fetch(url).then((res) => res.json());

const AvailableDoctors = ({ selectedDate, onSlotSelect, onAvailability }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [doctorTimesMessage, setDoctorTimesMessage] = useState("");

  // -------Translations----------//
  const t = useTranslations("admin__AvailableDoctors");
  const locale = t("language");

  // Form the URL depending on the selected date
  const url = selectedDate
    ? `/api/appointment?date=${selectedDate.toISOString().split("T")[0]}`
    : null;

  // Use SWR to download data
  const { data: doctorsAvailability, error, isLoading } = useSWR(url, fetcher);

  useEffect(() => {
    if (selectedDate) {
      if (isLoading) {
        setDoctorTimesMessage(t("LoaadingData"));
      } else if (doctorsAvailability && doctorsAvailability.length > 0) {
        setDoctorTimesMessage(
          `${t("Available records as of")} ${selectedDate.toLocaleDateString(
            locale
          )}`
        );
      } else if (!isLoading && doctorsAvailability) {
        setDoctorTimesMessage(
          `${t("No entry available")}  ${selectedDate.toLocaleDateString(
            locale
          )}`
        );
      }
      onAvailability(doctorsAvailability || []);
    }
  }, [doctorsAvailability, selectedDate, isLoading]);

  // -------Get selected data and send to Appointment page -----------//
  const handleSlotClick = (doctorName, doctorId, time, scheduleId, slotId) => {
    const selectedData = {
      doctorName,
      doctorId,
      time,
      scheduleId,
      slotId,
      selectedDate,
    };
    if (selectedData) {
      setSelectedSlot(selectedData);
      onSlotSelect(selectedData);
    }
  };

  return (
    <div className="flex w-full">
      {!selectedDate && (
        <div className="flex w-full h-full justify-center items-center m-2 p-5 rounded-lg bg-[#f5f5f5]">
          <h1 className="text-[1rem] text-[#44444460]">
            {t("Select a date to display the hours")}
          </h1>
        </div>
      )}
      {selectedDate && (
        <div className="flex w-full flex-col justify-center items-center mx-5">
          <h2 className="font-semibold text-xl text-center text-[#44444460] mb-5">
            {doctorTimesMessage}
            {isLoading ? (
              <div className="p-5">
                <CircularProgress size="3rem" />
              </div>
            ) : (
              ""
            )}
          </h2>
          {error && (
            <p className="text-red-500">
              {t("Error")}: {error.message}
            </p>
          )}

          {doctorsAvailability && doctorsAvailability.length > 0
            ? doctorsAvailability.map((doctor) => (
                <div
                  key={doctor.doctorId}
                  className="flex flex-col xl:flex-row xl:items-start w-full h-auto justify-center items-center mb-5 border-[1px] border-[#d3d3d3] rounded-md"
                >
                  <div className="flex min-w-[200px] w-auto h-full flex-col items-center justify-center text-center p-2">
                    <h3 className="font-semibold ">
                      {doctor.specialization || t("defaultSpecialization")}
                    </h3>
                    <div className="flex w-[100px] h-[100px] rounded-full overflow-hidden m-2">
                      <Image
                        src={doctor.photo}
                        alt={doctor.doctorName}
                        width={100}
                        height={100}
                        className="object-cover"
                      />
                    </div>
                    <p className="font-medium text-lg">{doctor.doctorName}</p>
                  </div>
                  <div className="flex flex-col w-full h-full justify-center items-center m-2">
                    <h3 className="font-semibold ">{t("Available hours")}:</h3>
                    <ul className="flex flex-wrap justify-center items-center">
                      {doctor.availableTimes
                        .sort((a, b) => {
                          // Comparing time in the format "HH:mm"
                          const timeA = a.time.split(":").map(Number);
                          const timeB = b.time.split(":").map(Number);

                          // Comparing hours and minutes
                          if (timeA[0] === timeB[0]) {
                            return timeA[1] - timeB[1]; // If the hours are the same, compare the minutes.
                          }
                          return timeA[0] - timeB[0]; // Сompare hours
                        })
                        .map((slot, index) => (
                          <li
                            key={index}
                            onClick={() =>
                              handleSlotClick(
                                doctor.doctorName,
                                doctor.doctorId,
                                slot.time,
                                slot.scheduleId,
                                slot.slotId
                              )
                            }
                            className={`${
                              selectedSlot?.doctorId === doctor.doctorId &&
                              selectedSlot?.time === slot.time
                                ? "bg-blue-700 text-white"
                                : " bg-green-200 text-black"
                            } flex w-14 text-center justify-center items-center px-2 py-1 rounded-lg m-2 cursor-pointer`}
                          >
                            {slot.time}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              ))
            : null}
        </div>
      )}
    </div>
  );
};

export default AvailableDoctors;
