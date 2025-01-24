import React, { useState } from "react";
import { mutate } from "swr";
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
import { theme } from "@/components/Stylisation_Buttons/stylisation_button_MUI";
// -----------Import components--------------------//
import UserCalendar from "../../Appointment/UserCalendar/UserCalendar";
import AvailableDoctors from "../UserCalendar/AvailableDoctors/AvailableDoctors";

const PopupFormAppointment = ({ onClose, onAlert }) => {
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
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
  });
  // ------------Get data from AvailableDoctors-----------//
  const handleSlotSelection = (slotData) => {
    setAppointmentData((prev) => ({
      ...prev,
      ...slotData,
    }));
  };

  // ---------------------------------------------------//

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
      if (!appointmentData.firstName) {
        onAlert("warning", "Будь ласка, введіть ім'я");
        return false;
      }
      if (!appointmentData.lastName) {
        onAlert("warning", "Будь ласка, введіть прізвище");
        return false;
      }
      if (!appointmentData.phone) {
        onAlert("warning", "Будь ласка, введіть телефон");
        return false;
      }
      if (!appointmentData.email) {
        onAlert("warning", "Будь ласка, введіть електронну пошту");
        return false;
      }

      if (!selectedDate) {
        onAlert("warning", "Будь ласка, оберіть дату для запису.");
        return false;
      }

      if (doctorsAvailability?.error) {
        onAlert("warning", "Будь ласка, оберіть іншу дату для запису.");
        return false;
      }

      if (!appointmentData.time) {
        onAlert("warning", "Будь ласка, оберіть час для запису.");
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
        onAlert("success", "Запис успішно створено!");
      } else {
        const data = await response.json();
        onAlert(
          "error",
          "Сталася помилка: " + (data.error || "Невідома помилка")
        );
      }
    } catch (err) {
      onAlert("error", "Сталася непередбачувана помилка.");
    }
  };

  // -----------------------------------------------------------------//

  const closeForm = () => {
    onClose();
  };

  return (
    <>
      <div className={styles.popup_form}>
        <h1 className={styles.title}>Створення запису</h1>
        <div className={styles.main_container}>
          <div className={styles.calendar_container}>
            <div className={styles.title_task}>
              {selectedDate ? (
                <>
                  <span className={styles.TaskAltIcon}>
                    <TaskAltIcon
                      sx={{ width: "100%", height: "100%", color: "green" }}
                    />
                  </span>
                  <h3>Оберіть доступну дату</h3>
                </>
              ) : (
                <>
                  <span className={styles.title_task_number}>1</span>
                  <h3>Оберіть доступну дату</h3>
                </>
              )}
            </div>
            <UserCalendar onDateSelect={handleDateSelect} />
          </div>
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
                  <h3>Заповніть форму</h3>
                </>
              ) : (
                <>
                  <span className={styles.title_task_number}>3</span>
                  <h3>Заповніть форму</h3>
                </>
              )}
            </div>
            <FormControl fullWidth sx={{ my: 3 }}>
              <InputLabel id="select-label">Вид послуги</InputLabel>
              <Select
                labelId="select-label"
                label="Вид послуги"
                name="service"
                value={appointmentData.service}
                onChange={handleInputChange}
              >
                <MenuItem value="Огляд та консультація">
                  Огляд та консультація
                </MenuItem>
                <MenuItem value="Чистка (ультразвукова, AirFlow)">
                  Професійна чистка (ультразвукова, AirFlow)
                </MenuItem>
                <MenuItem value="Лікування зубів">Лікування</MenuItem>
                <MenuItem value="Видалення зубів">Видалення</MenuItem>
                <MenuItem value="Інше">Інше</MenuItem>
              </Select>
            </FormControl>
            <TextField
              id="firstname"
              sx={{ width: "100%" }}
              helperText=" "
              label="Ім'я"
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
              label="Прізвище"
              name="lastName"
              value={appointmentData.lastName}
              onChange={handleInputChange}
            />
            <TextField
              id="patronymic"
              sx={{ width: "100%" }}
              helperText=" "
              label="По батькові"
              name="patronymic"
              value={appointmentData.patronymic}
              onChange={handleInputChange}
            />
            <TextField
              id="phone"
              sx={{ width: "100%" }}
              helperText=" "
              label="Номер телефону"
              placeholder="097 000 00 00"
              name="phone"
              value={appointmentData.phone}
              onChange={handleInputChange}
              slotProps={{
                input: {
                  inputMode: "numeric",
                  maxLength: 10,
                  startAdornment: (
                    <InputAdornment position="start">+38</InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              id="email"
              sx={{ width: "100%" }}
              label="Електронна пошта"
              name="email"
              value={appointmentData.email}
              onChange={handleInputChange}
              error={emailError}
              helperText={emailError ? "Некоректний формат email" : " "}
            />
          </div>
          <div className={styles.AvailableDoctors_container}>
            <div className={styles.title_task}>
              {appointmentData.time ? (
                <>
                  <span className={styles.TaskAltIcon}>
                    <TaskAltIcon
                      sx={{ width: "100%", height: "100%", color: "green" }}
                    />
                  </span>
                  <h3>Оберіть годину</h3>
                </>
              ) : (
                <>
                  <span className={styles.title_task_number}>2</span>
                  <h3>Оберіть годину</h3>
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
              Записати
            </LoadingButton>
            <LoadingButton
              sx={{ m: 1 }}
              color="cancel"
              onClick={closeForm}
              variant="contained"
              size="large"
            >
              Відміна
            </LoadingButton>
          </ThemeProvider>
        </div>
      </div>
    </>
  );
};

export default PopupFormAppointment;
