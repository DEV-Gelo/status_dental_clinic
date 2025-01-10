"use client";
import Calendar from "@/components/Schedule/Calendar/Calendar";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import SliderTime from "@/components/Schedule/SliderTime/SliderTime";
import ScheduleGenerator from "@/components/Schedule/ScheduleGenerator/ScheduleGenerator";
import DataTable from "@/components/Schedule/DataTable/DataTable";

import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";

const Appointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  // ----Transferring the status from the calendar to ScheduleGenerator---//
  const [selectedDates, setSelectedDates] = useState([]);
  const [resSelectedDates, setResSelectedDates] = useState([]);
  // ----Transferring the status from the SliderTime to ScheduleGenerator---//
  const [selectedTimes, setSelectedTimes] = useState([]);

  // ----Transferring the array selected dates from Calendar---//
  const [daySchedules, setDaySchedules] = useState([]);
  // --------State open/close window create schedule---------------//
  const [open, setOpen] = useState(false);
  // --------State alert windows configuration---------------//
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  // -----Transfered month and year from calendar---------//
  const [currentDate, setCurrentDate] = useState(new Date());

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
  // -----------Edit window--------------------------//
  const handleToggleMenu = () => {
    setOpen((prev) => !prev);
  };
  // -----------Alert windows--------------------------//
  const showAlert = (severity, message) => {
    setAlertConfig({ open: true, severity, message });
  };
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertConfig({ ...alertConfig, open: false });
  };

  const transferableDate = (currentDate) => {
    setCurrentDate(currentDate);
  };

  return (
    <>
      <div className="flex flex-col w-full h-full justify-center items-start p-5 pt-2">
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={alertConfig.open}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
        >
          <Alert
            onClose={handleCloseAlert}
            severity={alertConfig.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {alertConfig.message}
          </Alert>
        </Snackbar>
        <div className="flex w-full h-auto pb-2 justify-center items-center">
          <h1 className="text-[1.5rem] font-semibold text-center text-[#444]">
            Графік прийому
          </h1>
        </div>
        <div className="flex h-full w-full justify-center items-center ">
          <div className="flex flex-col w-auto h-full justify-start items-start bg-[#fff]">
            <Calendar
              onDateSelect={setSelectedDates}
              selectedDoctor={selectedDoctor}
              onDaySchedule={handleDaySchedule}
              resetSelectedDates={resSelectedDates}
              onAlert={showAlert}
              onTransferableDate={transferableDate}
            />
            <div className="flex w-[400px] h-auto py-5 my-3 px-10 rounded-lg shadow-lg bg-[#ccdde4]">
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
              onToggle={handleToggleMenu}
              onAlert={showAlert}
            />
          </div>

          <div className="flex flex-col w-full h-full ml-10">
            <div className="flex justify-center items-center bg-[#5ba3bb] rounded-t-lg p-[0.3rem]">
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
            <DataTable
              daySchedules={daySchedules}
              onCurrentDate={currentDate}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Appointment;
