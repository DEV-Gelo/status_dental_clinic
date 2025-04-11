import React, { useState, useEffect } from "react";
import { mutate } from "swr";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import styles from "./FormAddAppointmentStyle.module.css";
// --------------Import MUI--------------------------//
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { ThemeProvider } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
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
          <CircularProgress />
        </div>
      ) : (
        <div className={styles.popup_form}>
          <h1 className={styles.title}>{t("Creating an entry")}</h1>
          <div className={styles.main_container}>
            <div className={styles.calendar_wrapper}>
              <div className={styles.calendar_container}>
                <div className={styles.title_task}>
                  {selectedDate ? (
                    <>
                      <span className={styles.TaskAltIcon}>
                        <TaskAltIcon
                          sx={{ width: "100%", height: "100%", color: "green" }}
                        />
                      </span>
                      <h3>{t("Choose an available date")}</h3>
                    </>
                  ) : (
                    <>
                      <span className={styles.title_task_number}>1</span>
                      <h3>{t("Choose an available date")}</h3>
                    </>
                  )}
                </div>
                <UserCalendar onDateSelect={handleDateSelect} />
              </div>
            </div>
            <div className={styles.form_fields_wrapper}>
              <div className={styles.form_fields}>
                <div className={styles.title_task}>
                  {appointmentData.firstName &&
                  appointmentData.lastName &&
                  appointmentData.phone &&
                  appointmentData.email ? (
                    <>
                      <span className={styles.TaskAltIcon}>
                        <TaskAltIcon
                          sx={{ width: "100%", height: "100%", color: "green" }}
                        />
                      </span>
                      <h3>{t("Fill out the form")}</h3>
                    </>
                  ) : (
                    <>
                      <span className={styles.title_task_number}>3</span>
                      <h3>{t("Fill out the form")}</h3>
                    </>
                  )}
                </div>
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
            <div className={styles.AvailableDoctors_wrapper}>
              <div
                className={`${styles.AvailableDoctors_container} ${
                  pathname.split("/")[1] === "uk" ? "h-[1016px]" : "h-[938px]"
                }`}
              >
                <div className={styles.title_task}>
                  {appointmentData.time ? (
                    <>
                      <span className={styles.TaskAltIcon}>
                        <TaskAltIcon
                          sx={{ width: "100%", height: "100%", color: "green" }}
                        />
                      </span>
                      <h3>{t("Choose an hour")}</h3>
                    </>
                  ) : (
                    <>
                      <span className={styles.title_task_number}>2</span>
                      <h3>{t("Choose an hour")}</h3>
                    </>
                  )}
                </div>
                <AvailableDoctors
                  selectedDate={selectedDate}
                  onSlotSelect={handleSlotSelection}
                  onAvailability={handleAvailabilityChange}
                />
              </div>
            </div>
          </div>
          <div className={styles.buttons_container}>
            <ThemeProvider theme={theme}>
              <LoadingButton
                sx={{ m: 1 }}
                color="save"
                onClick={handleSubmit}
                loading={loading}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="contained"
                size="large"
              >
                {t("Save")}
              </LoadingButton>
              <LoadingButton
                sx={{ m: 1 }}
                color="cancel"
                onClick={closeForm}
                variant="contained"
                size="large"
              >
                {t("Cancel")}
              </LoadingButton>
            </ThemeProvider>
          </div>
        </div>
      )}
    </>
  );
};

export default FormAddAppointment;
