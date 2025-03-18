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
      if (!firstName) return onAlert("warning", t("validation.firstName"));
      if (!lastName) return onAlert("warning", t("validation.lastName"));
      if (!phone) return onAlert("warning", t("validation.phone"));
      if (!email) return onAlert("warning", t("validation.email"));
      if (!role) return onAlert("warning", t("validation.role"));
      return true; // Validation passed
    };

    if (!validateForm()) return; // Stop execution if validation fails

    setLoading(true);

    try {
      let photoUrl = "/image-placeholder.png"; // Default avatar

      if (file) {
        const allowedTypes = ["image/jpeg", "image/png"];
        const maxFileSize = 2 * 1024 * 1024; // 2MB

        if (!allowedTypes.includes(file.type))
          return onAlert("warning", t("validation.invalidType"));
        if (file.size > maxFileSize)
          return onAlert("warning", t("validation.sizeExceeded"));

        // Upload file
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadResponse.ok) throw new Error("File upload failed");

        const uploadResult = await uploadResponse.json();
        if (uploadResult.status !== "success")
          throw new Error("File upload error");

        photoUrl = `/uploads/${file.name}`;
      }

      // Send user data
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          patronymic,
          specialization,
          phone,
          email,
          role,
          photo: photoUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error creating user");
      }

      // Force cache refresh after creation
      await mutate("/api/users", null, { revalidate: true });

      // Clear form
      setFirstName("");
      setLastName("");
      setPatronymic("");
      setPhone("");
      setEmail("");
      setSpecialization("");
      closeForm();
      onAlert("success", t("validation.createSuccess"));
    } catch (error) {
      console.error(error);
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
