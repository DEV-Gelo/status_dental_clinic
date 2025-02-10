"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import styles from "./DataAppointmentStyle.module.css";
// ----------Import React components---------------//
import { IoPersonAddSharp } from "react-icons/io5";
import { MdDeleteForever, MdEditSquare } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { RiCloseLargeFill } from "react-icons/ri";
// ----------Import MUI components---------------//
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
// ----------Import stylisation for serch input----------------//
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "@/components/Stylisation_MUI/stylisation_search";
// ----------Import of internal components----------------//
import DeleteAppointmentForm from "@/components/DataTableAppointment/DeleteAppointmentForm/DeleteAppointmentForm";
import PopupFormAddAppointment from "@/components/DataTableAppointment/PopupFormAddAppointment/PopupFormAppointment";
import PopupFormEditAppointment from "@/components/DataTableAppointment/PopupFormEditAppointment/PopupFormEditAppointment";
import FilterDate from "@/components/FilterDate/FilterDate";

const Admin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditForm, setIsOpenEditForm] = useState(false);
  const [isOpenDel, setIsOpenDel] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedInitials, setSelectedInitials] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dayFilter, setDayFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    severity: "success",
    message: "",
  });

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

  // ---Cancellation of line selection with a key Esc and delete with key Delete---//
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedUserId(null);
        setIsOpenDel(false);
      }
      if (event.key === "Delete") {
        handleDelete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedUserId]);

  const handleOpenFilter = () => {
    setIsOpenFilter((prev) => !prev);
  };

  // -------------Get Data--------------------------//
  const fetchData_Appointment = async () => {
    const response = await fetch("/api/data_appointment");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return response.json();
  };

  const { data, error } = useSWR(
    "/api/data_appointment",
    fetchData_Appointment
  );

  if (error)
    return (
      <div className={styles.error_loading}>
        <Alert className={styles.alert_loading} severity="warning">
          <h6>Помилка завантаження даних</h6>
          <p>Перевірте з'єднання</p>
        </Alert>
      </div>
    );
  if (!data)
    return (
      <div className={styles.loading_data}>
        <CircularProgress size="3rem" />
      </div>
    );

  // ------Select row in table and get initials------//
  const handleSelectInitials = (lastName, firstName, patronymic) => {
    setSelectedInitials(`${lastName} ${firstName} ${patronymic}`);
  };

  //---------Сlear the selected user-------------//
  const clearSelectedUser = () => {
    setSelectedUserId(null);
    setSelectedInitials("");
  };

  // Function for filtering and searching records
  const filteredData = data.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    const appointmentYear = appointmentDate.getFullYear();
    const appointmentMonth = appointmentDate.toLocaleString("uk-UA", {
      month: "long",
    });
    const capitalizedMonthName =
      appointmentMonth[0].toUpperCase() + appointmentMonth.slice(1);
    const appointmentDay = appointmentDate.getDate();

    // Search
    const searchTermLower = searchTerm.toLowerCase();
    const fullName =
      `${appointment.lastName} ${appointment.firstName} ${appointment.patronymic}`.toLowerCase();
    const phone = (appointment.phone || "").toLowerCase();
    const service = (appointment.service || "").toLowerCase();

    const matchesSearchTerm =
      fullName.includes(searchTermLower) ||
      phone.includes(searchTermLower) ||
      service.includes(searchTermLower);

    // Filtration
    const matchesYear = yearFilter
      ? appointmentYear === parseInt(yearFilter)
      : true;
    const matchesMonth = monthFilter
      ? capitalizedMonthName === monthFilter
      : true;
    const matchesDay = dayFilter
      ? appointmentDay === parseInt(dayFilter)
      : true;
    const matchesDoctor = doctorFilter
      ? appointment.doctorId === parseInt(doctorFilter)
      : true;
    // Combine search and filtering conditions
    return (
      matchesSearchTerm &&
      matchesYear &&
      matchesMonth &&
      matchesDay &&
      matchesDoctor
    );
  });

  // --------------Formating date-------------------//

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("uk-UA"); // Localize the date in the format "dd.mm.yyyy"
  };

  // --------Open popup window------------------------//
  const handlePopup_form = () => {
    setIsOpen(true);
  };
  const handlePopupEdit_form = () => {
    if (!selectedUserId) {
      showAlert("warning", "Будь ласка, оберіть користувача для редагування.");
      return;
    }
    setIsOpenEditForm(true);
  };

  // --------Open delete window------------------------//
  const handleDelete = () => {
    if (!selectedUserId) {
      showAlert("warning", "Будь ласка, оберіть запис який бажаєте видалити.");
      return;
    }
    setIsOpenDel(true);
  };
  // ----------Select row in table and get ID---------//
  const handleRowClick = (id) => {
    setSelectedUserId(id);
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

  return (
    <>
      <div className={styles.users_page_wrap}>
        <h1 className={styles.title}>Записи на прийом</h1>
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
        {/* ------------- Delete Window --------------------- */}

        {isOpenDel && (
          <DeleteAppointmentForm
            onClose={() => setIsOpenDel(false)}
            userId={selectedUserId}
            selectedInitials={selectedInitials}
            onAlert={showAlert}
            clearSelectedUser={clearSelectedUser}
          />
        )}

        {/* ---------------- Popup Form --------------------- */}
        {isOpen && (
          <PopupFormAddAppointment
            onClose={() => setIsOpen(false)}
            onAlert={showAlert}
          />
        )}
        {isOpenEditForm && (
          <PopupFormEditAppointment
            userId={selectedUserId}
            onClose={() => setIsOpenEditForm(false)}
            onAlert={showAlert}
          />
        )}

        {/* -------------------Table Navbar---------------------- */}

        <div className={styles.table_navbar}>
          {/* -------Buttons navigstion------- */}
          <div className={styles.table_navigation}>
            <Fab
              sx={{ zIndex: 0, m: 2 }}
              onClick={handlePopup_form}
              title="Додати запис"
              size="small"
              aria-label="add"
              color="primary"
            >
              <AddIcon />
            </Fab>

            <Fab
              sx={{ zIndex: 0, m: 2 }}
              onClick={handlePopupEdit_form}
              title="Редагувати запис"
              size="small"
              aria-label="edit"
              color="primary"
            >
              <EditIcon />
            </Fab>

            <Fab
              sx={{ zIndex: 0, m: 2 }}
              onClick={handleDelete}
              title="Видалити запис"
              size="small"
              aria-label="delete"
              color="primary"
            >
              <DeleteIcon />
            </Fab>
          </div>
          {/* <div className={styles.table_navigation}>
            <button
              onClick={handlePopup_form}
              type="button"
              title="Додати запис"
              className={`${styles.button_nav} text-green-900`}
            >
              <IoPersonAddSharp />
            </button>
            <button
              onClick={handlePopupEdit_form}
              type="button"
              title="Редагувати запис"
              className={`${styles.button_nav} text-yellow-700`}
            >
              <MdEditSquare />
            </button>
            <button
              onClick={handleDelete}
              type="button"
              title="Видалити запис"
              className={`${styles.button_nav} text-red-900`}
            >
              <MdDeleteForever />
            </button>
          </div> */}

          <div className={styles.filter_container}>
            <button
              className={styles.button_filter}
              type="button"
              onClick={handleOpenFilter}
            >
              {isOpenFilter ? (
                <RiCloseLargeFill />
              ) : (
                <div title="Фільтр" className={styles.filter_icon}>
                  <CalendarMonthIcon />
                </div>
              )}
            </button>

            <div
              className={
                isOpenFilter ? styles.filter_wrap : styles.filter_wrap_hidden
              }
            >
              <FilterDate
                doctors={doctors}
                onDoctorFilter={setDoctorFilter}
                onYearFilter={setYearFilter}
                onMonthFilter={setMonthFilter}
                onDayFilter={setDayFilter}
              />
            </div>
          </div>

          <div className={styles.table_search}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Пошук…"
                inputProps={{ "aria-label": "search" }}
                type="text"
                title="Введіть текст для пошуку"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Search>
          </div>
        </div>

        {/* -------------------Users Table------------------- */}

        <div className={styles.table_container}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.id_th}>№</th>
                <th>ПІБ</th>
                <th>
                  <FaPhone />
                </th>
                <th>Дата</th>
                <th>Час</th>
                <th>Сервіс</th>
                <th>Лікар</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {filteredData.map((user, index) => (
                <tr
                  className={`${
                    selectedUserId === user.id
                      ? styles.tr_body_selected
                      : "hover:bg-[#5ba3bb20]"
                  }
                      ${styles.tr_body}`}
                  key={user.id}
                  onClick={() => {
                    handleRowClick(user.id);
                    handleSelectInitials(
                      user.lastName,
                      user.firstName,
                      user.patronymic
                    );
                  }}
                >
                  <td className={styles.id_td}>{index + 1}</td>
                  <td>
                    {`${user.lastName} ${user.firstName} ${user.patronymic}`}
                  </td>
                  <td>{user.phone || "No phone available"}</td>
                  <td>{formatDate(user.date)}</td>
                  <td>{user.time}</td>
                  <td>{user.service}</td>
                  <td>
                    {`${user.doctor.lastName} ${user.doctor.firstName}
                    ${user.doctor.patronymic}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Admin;
