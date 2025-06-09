import React, { useState } from "react";
import axios from "axios";
import { mutate } from "swr";
import { useTranslations } from "next-intl";
import styles from "./DeleteFormStyle.module.css";
// -------Import MUI components------------------//
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

  // -------Translations----------//
  const t = useTranslations("users_delete_window");

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "An unexpected error occurred");
      }

      mutate("/api/users");
      onAlert("success", t("Record deleted successfully"));
      onClearUserId();
      onClose();
    } catch (error) {
      onAlert("error", t(error.message));
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
              {t("You really want to delete")} <br />
              <strong>{selectedInitials}</strong> <strong>?</strong>
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

export default DeleteUserForm;
