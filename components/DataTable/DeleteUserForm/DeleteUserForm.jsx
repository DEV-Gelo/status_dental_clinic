import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { mutate } from "swr";
import styles from "./DeleteFormStyle.module.css";

const DeleteUserForm = ({ onClose, userId, selectedInitials }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Making a request to the API to delete a user
      await axios.delete(`/api/users/${userId}`);
      mutate("/api/users");
      onClose();
    } catch (error) {
      alert("Error deleting user");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
        className={styles.delete_window}
      >
        <h6>
          {loading
            ? "Видалення..."
            : `Ви дійсно бажаєте видалити ${selectedInitials}?`}
        </h6>
        <div className={styles.button_block}>
          <motion.button
            onClick={handleDelete}
            disabled={loading}
            whileTap={{ scale: 0.8 }}
            transition={{ duration: 0.5 }}
            type="button"
            className={styles.button_ok}
          >
            Так
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.8 }}
            transition={{ duration: 0.5 }}
            type="button"
            className={styles.button_cancel}
            onClick={onClose}
          >
            ВІДМІНА
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default DeleteUserForm;
