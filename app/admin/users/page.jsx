"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import styles from "./UsersStyle.module.css";
import { IoPersonAddSharp, IoSearchSharp } from "react-icons/io5";
import { MdDeleteForever, MdEditSquare, MdEmail } from "react-icons/md";
import { FaUserDoctor, FaUserLarge, FaPhone } from "react-icons/fa6";

import DeleteUserForm from "@/components/DataTable/DeleteUserForm/DeleteUserForm";
import { AnimatePresence } from "framer-motion";
import PopupForm from "@/components/DataTable/PopupFormAddUser/PopupForm";
import PopupFormEdit from "@/components/DataTable/PopupFormEditUser/PopupFormEdit";

const Users = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditForm, setIsOpenEditForm] = useState(false);
  const [isOpenDel, setIsOpenDel] = useState(false);
  const [triggerDoctor, setTriggerDoctor] = useState(true);
  const [triggerUser, setTriggerUser] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedInitials, setSelectedInitials] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ------Cancellation of line selection with a key Esc-----//
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedUserId(null);
        setIsOpenDel(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // --------------------------------------------------------//

  // -------------Get Data--------------------------//
  const fetchUsers = async () => {
    const response = await fetch("/api/users");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return response.json();
  };

  const { data, error } = useSWR("/api/users", fetchUsers);

  if (error) return <div>Error loading users</div>;
  if (!data) return <div>Loading...</div>;

  // -----------------------------------------------//

  const filteredUsers = data
    .filter((user) => {
      if (!user.role) return false;
      if (triggerDoctor && !triggerUser)
        return user.role.toLowerCase() === "лікар";
      if (triggerUser && !triggerDoctor)
        return user.role.toLowerCase() === "пацієнт";
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
      alert("Будь ласка, оберіть користувача для редагування.");
      return;
    }
    setIsOpenEditForm(true);
  };
  // -----------------------------------------------//

  // --------Open delete window------------------------//
  const handleDelete = () => {
    if (!selectedUserId) {
      alert("Будь ласка, оберіть користувача перед видаленням.");
      return;
    }
    setIsOpenDel(true);
  };
  // -----------------------------------------------//
  // ----------Select row in table and get ID---------//
  const handleRowClick = (id) => {
    setSelectedUserId(id);
  };
  // ------------------------------------------------//
  // ------Select row in table and get initials------//
  const handleSelectInitials = (lastName, firstName, patronymic) => {
    setSelectedInitials(`${lastName} ${firstName} ${patronymic}`);
  };
  // ------------------------------------------------//
  // Switch between categories in the table ------------

  const activeTriggerDoctor = () => {
    setTriggerDoctor(true); // Activate doctor filter
    setTriggerUser(false); // Deactivate user filter
  };

  const activeTriggerUser = () => {
    setTriggerDoctor(false); // Deactivate doctor filter
    setTriggerUser(true); // Activate user filter
  };

  //-------------------------------------------------------//

  return (
    <>
      <div className={styles.users_page_wrap}>
        {/* ------------- Delete Window --------------------- */}
        <AnimatePresence>
          {isOpenDel && (
            <DeleteUserForm
              onClose={() => setIsOpenDel(false)}
              userId={selectedUserId}
              selectedInitials={selectedInitials}
            />
          )}
        </AnimatePresence>
        {/* ------------------------------------------------- */}

        {/* ---------------- Popup Form --------------------- */}
        {isOpen && <PopupForm onClose={() => setIsOpen(false)} />}
        {isOpenEditForm && (
          <PopupFormEdit
            userId={selectedUserId}
            onClose={() => setIsOpenEditForm(false)}
          />
        )}

        {/* --------------------------------------------------- */}

        {/* -------------------Table Navbar---------------------- */}

        <div className={styles.table_navbar}>
          <div className={styles.table_navigation}>
            <button
              onClick={handlePopup_form}
              type="button"
              title="Додати користувача"
              className={`${styles.button_nav} mx-5 text-green-900`}
            >
              <IoPersonAddSharp />
            </button>
            <button
              onClick={handlePopupEdit_form}
              type="button"
              title="Редагувати користувача"
              className={`${styles.button_nav} mx-5 text-yellow-700`}
            >
              <MdEditSquare />
            </button>
            <button
              onClick={handleDelete}
              type="button"
              title="Видалити користувача"
              className={`${styles.button_nav} mx-5 text-red-900`}
            >
              <MdDeleteForever />
            </button>
          </div>
          <div className={styles.table_switch}>
            <button
              type="button"
              title="Фільтр лікарів"
              onClick={activeTriggerDoctor}
              className={`${
                triggerDoctor ? "border-[2px] border-green-500" : "border-[1px]"
              } ${styles.trigger}`}
            >
              <FaUserDoctor />
            </button>
            <button
              type="button"
              title="Фільтр пацієнтів"
              onClick={activeTriggerUser}
              className={`${
                triggerUser ? "border-[2px] border-green-500" : "border-[1px]"
              } ${styles.trigger}`}
            >
              <FaUserLarge />
            </button>
          </div>
          <div className={styles.table_search}>
            <input
              type="text"
              title="Введіть текст для пошуку"
              placeholder="Пошук"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div
              className={`${styles.search_icon} text-[24px] text-white mx-[0.5rem]`}
            >
              <IoSearchSharp />
            </div>
          </div>
        </div>

        {/* --------------------------------------------------- */}

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
                <th>
                  <MdEmail />
                </th>
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
                  <td>{user.role}</td>
                  <td>{user.phone || "No phone available"}</td>
                  <td>{user.email || "No email available"}</td>
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
