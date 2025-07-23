"use client";
import React, { useState, useEffect } from "react";
import { mutate } from "swr";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
// --------------Import React Icon--------------------//
import { BsCheck2Circle, BsCalendar3 } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import { FaLocationDot } from "react-icons/fa6";
import { MdAccessTime } from "react-icons/md";
// --------------Import MUI--------------------------//
import TextField from "@mui/material/TextField";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
import LoadingButton from "@mui/lab/LoadingButton";
import { ThemeProvider } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
// ----------Stylisation buttons MUI-----------------//
import { theme } from "@/components/Stylisation_MUI/stylisation_button_MUI";
// -----------Import Iternal Components--------------------//
import UserCalendar from "../../../components/Appointment/UserCalendar/UserCalendar";
import AvailableDoctors from "../../../components/Appointment/UserCalendar/AvailableDoctors/AvailableDoctors";

const Appointment = () => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  // const [serviceData, setServiceData] = useState([]);
  const [doctorsAvailability, setDoctorsAvailability] = useState([]);
  const [appointmentData, setAppointmentData] = useState({
    firstName: "",
    lastName: "",
    patronymic: "",
    phone: "",
    email: "",
    service: "",
    doctorId: null,
    scheduleId: null,
    time: null,
    selectedDate: null,
    doctorName: null,
  });
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  // -------Translations----------//
  const t = useTranslations("appointment");
  const local = t("language");
  const pathname = usePathname();

  // -------Back Button -------//
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };

  // ------------Get data from AvailableDoctors-----------//
  const handleSlotSelection = (slotData) => {
    setAppointmentData((prev) => ({
      ...prev,
      ...slotData,
    }));
  };

  // -----------Formating selected date for modal window-------------------//
  const date = new Date(appointmentData.selectedDate);
  const formattedDate = date.toLocaleDateString(local, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const handleAvailabilityChange = (availability) => {
    setDoctorsAvailability(availability);
  };

  const handleDateSelect = async (date) => {
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    setSelectedDate(localDate);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Validation for email
    if (name === "email") {
      // Update the value without checking the email at each step
      setAppointmentData((prev) => ({ ...prev, [name]: value }));

      // After the update, check email for validity
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(value)) {
        setEmailError(false);
      } else {
        setEmailError(true);
      }
    }
    // Validation for phone
    else if (name === "phone") {
      const sanitizedValue = value.replace(/\D/g, "");
      if (sanitizedValue.length <= 10) {
        setAppointmentData((prev) => ({ ...prev, [name]: sanitizedValue }));
      }
    } else {
      setAppointmentData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ----------------Send data to server-------------------------------//
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from reloading

    const validateForm = () => {
      if (!selectedDate) {
        showAlert("warning", t("Date_alert"));
        return false;
      }

      if (doctorsAvailability?.error) {
        showAlert("warning", t("Date_doctor_alert"));
        return false;
      }

      if (!appointmentData.time) {
        showAlert("warning", t("Time_alert"));
        return false;
      }
      if (!appointmentData.firstName) {
        showAlert("warning", t("FirstName_alert"));
        return false;
      }
      if (!appointmentData.lastName) {
        showAlert("warning", t("LastName_alert"));
        return false;
      }
      if (!appointmentData.phone) {
        showAlert("warning", t("Phone_alert"));
        return false;
      }
      if (!appointmentData.email) {
        showAlert("warning", t("Email_alert"));
        return false;
      }

      return true; // All checks passed
    };

    // Using the function
    if (!validateForm()) {
      return; // Stop the execution if the check is not passed
    }

    // Date formatting for transfer to the database
    const appointmentDate = new Date(appointmentData.selectedDate);

    try {
      setLoading(true);
      const response = await fetch("/api/appointment/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: appointmentData.firstName,
          lastName: appointmentData.lastName,
          patronymic: appointmentData.patronymic,
          phone: appointmentData.phone,
          email: appointmentData.email,
          service: appointmentData.service,
          time: appointmentData.time,
          date: appointmentDate.toISOString(), // Need to convert to ISO format
          scheduleId: appointmentData.scheduleId,
          doctorId: appointmentData.doctorId,
          slotId: appointmentData.slotId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLoading(false);
        mutate("/api/data_appointment");
        showAlert("success", t("Success_entry_alert"));
        setIsSuccess(true);
      } else {
        const data = await response.json();
        showAlert(
          "error",
          t("An error occurred") + (data.error || t("Unknown error"))
        );
      }
    } catch (err) {
      showAlert("error", t("Error_alert"));
    }
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

  return (
    <>
      {isSuccess && (
        // ----- Success appointment section ----- //
        <section
          className="flex w-full h-full overflow-y-auto py-[1rem]"
          aria-labelledby="registration-success"
        >
          <div className="flex flex-col w-full h-auto justify-center items-center my-auto">
            <div className="flex flex-col w-full h-[40rem] justify-center items-center">
              <h2
                id="registration-success"
                className="title-text-m lg:title-text blue-text text-center px-4"
              >
                {t("REGISTRATION SUCCESSFUL")}
              </h2>

              <div className="flex flex-col max-w-[25rem] justify-center items-center px-4">
                <h3 className="sm:text-[1.25rem] text-center font-semibold sm:my-10 my-5">
                  {t("Thanks")}
                </h3>
                <h3 className="text-center sm:text-[1.25rem] font-semibold sm:mb-10 mb-5">
                  {t("Administrator will contact")}
                </h3>
                <p className="font-semibold text-center sm:mb-10 mb-5">
                  {t("We are waiting for you")}
                </p>
              </div>
              <div className="flex relative w-full min-h-[16rem] justify-start items-end bg-[#006eff]">
                <div className="hidden lg:flex relative w-[24rem] h-[30rem]">
                  <Image
                    src="/Success_appointment_IMG.webp"
                    alt="success appointment"
                    priority
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex absolute top-2 lg:top-10 left-[calc(50%-9rem)] flex-col max-w-[25rem] bg-[#006eff]">
                  <p className="flex items-center text-white font-medium my-2">
                    <span className="flex text-[2rem] mx-2">
                      <AiOutlineUser />
                    </span>{" "}
                    {appointmentData.lastName} {appointmentData.firstName}{" "}
                    {appointmentData.patronymic}
                  </p>
                  <p className="flex items-center text-white font-medium my-2">
                    <span className="flex text-[2rem] mx-2">
                      <FaLocationDot />
                    </span>
                    {t("Address")}
                  </p>
                  <p className="flex items-center text-white font-medium my-2">
                    <span className="flex text-[2rem] mx-2">
                      <BsCalendar3 />
                    </span>{" "}
                    {formattedDate}
                  </p>
                  <p className="flex items-center text-white font-medium my-2">
                    <span className="flex text-[2rem] mx-2">
                      <MdAccessTime />
                    </span>{" "}
                    {appointmentData.time}
                  </p>
                </div>
              </div>
            </div>
            <ThemeProvider theme={theme}>
              <Link href="/">
                <LoadingButton
                  size="large"
                  color="appointment"
                  variant="outlined"
                  sx={{
                    mt: "1rem",
                    width: "16rem",
                    whiteSpace: "nowrap",
                    borderRadius: 10,
                    fontWeight: "600",
                    fontFamily: "var(--font-montserrat)",
                    borderWidth: 2,
                    borderColor: "#006eff",
                    color: "#006eff",
                  }}
                >
                  {t("TO THE MAIN")}
                </LoadingButton>
              </Link>
            </ThemeProvider>
          </div>
        </section>
      )}
      {!isSuccess && (
        <section className="flex flex-col w-full h-auto justify-center items-center p-5">
          {/* -----Title Block-----*/}
          <div className="flex flex-col w-auto">
            <p className="blue-text text-center">{t("OnlineAppointment")}</p>
            <h1 className="title-text-m lg:title-text text-center">
              {t("Creating an record")}
            </h1>
          </div>
          {/* -----Alert Message Block-----*/}
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
          {/* ----------Main Container----------*/}
          <div className="flex flex-col lg:flex-row mt-16 lg:mt-24">
            {/* ----------Calendar Block----------*/}

            <div className="flex flex-col w-auto max-w-[25rem] h-auto mb-5 p-1">
              <div className="flex items-center min-h-10 mb-2">
                {selectedDate ? (
                  <>
                    <span className="flex h-full items-end mr-2">
                      <p className="blue-text">{t("Step")}</p>
                    </span>
                    <span className="w-10 h-10 blue-text text-[2rem]">
                      <BsCheck2Circle />
                    </span>
                    <h3 className="font-semibold">{t("Done")}</h3>
                  </>
                ) : (
                  <>
                    <span className="flex h-full items-end mr-2">
                      <p className="blue-text">{t("Step")}</p>
                    </span>
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
                    <span className="flex h-full items-end mr-2">
                      <p className="blue-text">{t("Step")}</p>
                    </span>
                    <span className="w-10 h-10 blue-text text-[2rem]">
                      <BsCheck2Circle />
                    </span>
                    <h3 className="font-semibold">{t("Done")}</h3>
                  </>
                ) : (
                  <>
                    <span className="flex h-full items-end mr-2">
                      <p className="blue-text">{t("Step")}</p>
                    </span>
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
                {appointmentData.firstName &&
                appointmentData.lastName &&
                appointmentData.phone &&
                appointmentData.email ? (
                  <>
                    <span className="flex h-full items-end mr-2">
                      <p className="blue-text">{t("Step")}</p>
                    </span>
                    <span className="w-10 h-10 blue-text text-[2rem]">
                      <BsCheck2Circle />
                    </span>
                    <h3 className="font-semibold">{t("Done")}</h3>
                  </>
                ) : (
                  <>
                    <span className="flex h-full items-end mr-2">
                      <p className="blue-text">{t("Step")}</p>
                    </span>
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
                  value={appointmentData.lastName}
                  onChange={handleInputChange}
                />
                <TextField
                  id="firstname"
                  size="small"
                  sx={{ width: "100%" }}
                  helperText=" "
                  label={t("FirstName")}
                  name="firstName"
                  value={appointmentData.firstName}
                  onChange={handleInputChange}
                />
                {pathname.split("/")[1] === "uk" && (
                  <TextField
                    id="patronymic"
                    size="small"
                    sx={{ width: "100%" }}
                    helperText=" "
                    label="По батькові"
                    name="patronymic"
                    value={appointmentData.patronymic}
                    onChange={handleInputChange}
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
                  value={appointmentData.phone}
                  onChange={handleInputChange}
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
                  id="email"
                  size="small"
                  sx={{ width: "100%" }}
                  label={t("Email")}
                  name="email"
                  value={appointmentData.email}
                  onChange={handleInputChange}
                  error={emailError}
                  helperText={emailError ? t("emailError") : " "}
                />
              </div>
            </div>
          </div>
          <div className="flex w-full max-w-[60rem] h-[3rem] justify-center lg:justify-between my-5">
            <ThemeProvider theme={theme}>
              <Link href="/" className="hidden lg:flex">
                <LoadingButton
                  size="large"
                  color="appointment"
                  variant="outlined"
                  sx={{
                    width: "16rem",
                    whiteSpace: "nowrap",
                    borderRadius: 10,
                    fontWeight: "600",
                    fontFamily: "var(--font-montserrat)",
                    borderWidth: 2,
                    borderColor: "#006eff",
                    color: "#006eff",
                  }}
                  onClick={handleClick}
                >
                  {t("Back")}
                </LoadingButton>
              </Link>
              <LoadingButton
                size="large"
                color="appointment"
                variant="outlined"
                sx={{
                  width: "16rem",
                  whiteSpace: "nowrap",
                  borderRadius: 10,
                  fontWeight: "600",
                  fontFamily: "var(--font-montserrat)",
                  borderWidth: 2,
                  borderColor: "#006eff",
                  color: "#006eff",
                }}
                onClick={handleSubmit}
                loading={loading}
                loadingPosition="start"
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

export default Appointment;
