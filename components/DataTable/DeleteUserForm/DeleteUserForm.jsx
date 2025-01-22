import React, { useState } from "react";
import axios from "axios";
import { mutate } from "swr";
import styles from "./DeleteFormStyle.module.css";

import LoadingButton from "@mui/lab/LoadingButton";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const DeleteUserForm = ({
  onClose,
  userId,
  onClearUserId,
  selectedInitials,
  onAlert,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Making a request to the API to delete a user
      await axios.delete(`/api/users/${userId}`);
      mutate("/api/users");
      onAlert("success", "Запис видалено успішно");
      onClearUserId();
      onClose();
    } catch (error) {
      onAlert(
        "error",
        "Неможливо видалити лікаря, який має майбутні записи пацієнтів"
      );
    } finally {
      setLoading(false);
      onClose();
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

export default DeleteUserForm;
