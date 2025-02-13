import React, { useState, useEffect } from "react";
import { mutate } from "swr";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import styles from "./PopupFormAppointmentStyle.module.css";
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
// ----------Stylisation buttons MUI-----------------//
import { theme } from "@/components/Stylisation_MUI/stylisation_button_MUI";
// -----------Import components--------------------//
import UserCalendar from "../../Appointment/UserCalendar/UserCalendar";
import AvailableDoctors from "../UserCalendar/AvailableDoctors/AvailableDoctors";

const PopupFormAppointment = ({ onClose, onAlert }) => {
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [doctorsAvailability, setDoctorsAvailability] = useState([]);
  const [serviceData, setServiceData] = useState([]);
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
  });
  // ------------Get data from AvailableDoctors-----------//
  const handleSlotSelection = (slotData) => {
    setAppointmentData((prev) => ({
      ...prev,
      ...slotData,
    }));
  };

  // -------Translations----------//
  const t = useTranslations("admin__add_window");

  const pathname = usePathname();

  const handleAvailabilityChange = (availability) => {
    setDoctorsAvailability(availability);
  };

  const handleDateSelect = async (date) => {
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    setSelectedDate(localDate);
  };
  // --------Get and save value from input ------//
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
      if (!appointmentData.firstName) {
        onAlert("warning", t("FirstName_alert"));
        return false;
      }
      if (!appointmentData.lastName) {
        onAlert("warning", t("LastName_alert"));
        return false;
      }
      if (!appointmentData.phone) {
        onAlert("warning", t("Phone_alert"));
        return false;
      }
      if (!appointmentData.email) {
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

  // -----------Function close window-----------------//

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

  // --------Get data service from server------//
  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin_setting/service");
      if (!response.ok)
        throw new Error(
          result.message || t("An error occurred while receiving data")
        );
      const data = await response.json();
      setServiceData(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
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
            <form className={styles.form_fields}>
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
              <FormControl id="target" fullWidth sx={{ my: 3 }}>
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
              </FormControl>
              <TextField
                id="firstname"
                sx={{ width: "100%" }}
                helperText=" "
                label={t("FirstName")}
                name="firstName"
                value={appointmentData.firstName}
                onChange={handleInputChange}
              />
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
                value={appointmentData.lastName}
                onChange={handleInputChange}
              />
              {pathname.split("/")[1] === "uk" && (
                <TextField
                  id="patronymic"
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
                sx={{ width: "100%" }}
                helperText=" "
                label={t("Phone number")}
                placeholder={
                  pathname.split("/")[1] === "uk"
                    ? "097 000 00 00"
                    : "555 123 4567"
                }
                name="phone"
                value={appointmentData.phone}
                onChange={handleInputChange}
                slotProps={{
                  input: {
                    inputMode: "numeric",
                    maxLength: 10,
                    startAdornment: (
                      <InputAdornment position="start">
                        {pathname.split("/")[1] === "uk" ? "+38" : "+1"}
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
                value={appointmentData.email}
                onChange={handleInputChange}
                error={emailError}
                helperText={emailError ? t("emailError") : " "}
              />
            </form>
          </div>
          <div className={styles.AvailableDoctors_wrapper}>
            <div
              className={`${styles.AvailableDoctors_container} ${
                pathname.split("/")[1] === "uk" ? "h-[1086px]" : "h-[1007px]"
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
    </>
  );
};

export default PopupFormAppointment;
