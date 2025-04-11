"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
// --------------Internal components------------------//
import Calendar from "@/components/Schedule/Calendar/Calendar";
import SliderTime from "@/components/Schedule/SliderTime/SliderTime";
import ScheduleGenerator from "@/components/Schedule/ScheduleGenerator/ScheduleGenerator";
import DataTable from "@/components/Schedule/DataTable/DataTable";
import AccessPhoto from "@/components/DataTable/AccessPhoto/AccessPhoto";
// --------------Import MUI components-----------------//
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

const Appointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  // ----Transferring the status from the calendar to ScheduleGenerator---//
  const [selectedDates, setSelectedDates] = useState([]);
  const [resSelectedDates, setResSelectedDates] = useState([]);
  // ----Transferring the status from the SliderTime to ScheduleGenerator---//
  const [selectedTimes, setSelectedTimes] = useState([]);
  //-------State loading schedule---------//
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(null);
  const [clearCheckbox, setClearCheckbox] = useState(null);
  // ----Transferring the array selected dates from Calendar---//
  const [daySchedules, setDaySchedules] = useState([]);
  // --------State alert windows configuration---------------//
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  // -----Transfered month and year from calendar---------//
  const [currentDate, setCurrentDate] = useState(new Date());

  // ---------Translations-------------//
  const t = useTranslations("schedule");

  // ------Get doctors from the data base-----------//
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors");
        if (!response.ok) {
          throw new Error(t("Error doctor"));
        }
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchDoctors();
  }, [t]);

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
  const resetCheckbox = () => {
    setClearCheckbox(Date.now());
  };
  // -----------Action from ScheduleGenerator-----------//
  const sdAction = (value) => {
    setDeleting(value);
    setSaving(value);
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
      <div className="flex flex-col w-full h-auto lg:h-full justify-center items-start p-1 lg:p-4 pt-2 mb-5 lg:mb-0">
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
          <h1 className="text-[1.5rem] font-semibold text-center text-[#44444460]">
            {t("Reception schedule")}
          </h1>
        </div>
        <div className="flex flex-col lg:flex-row h-full w-full justify-center items-center lg:items-start ">
          <div className="flex relative flex-col md:flex-row lg:flex-col w-full lg:w-auto h-full justify-between items-start bg-[#f5f5f5] rounded-lg p-2 lg:p-0 my-10 lg:my-0">
            {deleting && (
              <div className="flex absolute top-0 left-0 w-full h-full z-30 rounded-lg bg-[#66666650] animate-pulse" />
            )}
            <div className="flex w-full h-full justify-center items-start">
              <Calendar
                onDateSelect={setSelectedDates}
                selectedDoctor={selectedDoctor}
                onDaySchedule={handleDaySchedule}
                resetSelectedDates={resSelectedDates}
                clearCheckbox={clearCheckbox}
                onAlert={showAlert}
                onTransferableDate={transferableDate}
                isLoadingSchedule={setIsLoadingSchedule}
              />
            </div>
            <div className="flex flex-col w-full h-full ml-0 md:ml-3 lg:ml-0">
              <div className="flex w-full h-auto py-5 my-3 px-10 rounded-lg shadow-lg bg-[#ccdde4]">
                <SliderTime
                  selectedDates={selectedDates}
                  onTimeSelect={setSelectedTimes}
                />
              </div>
              <div className="flex w-full h-full justify-center items-end">
                <ScheduleGenerator
                  dates={selectedDates}
                  times={selectedTimes}
                  doctorId={selectedDoctor}
                  onResetSelectedDates={resetSelectedDates}
                  onClearCheckbox={resetCheckbox}
                  onDeleting={sdAction}
                  onSaving={sdAction}
                  onAlert={showAlert}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full h-full lg:ml-10 order-first lg:order-none">
            <div className="flex justify-center items-center bg-[#5ba3bb] rounded-t-lg p-[0.3rem]">
              <div className="flex ">
                <div className="flex w-[50px] h-[50px] rounded-full overflow-hidden">
                  <AccessPhoto fileKey={doctor?.photo} />
                  {/* <Image
                    src={doctor?.photo || "/image-placeholder.svg"}
                    alt="Doctor photo"
                    width={50}
                    height={50}
                    className="flex object-cover"
                  /> */}
                </div>
              </div>
              <div className="flex p-3">
                <FormControl sx={{ minWidth: "10rem" }}>
                  <InputLabel id="select-label">
                    {selectedDoctor ? t("Doctor") : t("Choose a doctor")}
                  </InputLabel>
                  <Select
                    labelId="select-label"
                    label={selectedDoctor ? t("Doctor") : t("Choose a doctor")}
                    name="service"
                    value={selectedDoctor}
                    onChange={handleDoctorChange}
                  >
                    {doctors.length === 0 ? (
                      <MenuItem disabled>{t("No doctors found")}</MenuItem>
                    ) : (
                      doctors.map((doctor) => (
                        <MenuItem key={doctor.id} value={doctor.id}>
                          {doctor.lastName} {doctor.firstName}{" "}
                          {doctor.patronymic}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </div>
            </div>
            <DataTable
              daySchedules={daySchedules}
              onCurrentDate={currentDate}
              onAlert={showAlert}
              onResetSelectedDates={resetSelectedDates}
              selectedDoctor={selectedDoctor}
              isLoadingSchedule={isLoadingSchedule}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Appointment;
