import React, { useState, useEffect } from "react";
import Switch from "@mui/material/Switch";
import { mutate } from "swr";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import UploadPhotoForm from "@/components/UploadPhotoForm/UploadPhotoForm";
import styles from "./PopupFormEditStyle.module.css";

// --------------Import MUI--------------------------//
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { ThemeProvider } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";

// ----------Stylisation buttons MUI-----------------//
import { theme } from "@/components/Stylisation_MUI/stylisation_button_MUI";

const label = { inputProps: { "aria-label": "Switch demo" } };

const PopupFormEdit = ({ userId, onClose, onAlert, role }) => {
  const [image, setImage] = useState(null);
  const [initialImage, setInitialImage] = useState(null);
  const [file, setFile] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [initialPhone, setInitialPhone] = useState("");
  const [initialEmail, setInitialEmail] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [switchDisplayPhoto, setSwitchDisplayPhoto] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // -------Translations----------//
  const t = useTranslations("users_edit_window");
  const pathname = usePathname();

  // --------Get data from users-------------//
  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        setLoadingData(true);
        const response = await fetch(`/api/users/edit/${userId}`);
        const data = await response.json();
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setPatronymic(data.patronymic || "");
        setPhone(data.phone || "");
        setInitialPhone(data.phone || "");
        setEmail(data.email || "");
        setInitialEmail(data.email || "");
        setSpecialization(data.specialization || "");
        setImage(data.photo || "/image-placeholder.svg");
        setInitialImage(data.photo || "/image-placeholder.svg");
        setSwitchDisplayPhoto(data.photo !== "/image-placeholder.svg");
        setLoadingData(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  // ---------Switch mode with photo or without-------------//

  const handleSwitch = () => {
    setSwitchDisplayPhoto((prev) => {
      const newState = !prev;

      if (!newState) {
        setImage("/image-placeholder.svg");
        setFile(null);
      }

      return newState;
    });
  };

  // Uploading and displaying a photo in the form

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImage(URL.createObjectURL(selectedFile));
      setFile(selectedFile);
    }
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

  // The function of sending the form to the server ---
  const handleSubmit = async () => {
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
      return true;
    };

    if (!validateForm()) return;

    try {
      setLoading(true);

      // Check if email or phone has changed
      if (email !== initialEmail || phone !== initialPhone) {
        const checkResponse = await fetch("/api/users/check", {
          method: "POST",
          body: JSON.stringify({ email, phone, userId }),
          headers: { "Content-Type": "application/json" },
        });

        const checkResult = await checkResponse.json();

        if (!checkResponse.ok) {
          console.log("Error message :", checkResult.message);
          if (checkResult.message === "This email already exists") {
            onAlert("warning", t("validation.email_exists"));
          } else if (
            checkResult.message === "This phone number already exists"
          ) {
            onAlert("warning", t("validation.phone_exists"));
          } else {
            onAlert("warning", t("validation.editError"));
          }
          setLoading(false);
          return;
        }
      }

      // Forming FormData
      const formData = new FormData();
      formData.append("id", userId);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("patronymic", patronymic);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("specialization", specialization);

      let photoUrl = image;
      if (image && image.includes("image-placeholder.svg")) {
        await fetch("/api/users/edit/delete_photo", {
          method: "POST",
          body: JSON.stringify({ photoUrl: initialImage }),
          headers: { "Content-Type": "application/json" },
        });
      }

      if (file) {
        const allowedTypes = ["image/jpeg", "image/png"];
        const maxFileSize = 2 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
          onAlert("warning", t("validation.invalidType"));
          return;
        }

        if (file.size > maxFileSize) {
          onAlert("warning", t("validation.sizeExceeded"));
          return;
        }

        const filePath = image
          ? image.replace(
              `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/`,
              ""
            )
          : `${Date.now()}-${file.name}`;

        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        uploadFormData.append("filePath", filePath);
        uploadFormData.append("userId", userId);

        const uploadResponse = await fetch("/api/upload", {
          method: "PUT",
          body: uploadFormData,
        });

        const uploadResult = await uploadResponse.json();

        if (uploadResponse.ok && uploadResult.status === "success") {
          photoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${filePath}`;
        } else {
          onAlert("error", t("validation.uploadError"));
          return;
        }
      }

      if (photoUrl) {
        formData.append("photo", photoUrl);
      }

      // Sending updated user data
      const response = await fetch("/api/users/edit", {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        mutate("/api/users");
        onClose();
        onAlert("success", t("validation.editSuccess"));
      } else {
        const errorData = await response.json();
        console.log("Error message :", errorData);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      onAlert("error", t("validation.editError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loadingData ? (
        <div className="flex w-full h-full justify-center items-center absolute top-0 left-0 z-30 bg-[#fff]">
          <CircularProgress />
        </div>
      ) : (
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
                label="Прізвище"
                name={t("lastName")}
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
                label={t("Phone number")}
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
                  onClose();
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
      )}
    </>
  );
};

export default PopupFormEdit;
