import React, { useState, useEffect } from "react";
import axios from "axios";
import { mutate } from "swr";
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

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Making a request to the API to delete a user
      await axios.delete(`/api/data_appointment/delete/${userId}`);
      mutate("/api/data_appointment");
      clearSelectedUser();
      onClose();
      onAlert("success", "Запис успішно видалено");
    } catch (error) {
      alert("Error deleting appointment");
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
              Ви дійсно бажаєте видалити <strong>{selectedInitials}</strong>?
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
              {!loading ? "ТАК" : "ВИДАЛЕННЯ..."}
            </LoadingButton>
            <LoadingButton
              sx={{ m: 2, px: 5 }}
              variant="outlined"
              size="large"
              onClick={onClose}
            >
              Ні
            </LoadingButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteAppointmentForm;
