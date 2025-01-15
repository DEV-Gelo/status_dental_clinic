import React, { useState, useEffect } from "react";
import Image from "next/image";
import useSWR from "swr";
import CircularProgress from "@mui/material/CircularProgress";

// Функція для завантаження даних
const fetcher = (url) => fetch(url).then((res) => res.json());

const AvailableDoctors = ({ selectedDate, onSlotSelect, onAvailability }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [doctorTimesMessage, setDoctorTimesMessage] = useState("");

  // Формуємо URL залежно від обраної дати
  const url = selectedDate
    ? `/api/appointment?date=${selectedDate.toISOString().split("T")[0]}`
    : null;

  // Використовуємо SWR для завантаження даних
  const { data: doctorsAvailability, error, isLoading } = useSWR(url, fetcher);

  useEffect(() => {
    if (selectedDate) {
      if (isLoading) {
        setDoctorTimesMessage("Завантаження даних, будь ласка, зачекайте...");
      } else if (doctorsAvailability && doctorsAvailability.length > 0) {
        setDoctorTimesMessage(
          `Доступні записи станом на ${selectedDate.toLocaleDateString(
            "uk-UA"
          )}`
        );
      } else if (!isLoading && doctorsAvailability) {
        setDoctorTimesMessage(
          `Вибачте, немає доступного запису станом на  ${selectedDate.toLocaleDateString(
            "uk-UA"
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
  // -----------------------------------------------------------------//

  return (
    <div className="flex w-full">
      {!selectedDate && (
        <div className="flex w-full h-full justify-center items-center m-2 p-5 rounded-lg bg-[#f5f5f5]">
          <h1 className="text-[1rem] text-[#44444460]">
            Для відображення годин оберіть дату
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
          {error && <p className="text-red-500">Помилка: {error.message}</p>}

          {doctorsAvailability && doctorsAvailability.length > 0
            ? doctorsAvailability.map((doctor) => (
                <div
                  key={doctor.doctorId}
                  className="flex flex-col xl:flex-row xl:items-start w-full h-auto justify-center items-center mb-5 border-[1px] border-[#d3d3d3] rounded-md"
                >
                  <div className="flex min-w-[200px] w-auto h-full flex-col items-center justify-center text-center p-2">
                    <h3 className="font-semibold ">Лікар</h3>
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
                    <h3 className="font-semibold ">Доступні години:</h3>
                    <ul className="flex flex-wrap justify-center items-center">
                      {doctor.availableTimes.map((slot, index) => (
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
