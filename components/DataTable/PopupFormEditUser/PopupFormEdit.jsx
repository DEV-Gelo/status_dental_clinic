import React, { useState, useEffect } from "react";
import Switch from "@mui/material/Switch";
import { mutate } from "swr";
import UploadPhotoForm from "@/components/UploadPhotoForm/UploadPhotoForm";
import styles from "./PopupFormEditStyle.module.css";

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
import CircularProgress from "@mui/material/CircularProgress";

// ----------Stylisation buttons MUI-----------------//
import { theme } from "@/components/Stylisation_Buttons/stylisation_button_MUI";

const label = { inputProps: { "aria-label": "Switch demo" } };

const PopupFormEdit = ({ userId, onClose, onAlert }) => {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [switchDisplayPhoto, setSwitchDisplayPhoto] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

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
        setEmail(data.email || "");
        setRole(data.role || "");
        setImage(data.photo || "/image-placeholder.png");
        setSwitchDisplayPhoto(data.photo !== "/image-placeholder.png");
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
        setImage("/image-placeholder.png");
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
    // --------Validation form-----------//
    const validateForm = () => {
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
      if (!email) {
        onAlert("warning", "Будь ласка, введіть електронну пошту");
        return false;
      }

      if (!role) {
        onAlert("warning", "Будь ласка, оберіть категорію користувача.");
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
    formData.append("email", email);
    formData.append("role", role);

    let photoUrl = image;

    if (file) {
      try {
        setLoading(true);
        // Downloading a file via a separate route
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const uploadResponse = await fetch("/api/upload", {
          method: "PUT",
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
      setLoading(true);
      // Send data user
      const response = await fetch("/api/users/edit", {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        mutate("/api/users");
        setLoading(false);
        onClose();
        onAlert("success", "Редагування запису успішно виконано");
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
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
              <FormControl fullWidth sx={{ my: 3 }}>
                <InputLabel id="select-label">Категорія користувача</InputLabel>
                <Select
                  labelId="select-label"
                  label="Категорія користувача"
                  name="category"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <MenuItem value="Лікар">Лікар</MenuItem>
                  <MenuItem value="Пацієнт">Пацієнт</MenuItem>
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
                  "& .MuiFormHelperText-root": {
                    color: "red",
                  },
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
                value={email}
                onChange={handleInputChange}
                error={emailError}
                helperText={emailError ? "Некоректний формат Е-пошти" : " "}
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
                onClick={() => {
                  onClose();
                  setImage(null);
                }}
                variant="contained"
                size="large"
              >
                Відміна
              </LoadingButton>
            </ThemeProvider>
          </div>
        </div>
      )}
    </>
  );
};

export default PopupFormEdit;
