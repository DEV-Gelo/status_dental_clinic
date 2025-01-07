"use client";
import Calendar from "@/components/Schedule/Calendar/Calendar";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import SliderTime from "@/components/Schedule/SliderTime/SliderTime";
import ScheduleGenerator from "@/components/Schedule/ScheduleGenerator/ScheduleGenerator";
import DataTable from "@/components/Schedule/DataTable/DataTable";

const Appointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  // ----Transferring the status from the calendar to ScheduleGenerator---//
  const [selectedDates, setSelectedDates] = useState([]);
  const [resSelectedDates, setResSelectedDates] = useState([]);
  // ----Transferring the status from the SliderTime to ScheduleGenerator---//
  const [selectedTimes, setSelectedTimes] = useState([]);
  // ------------------------------------------------------------------------//
  // ----Transferring the array selected dates from Calendar---//
  const [daySchedules, setDaySchedules] = useState([]);
  // ---------------------------------------------------------//

  // ------Get doctors from the data base-----------//
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors");
        if (!response.ok) {
          throw new Error("Помилка при завантаженні лікарів");
        }
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchDoctors();
  }, []);

  const doctor = doctors.find(
    (doctor) => doctor.id === parseInt(selectedDoctor)
  );

  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
  };

  const handleDaySchedule = (schedule) => {
    setDaySchedules(schedule);
  };

  const resetSelectedDates = () => {
    setResSelectedDates([]);
    setSelectedDates([]);
    setSelectedTimes([]);
  };

  return (
    <>
      <div className="flex w-full h-full p-[0rem]">
        <div className="flex w-[30rem] h-full justify-start items-start border-[2px] rounded-lg">
          <div className="flex flex-col mx-5">
            <div className="flex my-[1rem]">
              <div className="flex border-[1px] ">
                <div className="flex w-[50px] h-[50px] rounded-full overflow-hidden">
                  <Image
                    src={doctor?.photo || "/image-placeholder.png"}
                    alt="Фото лікаря"
                    width={50}
                    height={50}
                    className="flex object-cover"
                  />
                </div>
              </div>
              <div className="flex p-3 border-[1px]">
                <select
                  name="doctor"
                  value={selectedDoctor}
                  onChange={handleDoctorChange}
                >
                  <option value="" disabled>
                    Оберіть лікаря!
                  </option>
                  {doctors.length === 0 ? (
                    <option disabled>Лікарі не знайдені</option>
                  ) : (
                    doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.firstName} {doctor.lastName} {doctor.patronymic}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <Calendar
              onDateSelect={setSelectedDates}
              selectedDoctor={selectedDoctor}
              onDaySchedule={handleDaySchedule}
              resetSelectedDates={resSelectedDates}
            />
            <div className="flex w-auto h-auto my-5 p-10 border-[2px] rounded-lg bg-[#ccdde4] border-gray-100">
              <SliderTime
                selectedDates={selectedDates}
                onTimeSelect={setSelectedTimes}
              />
            </div>
            <ScheduleGenerator
              dates={selectedDates}
              times={selectedTimes}
              doctorId={selectedDoctor}
              onSaveSuccess={resetSelectedDates}
            />
          </div>
        </div>
        <DataTable daySchedules={daySchedules} />
      </div>
    </>
  );
};

export default Appointment;
