"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import styles from "./UsersStyle.module.css";
// -------Import React components------------------//
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
// -------Import MUI components------------------//
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
// ----------Import stylisation for serch input----------------//
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "@/components/Stylisation_MUI/stylisation_search";
// ----------Import of internal components----------------//
import DeleteUserForm from "@/components/DataTable/DeleteUserForm/DeleteUserForm";
import PopupForm from "@/components/DataTable/PopupFormAddUser/PopupForm";
import PopupFormEdit from "@/components/DataTable/PopupFormEditUser/PopupFormEdit";
import FormAddAppointment from "@/components/DataTable/FormAddAppointment/FormAddAppointment";
import styled from "@emotion/styled";

const Users = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditForm, setIsOpenEditForm] = useState(false);
  const [isOpenAddAppointment, setIsOpenAddAppointment] = useState(false);
  const [isOpenDel, setIsOpenDel] = useState(false);
  const [role, setRole] = useState("Лікар");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedInitials, setSelectedInitials] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  // ------Cancellation of line selection with a key Esc-----//
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

  // -------------Get Data--------------------------//
  const fetchUsers = async () => {
    const response = await fetch("/api/users");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return response.json();
  };

  const { data, error } = useSWR("/api/users", fetchUsers);

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

  // ----------Filtration users for role-------------//

  const filteredUsers = data
    .filter((user) => {
      if (!user.role) return false;
      if (role === "Лікар") return user.role.toLowerCase() === "лікар";
      if (role === "Пацієнт") return user.role.toLowerCase() === "пацієнт";
      return true;
    })
    .filter((user) =>
      `${user.firstName || ""} ${user.lastName || ""} ${
        user.patronymic || ""
      } ${user.phone || ""} ${user.email || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

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
      showAlert("warning", "Будь ласка, оберіть користувача для видалення.");
      return;
    }
    setIsOpenDel(true);
  };

  // ----------Select row in table and get ID---------//
  const handleRowClick = (id) => {
    setSelectedUserId(id);
  };

  // ------Select row in table and get initials------//
  const handleSelectInitials = (lastName, firstName, patronymic) => {
    setSelectedInitials(`${lastName} ${firstName} ${patronymic}`);
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
          <DeleteUserForm
            onClose={() => setIsOpenDel(false)}
            userId={selectedUserId}
            selectedInitials={selectedInitials}
            onAlert={showAlert}
            onClearUserId={() => setSelectedUserId(null)}
          />
        )}

        {/* ---------------- Popup Form --------------------- */}
        {isOpen && (
          <PopupForm
            role={role}
            onAlert={showAlert}
            onClose={() => setIsOpen(false)}
          />
        )}
        {isOpenEditForm && (
          <PopupFormEdit
            onAlert={showAlert}
            userId={selectedUserId}
            onClose={() => setIsOpenEditForm(false)}
            role={role}
          />
        )}
        {isOpenAddAppointment && (
          <FormAddAppointment
            onAlert={showAlert}
            userId={selectedUserId}
            onClose={() => setIsOpenAddAppointment(false)}
          />
        )}

        {/* -------------------Table Navbar---------------------- */}

        <div className={styles.table_navbar}>
          {/* -------Buttons navigstion------- */}
          <div className={styles.table_navigation}>
            <Fab
              sx={{ zIndex: 0, m: 2 }}
              onClick={handlePopup_form}
              title="Додати користувача"
              size="small"
              aria-label="add"
              color="primary"
            >
              <AddIcon />
            </Fab>

            <Fab
              sx={{ zIndex: 0, m: 2 }}
              onClick={handlePopupEdit_form}
              title="Редагувати користувача"
              size="small"
              aria-label="edit"
              color="primary"
            >
              <EditIcon />
            </Fab>

            <Fab
              sx={{ zIndex: 0, m: 2 }}
              onClick={handleDelete}
              title="Видалити користувача"
              size="small"
              aria-label="delete"
              color="primary"
            >
              <DeleteIcon />
            </Fab>
          </div>
          {/* ------Switch role container----- */}
          <div className={styles.table_switch}>
            <button className={styles.table_switch_button_doctor}>Лікар</button>
            <button className={styles.table_switch_button_active}>
              Пацієнт
            </button>

            {/* <FormControl variant="standard" sx={{ m: 1, minWidth: "auto" }}>
              <InputLabel id="role-label">Фільтр</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                label="Role"
              >
                <MenuItem value="Лікар">Лікар</MenuItem>
                <MenuItem value="Пацієнт">Пацієнт</MenuItem>
              </Select>
            </FormControl> */}
          </div>

          {/* ------Search container------- */}
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
                <th className={styles.photo_th}>Фото</th>
                <th>ПІБ</th>
                <th>Категорія</th>
                <th>
                  <FaPhone />
                </th>
                <th className={styles.email_th}>
                  <MdEmail />
                </th>
                {role !== "Лікар" && (
                  <th className={styles.create_record_th}></th>
                )}
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {filteredUsers.map((user, index) => (
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
                  <td className={styles.photo_td}>
                    {user.photo && <img src={user.photo} alt="User photo" />}
                  </td>
                  <td>
                    {user.lastName} {user.firstName} {user.patronymic}
                  </td>
                  <td>
                    {role === "Пацієнт" ? user.role : user.specialization}
                  </td>
                  <td>{user.phone || "No phone available"}</td>
                  <td className={styles.email_td}>
                    {user.email || "No email available"}
                  </td>
                  {role === "Пацієнт" ? (
                    <td
                      className={styles.create_record_td}
                      title="Створити запис"
                    >
                      <AddCircleOutlineIcon
                        onClick={() => setIsOpenAddAppointment(true)}
                      />
                    </td>
                  ) : (
                    ""
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Users;
