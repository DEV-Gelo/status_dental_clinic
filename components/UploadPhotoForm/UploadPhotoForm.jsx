"use client";
import React, { useState, useRef } from "react";
import { useTranslations } from "next-intl";
// --------------Import MUI--------------------------//
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function UploadPhotoForm({ handleFileChange }) {
  const fileInput = useRef(null);
  const [uploading, setUploading] = useState(false); // Стейт для завантаження
  const [photoUrl, setPhotoUrl] = useState(""); // Стейт для збереження URL фото

  // -------Translations----------//
  const t = useTranslations("UploadPhotoForm");

  async function uploadFile(evt) {
    evt.preventDefault();
    setUploading(true); // Починаємо завантаження

    const formData = new FormData();
    formData.append("file", fileInput.current?.files?.[0]);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (result.status === "success") {
        setPhotoUrl(result.url); // Зберігаємо URL завантаженого фото
        alert("Фото успішно завантажено!"); // Можна показати повідомлення
      } else {
        alert("Щось пішло не так, спробуйте ще раз");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Сталася помилка під час завантаження");
    } finally {
      setUploading(false); // Завершуємо завантаження
    }
  }

  return (
    <form className="flex flex-col w-full justify-center items-center p-[1rem]">
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        disabled={uploading} // Забороняємо повторно завантажувати до завершення попереднього
      >
        {t("DOWNLOAD")}
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
      </Button>

      {photoUrl && (
        <div className="mt-4">
          <h4>Завантажене фото:</h4>
          <img src={photoUrl} alt="Uploaded" style={{ width: "200px" }} />
        </div>
      )}
    </form>
  );
}
