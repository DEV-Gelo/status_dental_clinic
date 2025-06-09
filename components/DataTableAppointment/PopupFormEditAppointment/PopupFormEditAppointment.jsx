import React, { useState, useEffect } from "react";
import { mutate } from "swr";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
// -----------Import components--------------------//
import UserCalendar from "../../Appointment/UserCalendar/UserCalendar";
import AvailableDoctors from "../UserCalendar/AvailableDoctors/AvailableDoctors";
// --------------Import React Icon--------------------//
import { BsCheck2Circle } from "react-icons/bs";
// --------------Import MUI--------------------------//
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
// import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { ThemeProvider } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
// ----------Stylisation buttons MUI-----------------//
import { theme } from "@/components/Stylisation_MUI/stylisation_button_MUI";

const PopupFormEditAppointment = ({ userId, onClose, onAlert }) => {
  const [loadingPage, setLoadingPage] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [doctorsAvailability, setDoctorsAvailability] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [service, setService] = useState("");
  // const [serviceData, setServiceData] = useState([]);
  const [doctor, setDoctor] = useState({
    doctorName: "",
    doctorId: null,
  });
  const [appointmentData, setAppointmentData] = useState({
    doctorId: null,
    doctorName: "",
    scheduleId: null,
    time: null,
    selectedDate: null,
    slotId: null,
  });

  // -------Translations----------//
  const t = useTranslations("admin__edit_window");
  const locale = t("language");

  const pathname = usePathname();

  useEffect(() => {
    if (!userId) return;
    const fetchUserData = async () => {
      setLoadingPage(true);
      try {
        const response = await fetch(`/api/data_appointment/edit/${userId}`);
        const data = await response.json();
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setPatronymic(data.patronymic || "");
        setPhone(data.phone || "");
        setDate(data.date || "");
        setTime(data.time || "");
        setService(data.service || "");
        // Formation doctorName
        const getdName = data.doctor
          ? `${data.doctor.lastName} ${data.doctor.firstName} ${data.doctor.patronymic}`.trim()
          : "";

        setDoctor({
          doctorName: getdName, // Saving the doctor's name
          doctorId: data.doctorId ? Number(data.doctorId) : null,
        });
      } catch (error) {
        console.error(t("Error fetching user data"), error);
      } finally {
        setLoadingPage(false);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    if (selectedDate) {
      setDate(new Date(selectedDate).toISOString());
      setTime(appointmentData.time || "");
      setDoctor(
        appointmentData.time
          ? {
              doctorName: appointmentData.doctorName,
              doctorId: appointmentData.doctorId,
            }
          : {
              doctorName: "",
              doctorId: null,
            }
      );
    }
  }, [selectedDate, appointmentData.time, appointmentData.doctorId]);

  // --------Get date from calendar and save in state-----------//

  const handleDateSelect = async (date) => {
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    setSelectedDate(localDate);
  };

  // ------------Get data from AvailableDoctors-----------//
  const handleSlotSelection = (slotData) => {
    setAppointmentData((prev) => ({
      ...prev,
      ...slotData,
    }));
  };

  // ----------Get data from AvailableDoctors---------//

  const handleAvailabilityChange = (availability) => {
    setDoctorsAvailability(availability);
  };

  // ---The function of sending the form to the server ---//
  const handleSubmit = async () => {
    const validateForm = () => {
      if (doctorsAvailability?.error) {
        onAlert("warning", t("Date_doctor_alert"));
        return false;
      }

      if (!time) {
        onAlert("warning", t("Time_alert"));
        return false;
      }
      if (!firstName) {
        onAlert("warning", t("FirstName_alert"));
        return false;
      }
      if (!lastName) {
        onAlert("warning", t("LastName_alert"));
        return false;
      }
      if (!phone) {
        onAlert("warning", t("Phone_alert"));
        return false;
      }

      return true; // All checks passed
    };

    // Using the function
    if (!validateForm()) {
      return; // Stop the execution if the check is not passed
    }

    const formData = new FormData();

    // Add data text
    formData.append("id", userId);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("patronymic", patronymic);
    formData.append("phone", phone);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("service", service);
    formData.append("doctor", doctor.doctorId);

    try {
      setLoadingButton(true);
      // Send data
      const response = await fetch("/api/data_appointment/edit", {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        onAlert("success", t("Success_entry_alert"));
        mutate("/api/data_appointment");
        setLoadingButton(false);
        onClose();
      } else {
        console.error(t("Failed to update appointment"));
      }
    } catch (error) {
      console.error(t("Error updating appointment"), error);
    }
  };

  // --------------Formating date-------------------//
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleDateString(locale); // Localize the date in the format "dd.mm.yyyy"
  };

  // ---------------Validation phone field-----------------------//
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove all non-numeric characters
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  // -----------Auto-scroll to form-----------------//
  useEffect(() => {
    if (appointmentData.time !== null) {
      const timer = setTimeout(() => {
        if (window.innerWidth < 1024) {
          const target = document.getElementById("target");
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }, 800); // Delay of 500 ms

      // Clearing the timer when disassembling a component
      return () => clearTimeout(timer);
    }
  }, [appointmentData.time]);

  // --------Get data service from server------//
  // const fetchData = async () => {
  //   try {
  //     const response = await fetch("/api/admin_setting/service");
  //     if (!response.ok)
  //       throw new Error(
  //         result.message || t("An error occurred while receiving data")
  //       );
  //     const data = await response.json();
  //     setServiceData(data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  // useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <>
      {loadingPage ? (
        <div className="flex absolute top-0 left-0 w-screen h-screen justify-center items-center z-30 bg-white">
          <CircularProgress size="3rem" />
        </div>
      ) : (
        <section className="flex absolute top-0 left-0 flex-col w-full h-auto lg:h-full justify-center items-center bg-white z-30">
          {/* -----Title Block-----*/}
          <div className="flex flex-col w-auto mt-10">
            <h1 className="text-[1.5rem] text-[#a7adaf] font-semibold text-center">
              {t("Editing a record")}
            </h1>
          </div>
          {/* ----------Main Container----------*/}
          <div className="flex flex-col lg:flex-row mt-16 lg:mt-24">
            {/* ----------Calendar Block----------*/}

            <div className="flex flex-col w-auto max-w-[25rem] h-auto mb-5 p-1">
              <div className="flex items-center min-h-10 mb-2">
                {selectedDate ? (
                  <>
                    <span className="w-10 h-10 blue-text text-[2rem]">
                      <BsCheck2Circle />
                    </span>
                    <h3 className="font-semibold">{t("Done")}</h3>
                  </>
                ) : (
                  <>
                    <span className="flex w-8 h-8 justify-center items-center rounded-full text-white font-semibold bg-[#006eff] mr-3">
                      1
                    </span>
                    <h3 className="font-semibold">
                      {t("Choose an available date")}
                    </h3>
                  </>
                )}
              </div>
              <UserCalendar onDateSelect={handleDateSelect} />
            </div>

            {/* -----Available Doctors Block-----*/}
            <div className="flex flex-col p-1">
              <div className="flex items-center min-h-10 mb-2">
                {appointmentData.time ? (
                  <>
                    <span className="w-10 h-10 blue-text text-[2rem]">
                      <BsCheck2Circle />
                    </span>
                    <h3 className="font-semibold">{t("Done")}</h3>
                  </>
                ) : (
                  <>
                    <span className="flex w-8 h-8 justify-center items-center rounded-full text-white font-semibold bg-[#006eff] mr-3">
                      2
                    </span>
                    <h3 className="font-semibold">{t("Choose an hour")}</h3>
                  </>
                )}
              </div>
              <AvailableDoctors
                selectedDate={selectedDate}
                onSlotSelect={handleSlotSelection}
                onAvailability={handleAvailabilityChange}
              />
            </div>
            {/* ----------Form Block----------*/}

            <div className="flex flex-col w-auto p-1">
              <div className="flex items-center min-h-10 mb-2">
                {firstName && lastName && phone && date && time ? (
                  <>
                    <span className="w-10 h-10 blue-text text-[2rem]">
                      <BsCheck2Circle />
                    </span>
                    <h3 className="font-semibold">{t("Done")}</h3>
                  </>
                ) : (
                  <>
                    <span className="flex w-8 h-8 justify-center items-center rounded-full text-white font-semibold bg-[#006eff] mr-3">
                      3
                    </span>
                    <h3 className="font-semibold">{t("Fill out the form")}</h3>
                  </>
                )}
              </div>
              <div
                id="target"
                className="flex flex-col w-full min-h-[23.7rem] h-auto shadow-lg rounded-lg border-t-[1px] border-[#f5f5f5] p-3"
              >
                {/* <FormControl id="target" fullWidth sx={{ my: 3 }}>
                        <InputLabel id="select-label">
                          {t("Type of service")}
                        </InputLabel>
                        <Select
                          labelId="select-label"
                          label={t("Type of service")}
                          name="service"
                          value={appointmentData.service}
                          onChange={handleInputChange}
                        >
                          {serviceData.map((service) => (
                            <MenuItem key={service.id} value={service.name}>
                              {service.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl> */}

                <TextField
                  id="lastname"
                  size="small"
                  sx={{
                    width: "100%",
                    "& .MuiFormHelperText-root": {
                      color: "red",
                    },
                  }}
                  helperText=" "
                  label={t("LastName")}
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <TextField
                  id="firstname"
                  size="small"
                  sx={{ width: "100%" }}
                  helperText=" "
                  label={t("FirstName")}
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {pathname.split("/")[1] === "uk" && (
                  <TextField
                    id="patronymic"
                    size="small"
                    sx={{ width: "100%" }}
                    helperText=" "
                    label="По батькові"
                    name="patronymic"
                    value={patronymic}
                    onChange={(e) => setPatronymic(e.target.value)}
                  />
                )}
                <TextField
                  id="phone"
                  size="small"
                  sx={{ width: "100%" }}
                  helperText=" "
                  label={t("Phone number")}
                  placeholder={t("placeholder")}
                  name="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  slotProps={{
                    input: {
                      inputMode: "numeric",
                      maxLength: 10,
                      startAdornment: (
                        <InputAdornment position="start">
                          {t("prefix")}
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  id="date"
                  size="small"
                  sx={{ width: "100%" }}
                  label={t("Date")}
                  helperText=" "
                  name="date"
                  value={formatDate(date)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  id="time"
                  size="small"
                  sx={{ width: "100%" }}
                  label={t("Time")}
                  helperText=" "
                  name="time"
                  value={time}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  id="doctorName"
                  size="small"
                  sx={{ width: "100%" }}
                  label={t("Doctor FullName")}
                  helperText=" "
                  name="doctorName"
                  value={doctor.doctorName}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex w-full max-w-[62rem] h-[4rem] justify-center lg:justify-between my-5">
            <ThemeProvider theme={theme}>
              <LoadingButton
                sx={{ m: 1 }}
                color="primary"
                onClick={onClose}
                variant="outlined"
                size="large"
              >
                {t("Cancel")}
              </LoadingButton>
              <LoadingButton
                sx={{ m: 1 }}
                color="primary"
                onClick={handleSubmit}
                loading={loadingButton}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="contained"
                size="large"
              >
                {t("Save")}
              </LoadingButton>
            </ThemeProvider>
          </div>
        </section>
      )}
    </>
  );
};

export default PopupFormEditAppointment;
