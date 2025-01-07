import React, { useState } from "react";
import { popup_form_variants } from "@/utils/variants";
import Switch from "@mui/material/Switch";
import { motion } from "framer-motion";
import { mutate } from "swr";
import UploadPhotoForm from "@/components/UploadPhotoForm/UploadPhotoForm";
import styles from "./PopupFormStyle.module.css";

const label = { inputProps: { "aria-label": "Switch demo" } };

const PopupForm = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [switchDisplayPhoto, setSwitchDisplayPhoto] = useState(false);

  const [role, setRole] = useState("");
  // Uploading and displaying a photo in the form

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImage(URL.createObjectURL(selectedFile));
      setFile(selectedFile);
    }
  };

  // ---------------------------------------------//

  const closeForm = () => {
    onClose();
  };

  const handlSelectCategory = (event) => {
    const value = event.target.value;
    setSelectedCategory(value);
    setRole(
      value === "doctor" ? "Лікар" : value === "patient" ? "Пацієнт" : ""
    );
  };

  const handleSwitch = () => {
    setSwitchDisplayPhoto((prev) => !prev);
  };

  //----------------------------------------------//

  // The function of sending the form to the server ---
  const handleSubmit = async () => {
    const formData = new FormData();

    // Add data text
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("patronymic", patronymic);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("role", role);

    const defaultAvatar = "/image-placeholder.png"; // Default Avatar for user in the table

    let photoUrl = defaultAvatar;

    if (file) {
      try {
        // Downloading a file via a separate route
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        const uploadResult = await uploadResponse.json();

        if (uploadResponse.ok && uploadResult.status === "success") {
          photoUrl = `/uploads/${file.name}`;
        } else {
          console.error("Failed to upload file");
          return;
        }
      } catch (error) {
        console.error("File upload error:", error);
        return;
      }
    }

    // Add the path
    if (photoUrl) {
      formData.append("photo", photoUrl);
    }

    try {
      // Send data user
      const response = await fetch("/api/users/create", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("User created:", result);
        mutate("/api/users");

        // Clear form
        setFirstName("");
        setLastName("");
        setPatronymic("");
        setPhone("");
        setEmail("");

        setRole("");
        closeForm();
      } else {
        console.error("Failed to create user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // --------------------------------------------------
  return (
    <>
      <motion.div
        initial={false}
        // animate={isOpen ? "open" : "closed"}
        variants={popup_form_variants}
        className={styles.popup_form}
      >
        <div className={styles.main_container}>
          <div
            className={
              switchDisplayPhoto === false
                ? styles.hidden_photo_container
                : styles.photo_container
            }
          >
            <div className={styles.photo_field}>
              <div className={styles.displaying_file}>
                {image && <img src={image} alt="Uploaded" />}
              </div>

              <UploadPhotoForm handleFileChange={handleFileChange} />
            </div>
          </div>
          <div className={styles.form_fields}>
            <select
              name="category"
              value={selectedCategory}
              onChange={handlSelectCategory}
            >
              <option className={styles.disabled_selected} value="" disabled>
                Оберіть категорію користувача!
              </option>
              <option className={styles.selected_variant_1} value="doctor">
                Лікар
              </option>
              <option className={styles.selected_variant_2} value="patient">
                Пацієнт
              </option>
            </select>
            <input
              type="text"
              placeholder="Ім'я"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Прізвище"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="text"
              placeholder="По батькові"
              value={patronymic}
              onChange={(e) => setPatronymic(e.target.value)}
            />
            <input
              type="text"
              placeholder="Номер телефону"
              className="input_phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="text"
              placeholder="Електронна пошта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className={styles.switch_display_photo}>
              <h6>Додати фото користувача</h6>
              <Switch
                onClick={handleSwitch}
                {...label}
                checked={switchDisplayPhoto}
              />
            </div>
          </div>
        </div>
        <div className={styles.buttons_container}>
          <motion.button
            whileTap={{ scale: 0.8 }}
            transition={{ duration: 0.5 }}
            type="submit"
            className={styles.save_button}
            onClick={handleSubmit}
          >
            ЗБЕРЕГТИ
          </motion.button>
          <motion.button
            onClick={() => {
              closeForm();
              setImage(null);
            }}
            whileTap={{ scale: 0.8 }}
            transition={{ duration: 0.5 }}
            type="button"
            className={styles.cancel_button}
          >
            ВІДМІНИТИ
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default PopupForm;
