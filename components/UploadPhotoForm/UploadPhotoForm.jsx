"use client";
import React from "react";
import { useRef } from "react";
import { useTranslations } from "next-intl";
// --------------Import MUI--------------------------//
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function UploadPhotoForm({ handleFileChange }) {
  const fileInput = useRef(null);

  // -------Translations----------//
  const t = useTranslations("UploadPhotoForm");

  // async function uploadFile(evt) {
  //   evt.preventDefault();

  //   const formData = new FormData();
  //   formData.append("file", fileInput.current?.files?.[0]);

  //   const response = await fetch("/api/upload", {
  //     method: "POST",
  //     body: formData,
  //   });
  //   const result = await response.json();
  // }

  return (
    <form className="flex flex-col w-full justify-center items-center p-[1rem]">
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
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
            // uploadFile(e);
          }}
        />
      </Button>
    </form>
  );
}
