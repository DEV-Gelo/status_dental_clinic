"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
// ---------------------MUI components------------------------//
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
// ---------------Iternal components----------------------------//
import Pricing from "@/components/admin_settings/Pricing";

const Settings = () => {
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  // ---------------Translations-----------------//
  const t = useTranslations("settings");

  // -----------Alert windows--------------------------//
  const showAlert = (severity, message) => {
    setAlertConfig({ open: true, severity, message });
  };
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertConfig({ ...alertConfig, open: false });
  };

  return (
    <>
      <main className="flex w-full h-full overflow-hidden">
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={alertConfig.open}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
        >
          <Alert
            onClose={handleCloseAlert}
            severity={alertConfig.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {alertConfig.message}
          </Alert>
        </Snackbar>

        <div className="flex flex-col w-full h-full py-4 px-1 sm:px-4">
          <header className="flex w-full h-auto justify-center items-center">
            <h1 className="text-[1.2rem] sm:text-[1.5rem] font-semibold text-[#a7adaf] mb-5 sm:mb-6">
              {t("price")}{" "}
            </h1>
          </header>
          <Pricing onAlert={showAlert} />
        </div>
      </main>
    </>
  );
};

export default Settings;
