import React, { useState, useEffect } from "react";
import Image from "next/image";
import useSWR from "swr";
import { useTranslations } from "next-intl";
import CircularProgress from "@mui/material/CircularProgress";
import { Spa } from "@mui/icons-material";

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
    <div className="flex w-auto">
      {!selectedDate && (
        <div className="flex flex-col w-[23rem] min-h-[13.5rem] rounded-lg shadow-lg border-t-[1px] border-[#f5f5f5] bg-[#fdfdfd]">
          <div className="flex w-auto h-auto justify-start items-center border-b-[1px] border-[#006eff] py-2 mx-4">
            <span className="flex relative min-w-[5rem] min-h-[5rem] filter blur-sm rounded-full bg-[#cccccc]">
              <Image
                src="/image-placeholder.svg"
                alt="placeholder-avatar"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </span>
            <div className="flex flex-col pl-16">
              <h3 className="text-[0.8rem] filter blur-sm">Лікар-стоматолог</h3>
              <p className="font-medium text-lg filter blur-sm">
                Олександр Олександрович
              </p>
            </div>
          </div>
          <div className="flex relative w-auto h-full flex-wrap px-5 justify-center items-center">
            {[...Array(8)].map((_, index) => {
              const hour = 8 + index;
              const formattedHour = hour.toString().padStart(2, "0"); // Format 2 digits
              return (
                <span
                  key={index}
                  className="flex w-[4.5rem] text-center justify-center items-center px-2 py-1 rounded-md bg-[#f5f5f5] filter blur-sm m-1 cursor-pointer"
                >
                  {formattedHour}:00
                </span>
              );
            })}
            {/* <h3 className="flex absolute top-[40%] left-5 text-[1rem]">
              {t("Select a date to display the hours")}
            </h3> */}
          </div>
        </div>
      )}
      {selectedDate && (
        <div className="flex w-full flex-col justify-center items-center lg:mx-5">
          {isLoading ? (
            <div className="flex flex-col w-[23rem] min-h-[13.5rem] rounded-lg shadow-lg border-t-[1px] border-[#f5f5f5] bg-[#fdfdfd]">
              <div className="flex w-auto h-auto justify-start items-center border-b-[1px] border-[#006eff] py-2 mx-4">
                <span className="flex relative min-w-[5rem] min-h-[5rem] filter blur-sm rounded-full bg-[#cccccc]">
                  <CircularProgress size="5rem" />
                </span>
                <div className="flex flex-col pl-16">
                  <h3 className="text-[0.8rem] filter blur-sm">
                    Лікар-стоматолог
                  </h3>
                  <p className="font-medium text-lg filter blur-sm">
                    Олександр Олександрович
                  </p>
                </div>
              </div>
              <div className="flex relative w-auto h-full flex-wrap px-5 justify-center items-center">
                {[...Array(8)].map((_, index) => {
                  const hour = 8 + index;
                  const formattedHour = hour.toString().padStart(2, "0"); // Format 2 digits
                  return (
                    <span
                      key={index}
                      className="flex w-[4.5rem] text-center justify-center items-center px-2 py-1 rounded-md bg-[#f5f5f5] filter blur-sm m-1 cursor-pointer"
                    >
                      {formattedHour}:00
                    </span>
                  );
                })}
              </div>
            </div>
          ) : null}

          {error && (
            <div className="flex w-[23rem] min-h-[13.5rem] justify-center items-center rounded-lg shadow-lg border-t-[1px] border-[#f5f5f5] bg-[#fdfdfd]">
              <p className="text-red-500">
                {t("Error")}: {error.message}
              </p>
            </div>
          )}

          {doctorsAvailability && doctorsAvailability.length > 0
            ? doctorsAvailability.map((doctor) => (
                <div
                  key={doctor.doctorId}
                  className="flex flex-col w-auto max-w-[23rem] rounded-lg shadow-lg border-t-[1px] border-[#f5f5f5] bg-[#fdfdfd] mb-10"
                >
                  <div className="flex w-auto h-auto border-b-[1px] border-[#006eff] mx-3">
                    <div className="flex relative min-w-[80px] min-h-[5rem] rounded-full overflow-hidden m-2">
                      <Image
                        src={doctor.photo}
                        alt={doctor.doctorName}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col w-full items-start justify-center ml-8">
                      <h3 className="text-[0.8rem] ">
                        {doctor.specialization || t("defaultSpecialization")}
                      </h3>
                      <p className="font-medium text-lg">{doctor.doctorName}</p>
                    </div>
                  </div>
                  <div className="flex flex-col w-full h-full justify-center items-center p-2">
                    {/* <h3 className="font-semibold ">{t("Available hours")}:</h3> */}
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
                                ? "bg-[#006eff] text-white"
                                : " bg-[#f5f5f5] text-black"
                            } flex w-[4.5rem] text-center justify-center items-center px-2 py-1 rounded-md m-1 cursor-pointer`}
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
