"use client";
import { useRef } from "react";
import styles from "./UploadPhotoForm.module.css";

export default function UploadPhotoForm({ handleFileChange }) {
  const fileInput = useRef(null);

  async function uploadFile(evt) {
    evt.preventDefault();

    const formData = new FormData();
    formData.append("file", fileInput.current?.files?.[0]);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    console.log(result);
  }

  return (
    <form className={styles.upload_form}>
      <label htmlFor="file-input" className={styles.custom_file_upload}>
        ОБЕРІТЬ ФОТО
        <input
          className="hidden"
          id="file-input"
          type="file"
          accept="image/*"
          name="file"
          ref={fileInput}
          onChange={(e) => {
            handleFileChange(e);
            uploadFile(e);
          }}
        />
      </label>
    </form>
  );
}
