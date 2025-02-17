"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import styles from "./DataAppointmentStyle.module.css";
import { useTranslations } from "next-intl";
// ----------Import React components---------------//
import { FaPhone } from "react-icons/fa6";
import { RiArrowDownWideLine } from "react-icons/ri";
import { RiArrowUpWideLine } from "react-icons/ri";
// ----------Import MUI components---------------//
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
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
  // -------Translations----------//
  const t = useTranslations("admin");
  const locale = t("language");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors");
        if (!response.ok) {
          throw new Error(`${t("Doctor error")}`);
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
          <h6>{t("Error loading data")}</h6>
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

  // ---Function for filtering and searching records--//
  const filteredData = data.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    const appointmentYear = appointmentDate.getFullYear();
    const appointmentMonth = appointmentDate.toLocaleString(locale, {
      month: "long",
    });
    const capitalizedMonthName =
      appointmentMonth[0].toUpperCase() + appointmentMonth.slice(1);
    const appointmentDay = appointmentDate.getDate();
    // -------------------Search------------------//
    const searchTermLower = searchTerm.toLowerCase();
    const fullName =
      `${appointment.lastName} ${appointment.firstName} ${appointment.patronymic}`.toLowerCase();
    const phone = (appointment.phone || "").toLowerCase();
    const service = (appointment.service || "").toLowerCase();

    const matchesSearchTerm =
      fullName.includes(searchTermLower) ||
      phone.includes(searchTermLower) ||
      service.includes(searchTermLower);

    //------ Filtration---------//
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
    // -----Combine search and filtering conditions--//
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

    return date.toLocaleDateString(locale); // Localize the date in the format "dd.mm.yyyy"
  };

  // --------Open popup window------------------------//
  const handlePopup_form = () => {
    setIsOpen(true);
  };
  const handlePopupEdit_form = () => {
    if (!selectedUserId) {
      showAlert("warning", `${t("Edit_alert")}`);
      return;
    }
    setIsOpenEditForm(true);
  };

  // --------Open delete window------------------------//
  const handleDelete = () => {
    if (!selectedUserId) {
      showAlert("warning", `${t("Delete_alert")}`);
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
        <h1 className={styles.title}>{t("Appointments")}</h1>
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
              title={t("Add a record")}
              size="small"
              aria-label="add"
              color="primary"
            >
              <AddIcon />
            </Fab>

            <Fab
              sx={{ zIndex: 0, m: 2 }}
              onClick={handlePopupEdit_form}
              title={t("Edit entry")}
              size="small"
              aria-label="edit"
              color="primary"
            >
              <EditIcon />
            </Fab>

            <Fab
              sx={{ zIndex: 0, m: 2 }}
              onClick={handleDelete}
              title={t("Delete entry")}
              size="small"
              aria-label="delete"
              color="primary"
            >
              <DeleteIcon />
            </Fab>
          </div>
          {/* ----------Filter container----------- */}
          <div className={styles.filter_container}>
            <button
              className={styles.button_filter}
              type="button"
              title={t("Filter")}
              onClick={handleOpenFilter}
            >
              {isOpenFilter ? (
                <span>
                  <RiArrowUpWideLine />
                </span>
              ) : (
                <span>
                  <RiArrowDownWideLine />
                </span>
              )}
            </button>

            <div
              className={`${styles.filter_wrap} ${
                isOpenFilter ? styles.open : styles.closed
              }`}
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
          {/* -----------Search container----------- */}
          <div className={styles.table_search}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder={t("Search")}
                inputProps={{ "aria-label": "search" }}
                type="text"
                title={t("Search_title")}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Search>
          </div>
        </div>

        {/* -------------------Appoinment Table------------------- */}

        <div className={styles.table_container}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.id_th}>№</th>
                <th>{t("Name_table")}</th>
                <th>
                  <FaPhone />
                </th>
                <th>{t("Date_table")}</th>
                <th>{t("Time_table")}</th>
                <th>{t("Service_table")}</th>
                <th>{t("Doctor_table")}</th>
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
