import React, { useState } from "react";
import axios from "axios";
import { mutate } from "swr";
import { useTranslations } from "next-intl";
import styles from "./DeleteAppointmentFormStyle.module.css";

import LoadingButton from "@mui/lab/LoadingButton";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const DeleteAppointmentForm = ({
  onClose,
  userId,
  selectedInitials,
  onAlert,
  clearSelectedUser,
}) => {
  const [loading, setLoading] = useState(false);

  // -------Translations----------//
  const t = useTranslations("admin__delete_window");

  // ------Delete function---------//
  const handleDelete = async () => {
    setLoading(true);
    try {
      // Making a request to the API to delete a user
      await axios.delete(`/api/data_appointment/delete/${userId}`);
      mutate("/api/data_appointment");
      clearSelectedUser();
      onClose();
      onAlert("success", t("Success_delete_alert"));
    } catch (error) {
      onAlert("Error", "deleting appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.delete_window}>
        <div className={styles.delete_modal}>
          <div className={styles.icon_text_container}>
            <WarningAmberIcon sx={{ color: "#ffa726" }} />
            <h6>
              {t("You really want to delete")}{" "}
              <strong>{selectedInitials}</strong>?
            </h6>
          </div>
          <div className={styles.button_block}>
            <LoadingButton
              sx={{ m: 2, px: 5 }}
              variant="outlined"
              loading={loading}
              loadingPosition="end"
              size="large"
              onClick={handleDelete}
            >
              {!loading ? t("Yes") : t("Deleting")}
            </LoadingButton>
            <LoadingButton
              sx={{ m: 2, px: 5 }}
              variant="outlined"
              size="large"
              onClick={onClose}
            >
              {t("No")}
            </LoadingButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteAppointmentForm;
