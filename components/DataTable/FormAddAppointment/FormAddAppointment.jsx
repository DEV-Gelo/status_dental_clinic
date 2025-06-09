import React, { useState, useEffect } from "react";
import { mutate } from "swr";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
// --------------Import React Icon--------------------//
import { BsCheck2Circle } from "react-icons/bs";
// --------------Import MUI--------------------------//
import TextField from "@mui/material/TextField";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { ThemeProvider } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
// ----------Stylisation buttons MUI-----------------//
import { theme } from "@/components/Stylisation_MUI/stylisation_button_MUI";
// -----------Import components--------------------//
import UserCalendar from "@/components/DataTableAppointment/UserCalendar/UserCalendar";
import AvailableDoctors from "@/components/DataTableAppointment/UserCalendar/AvailableDoctors/AvailableDoctors";

const FormAddAppointment = ({ onClose, onAlert, userId }) => {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  // const [serviceData, setServiceData] = useState([]);
  const [doctorsAvailability, setDoctorsAvailability] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [appointmentData, setAppointmentData] = useState({
    service: "",
    doctorId: null,
    scheduleId: null,
    time: null,
    selectedDate: null,
  });

  // -------Translations----------//
  const t = useTranslations("admin__add_window");
  const pathname = usePathname();

  // ------------Get data from users-----------//
  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        setLoadingData(true);
        const response = await fetch(`/api/users/edit/${userId}`);
        const data = await response.json();
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setPatronymic(data.patronymic || "");
        setPhone(data.phone || "");
        setEmail(data.email || "");
        setLoadingData(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        onAlert("error", t("Error fetching user data"));
      }
    };

    fetchUserData();
  }, [userId]);

  // --------Get data from service------//
  // const fetchData = async () => {
  //   try {
  //     const response = await fetch("/api/admin_setting/service");
  //     if (!response.ok)
  //       throw new Error(result.message || t("Error retrieving data"));
  //     const data = await response.json();
  //     setServiceData(data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  // useEffect(() => {
  //   fetchData();
  // }, []);
  // ------------Get data from AvailableDoctors-----------//
  const handleSlotSelection = (slotData) => {
    setAppointmentData((prev) => ({
      ...prev,
      ...slotData,
    }));
  };

  // -------------Available doctors------------------//

  const handleAvailabilityChange = (availability) => {
    setDoctorsAvailability(availability);
  };

  const handleDateSelect = async (date) => {
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    setSelectedDate(localDate);
  };
  // ------Receiving and storing user input data------//
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // check the local states
    if (name === "firstName") {
      setFirstName(value);
    } else if (name === "lastName") {
      setLastName(value);
    } else if (name === "patronymic") {
      setPatronymic(value);
    } else if (name === "phone") {
      const sanitizedValue = value.replace(/\D/g, "");
      if (sanitizedValue.length <= 10) {
        setPhone(value.replace(/\D/g, "")); // Сanitize phone number
      }
    } else if (name === "email") {
      setEmail(value);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(!emailRegex.test(value)); // Check email
    } else {
      setAppointmentData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // ----------------Send data to server-------------------------------//
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from reloading

    const validateForm = () => {
      if (!selectedDate) {
        onAlert("warning", t("Date_alert"));
        return false;
      }

      if (doctorsAvailability?.error) {
        onAlert("warning", t("Date_doctor_alert"));
        return false;
      }

      if (!appointmentData.time) {
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
      if (!email) {
        onAlert("warning", t("Email_alert"));
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
          firstName: firstName,
          lastName: lastName,
          patronymic: patronymic,
          phone: phone,
          email: email,
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
        onClose();
        mutate("/api/data_appointment");
        onAlert("success", t("Success_entry_alert"));
      } else {
        const data = await response.json();
        onAlert(
          "error",
          t("An error occurred") + (data.error || t("Unknown error"))
        );
      }
    } catch (err) {
      onAlert("error", t("Error_alert"));
    }
  };

  // ------------------Close window--------------------------//

  const closeForm = () => {
    onClose();
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

  return (
    <>
      {loadingData ? (
        <div className="flex w-full h-full justify-center items-center absolute top-0 left-0 z-30 bg-[#fff]">
          <CircularProgress size="3rem" />
        </div>
      ) : (
        <section className="flex absolute top-0 left-0 flex-col w-full h-auto lg:h-full justify-center items-center bg-white z-30 p-2">
          {/* -----Title Block-----*/}
          <div className="flex flex-col w-auto mt-10">
            <h1 className="text-[1.5rem] text-[#a7adaf] font-semibold text-center">
              {t("Creating an entry")}
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
                {firstName && lastName && phone && email ? (
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
                  onChange={handleInputChange}
                />
                <TextField
                  id="firstname"
                  size="small"
                  sx={{ width: "100%" }}
                  helperText=" "
                  label={t("FirstName")}
                  name="firstName"
                  value={firstName}
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
                    value={patronymic}
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
                  value={phone}
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
                  value={email}
                  onChange={handleInputChange}
                  error={emailError}
                  helperText={emailError ? t("emailError") : " "}
                />
              </div>
            </div>
          </div>
          <div className="flex w-full max-w-[62rem] h-[4rem] justify-center lg:justify-between my-5">
            <ThemeProvider theme={theme}>
              <LoadingButton
                sx={{ m: 1 }}
                color="primary"
                onClick={closeForm}
                variant="outlined"
                size="large"
              >
                {t("Cancel")}
              </LoadingButton>
              <LoadingButton
                sx={{ m: 1 }}
                color="primary"
                onClick={handleSubmit}
                loading={loading}
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

export default FormAddAppointment;
