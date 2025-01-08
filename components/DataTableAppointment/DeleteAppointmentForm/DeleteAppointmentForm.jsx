import React, { useState } from "react";
import axios from "axios";
import { mutate } from "swr";
import styles from "./DeleteAppointmentFormStyle.module.css";

import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const DeleteAppointmentForm = ({ onClose, userId, selectedInitials }) => {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    try {
      // Making a request to the API to delete a user
      await axios.delete(`/api/data_appointment/delete/${userId}`);
      mutate("/api/data_appointment");
      onClose();
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
              {loading ? (
                <>
                  Видалення...
                  <CircularProgress size="1rem" />
                </>
              ) : (
                <p>
                  Ви дійсно бажаєте видалити <strong>{selectedInitials}</strong>
                  ?
                </p>
              )}
            </h6>
          </div>
          <div className={styles.button_block}>
            <Button
              sx={{ m: 2 }}
              variant="outlined"
              size="medium"
              onClick={handleDelete}
            >
              Так
            </Button>
            <Button
              sx={{ m: 2 }}
              variant="outlined"
              size="medium"
              onClick={onClose}
            >
              Ні
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteAppointmentForm;
