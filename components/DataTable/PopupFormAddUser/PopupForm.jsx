import React, { useState } from "react";
import Switch from "@mui/material/Switch";
import { mutate } from "swr";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import UploadPhotoForm from "@/components/UploadPhotoForm/UploadPhotoForm";
import styles from "./PopupFormStyle.module.css";

// --------------Import MUI--------------------------//
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { ThemeProvider } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";

// ----------Stylisation buttons MUI-----------------//
import { theme } from "@/components/Stylisation_MUI/stylisation_button_MUI";

const label = { inputProps: { "aria-label": "Switch demo" } };

const PopupForm = ({ onClose, onAlert, role }) => {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [switchDisplayPhoto, setSwitchDisplayPhoto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [specialization, setSpecialization] = useState("");

  // -------Translations----------//
  const t = useTranslations("users_add_window");
  const pathname = usePathname();

  // Uploading and displaying a photo in the form
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImage(URL.createObjectURL(selectedFile));
      setFile(selectedFile);
    }
  };

  // -----------Close window---------------//

  const closeForm = () => {
    onClose();
  };

  const handleSwitch = () => {
    setSwitchDisplayPhoto((prev) => !prev);
  };

  //---Get and save value from TextField and validation---//

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Validation for email
    if (name === "email") {
      // Update the value without checking the email at each step
      setEmail(value);

      // After the update, check email for validity
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(!emailRegex.test(value));
    }
    // Validation for phone
    else if (name === "phone") {
      const sanitizedValue = value.replace(/\D/g, "");
      if (sanitizedValue.length <= 10) {
        setPhone(sanitizedValue);
      }
    }
  };

  //--- The function of sending the form to the server ---//
  const handleSubmit = async () => {
    // --------Validation form-----------//
    const validateForm = () => {
      if (!firstName) {
        onAlert("warning", t("validation.firstName"));
        return false;
      }
      if (!lastName) {
        onAlert("warning", t("validation.lastName"));
        return false;
      }
      if (!phone) {
        onAlert("warning", t("validation.phone"));
        return false;
      }
      if (!email) {
        onAlert("warning", t("validation.email"));
        return false;
      }

      if (!role) {
        onAlert("warning", t("validation.role"));
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
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("patronymic", patronymic);
    formData.append("specialization", specialization);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("role", role);

    const defaultAvatar = "/image-placeholder.png"; // Default avatar

    let photoUrl = defaultAvatar;

    if (file) {
      // -----Checking the file---------//
      const allowedTypes = ["image/jpeg", "image/png"];
      const maxFileSize = 2 * 1024 * 1024; // 2MB

      if (!allowedTypes.includes(file.type)) {
        onAlert("warning", t("validation.invalidType"));
        return;
      }

      if (file.size > maxFileSize) {
        onAlert("warning", t("validation.sizeExceeded"));
        return;
      }

      try {
        setLoading(true);

        // Form data for loading
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        const uploadResult = await uploadResponse.json();

        if (uploadResponse.ok && uploadResult.status === "success") {
          // Forming the correct URL to the file in Supabase
          photoUrl = uploadResult.fileUrl;
        } else {
          console.error("Failed to upload file");
          onAlert("error", t("validation.uploadError"));
          return;
        }
      } catch (error) {
        setLoading(false);
        console.error("File upload error:", error);
        onAlert("error", t("validation.uploadError"));
        return;
      }
    }

    // Add the path to the photo in formData
    if (photoUrl) {
      formData.append("photo", photoUrl);
    }
    try {
      setLoading(true);
      // Send data user
      const response = await fetch("/api/users/create", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        mutate("/api/users");

        setLoading(false);

        // Clear form
        setFirstName("");
        setLastName("");
        setPatronymic("");
        setPhone("");
        setEmail("");
        setSpecialization("");
        closeForm();
        onAlert("success", t("validation.createSuccess"));
      } else {
        const errorData = await response.json();
        console.error("Error creating user:", errorData);
        onAlert("warning", errorData.message || t("validation.createError"));
      }
    } catch (error) {
      console.error("An error occurred:", error);
      onAlert("error", t("validation.createError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.popup_form}>
        <h1 className={styles.title}>{t("title")}</h1>
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
            <TextField
              id="firstname"
              sx={{ width: "100%" }}
              helperText=" "
              label={t("firstName")}
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
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
              label={t("lastName")}
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {pathname.split("/")[1] === "uk" && (
              <TextField
                id="patronymic"
                sx={{ width: "100%" }}
                helperText=" "
                label={t("patronymic")}
                name="patronymic"
                value={patronymic}
                onChange={(e) => setPatronymic(e.target.value)}
              />
            )}
            {role === "doctor" && (
              <TextField
                id="specialization"
                sx={{ width: "100%" }}
                helperText=" "
                label={t("specialization")}
                name="specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
            )}
            <TextField
              id="phone"
              sx={{ width: "100%" }}
              helperText=" "
              label="Номер телефону"
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
              label={t("label email")}
              name="email"
              value={email}
              onChange={handleInputChange}
              error={emailError}
              helperText={emailError ? t("error") : " "}
            />

            <div className={styles.switch_display_photo}>
              <h6>{t("addPhoto")}</h6>
              <Switch
                onClick={handleSwitch}
                {...label}
                checked={switchDisplayPhoto}
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
              {t("save")}
            </LoadingButton>
            <LoadingButton
              sx={{ m: 1 }}
              color="cancel"
              onClick={() => {
                closeForm();
                setImage(null);
              }}
              variant="contained"
              size="large"
            >
              {t("cancel")}
            </LoadingButton>
          </ThemeProvider>
        </div>
      </div>
    </>
  );
};

export default PopupForm;
