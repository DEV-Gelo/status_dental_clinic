import React, { useState, useEffect } from "react";
import { mutate } from "swr";
import styles from "./PopupFormEditAppointmentStyle.module.css";

// -----------Import components--------------------//
import UserCalendar from "../../Appointment/UserCalendar/UserCalendar";
import AvailableDoctors from "../UserCalendar/AvailableDoctors/AvailableDoctors";

// --------------Import MUI--------------------------//
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { ThemeProvider } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
// ----------Stylisation buttons MUI-----------------//
import { theme } from "@/components/Stylisation_MUI/stylisation_button_MUI";

const PopupFormEditAppointment = ({ userId, onClose, onAlert }) => {
  const [loadingPage, setLoadingPage] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [doctorsAvailability, setDoctorsAvailability] = useState([]);
  const [appointmentData, setAppointmentData] = useState({
    doctorId: null,
    doctorName: "",
    scheduleId: null,
    time: null,
    selectedDate: null,
    slotId: null,
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [service, setService] = useState("");
  const [doctor, setDoctor] = useState({
    doctorName: "",
    doctorId: null,
  });

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
        console.error("Error fetching user data:", error);
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
        onAlert("warning", "Будь ласка, оберіть іншу дату для запису");
        return false;
      }

      if (!appointmentData.time) {
        onAlert("warning", "Будь ласка, оберіть час для запису");
        return false;
      }
      if (!firstName) {
        onAlert("warning", "Будь ласка, введіть ім'я");
        return false;
      }
      if (!lastName) {
        onAlert("warning", "Будь ласка, введіть прізвище");
        return false;
      }
      if (!phone) {
        onAlert("warning", "Будь ласка, введіть телефон");
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
    if (time === "") {
      onAlert("warning", "Оберіть будь ласка час");
      return;
    }
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
        onAlert("success", "Запис успішно змінено.");
        mutate("/api/data_appointment");
        setLoadingButton(false);
        onClose();
      } else {
        console.error("Failed to update appointment");
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  // --------------Formating date-------------------//
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("uk-UA"); // Localize the date in the format "dd.mm.yyyy"
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

  return (
    <>
      <div className={styles.popup_form}>
        {loadingPage ? (
          <div className={styles.loadingPage_container}>
            <CircularProgress size="3rem" />
          </div>
        ) : (
          <>
            <h1 className={styles.title}>Редагування запису</h1>
            <div className={styles.main_container}>
              <div className={styles.calendar_wrapper}>
                <div className={styles.calendar_container}>
                  <div className={styles.title_task}>
                    {selectedDate ? (
                      <>
                        <span className={styles.TaskAltIcon}>
                          <TaskAltIcon
                            sx={{
                              width: "100%",
                              height: "100%",
                              color: "green",
                            }}
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
              </div>
              <div className={styles.form_fields_wrapper}>
                <div className={styles.form_fields}>
                  <div className={styles.title_task}>
                    {firstName &&
                    lastName &&
                    phone &&
                    date &&
                    time &&
                    doctor ? (
                      <>
                        <span className={styles.TaskAltIcon}>
                          <TaskAltIcon
                            sx={{
                              width: "100%",
                              height: "100%",
                              color: "green",
                            }}
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
                  <FormControl id="target" fullWidth sx={{ my: 3 }}>
                    <InputLabel id="select-label">Вид послуги</InputLabel>
                    <Select
                      labelId="select-label"
                      label="Вид послуги"
                      name="service"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
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
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <TextField
                    id="lastname"
                    sx={{
                      width: "100%",
                    }}
                    helperText=" "
                    label="Прізвище"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <TextField
                    id="patronymic"
                    sx={{ width: "100%" }}
                    helperText=" "
                    label="По батькові"
                    name="patronymic"
                    value={patronymic}
                    onChange={(e) => setPatronymic(e.target.value)}
                  />
                  <TextField
                    id="phone"
                    sx={{ width: "100%" }}
                    helperText=" "
                    label="Номер телефону"
                    placeholder="097 000 00 00"
                    name="phone"
                    value={phone}
                    onChange={handlePhoneChange}
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
                    id="date"
                    sx={{ width: "100%" }}
                    label="Дата"
                    helperText=" "
                    name="date"
                    value={formatDate(date)}
                  />
                  <TextField
                    id="time"
                    sx={{ width: "100%" }}
                    label="Час"
                    helperText=" "
                    name="time"
                    value={time}
                  />
                  <TextField
                    id="doctorName"
                    sx={{ width: "100%" }}
                    label="ПІБ лікаря"
                    helperText=" "
                    name="doctorName"
                    value={doctor.doctorName}
                  />
                </div>
              </div>
              <div className={styles.AvailableDoctors_wrapper}>
                <div className={styles.AvailableDoctors_container}>
                  <div className={styles.title_task}>
                    {appointmentData.time !== null ? (
                      <>
                        <span className={styles.TaskAltIcon}>
                          <TaskAltIcon
                            sx={{
                              width: "100%",
                              height: "100%",
                              color: "green",
                            }}
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
            </div>
            <div className={styles.buttons_container}>
              <ThemeProvider theme={theme}>
                <LoadingButton
                  sx={{ m: 1 }}
                  color="save"
                  onClick={handleSubmit}
                  loading={loadingButton}
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
                  onClick={onClose}
                  variant="contained"
                  size="large"
                >
                  Відміна
                </LoadingButton>
              </ThemeProvider>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PopupFormEditAppointment;
