import React, { useState, useEffect } from "react";
import Image from "next/image";
import useSWR from "swr";

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
  const { data: doctorsAvailability, error, mutate } = useSWR(url, fetcher);

  useEffect(() => {
    if (selectedDate) {
      if (doctorsAvailability && doctorsAvailability.length > 0) {
        setDoctorTimesMessage(
          `Доступні лікарі та години для запису на обрану дату ${selectedDate.toLocaleDateString(
            "uk-UA"
          )}`
        );
      } else {
        setDoctorTimesMessage(
          `Вибачте, немає доступних годин для запису на обрану дату ${selectedDate.toLocaleDateString(
            "uk-UA"
          )}`
        );
      }
      onAvailability(doctorsAvailability);
    }
  }, [doctorsAvailability, selectedDate]);

  // -------Get selected data and send to Appointment page -----------//
  const handleSlotClick = (doctorId, time, scheduleId, slotId) => {
    const selectedData = { doctorId, time, scheduleId, slotId, selectedDate };
    if (selectedData) {
      setSelectedSlot(selectedData);
      onSlotSelect(selectedData);
    }
  };
  // -----------------------------------------------------------------//

  return (
    <div>
      {selectedDate && (
        <div className="m-5">
          <h2 className="font-semibold text-xl">{doctorTimesMessage}</h2>
          {error && <p className="text-red-500">Помилка: {error.message}</p>}

          {doctorsAvailability && doctorsAvailability.length > 0
            ? doctorsAvailability.map((doctor) => (
                <div
                  key={doctor.doctorId}
                  className="flex w-[25rem] flex-col mb-5"
                >
                  <div className="flex items-center mb-3">
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
                  <h3 className="font-semibold">Доступні години:</h3>
                  <ul>
                    {doctor.availableTimes.map((slot, index) => (
                      <li
                        key={index}
                        onClick={() =>
                          handleSlotClick(
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
                        } flex w-14 text-center justify-center items-center px-2 py-1 rounded-lg my-3 cursor-pointer`}
                      >
                        {slot.time}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            : null}
        </div>
      )}
    </div>
  );
};

export default AvailableDoctors;
