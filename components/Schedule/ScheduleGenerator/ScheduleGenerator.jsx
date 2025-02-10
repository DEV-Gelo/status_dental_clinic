"use client";

import { useState } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { ThemeProvider } from "@mui/material/styles";

// ----------Stylisation buttons MUI-----------------//
import { theme } from "@/components/Stylisation_MUI/stylisation_button_MUI";

const ScheduleGenerator = ({
  dates,
  times,
  doctorId,
  onResetSelectedDates,
  onAlert,
}) => {
  // Schedule generation
  const formattedSchedule = dates
    .map((date) => {
      const localDate = new Date(date);
      localDate.setHours(localDate.getHours() + 2);
      const formattedDate = localDate.toISOString().split("T")[0];

      return times.map((time) => {
        return {
          date: formattedDate, // Use it without changing the time zone
          time: time,
          doctorId,
        };
      });
    })
    .flat();

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const saveSchedule = async () => {
    if (dates.length <= 0) {
      onAlert("warning", "Оберіть будь ласка дату");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dates, // An array of selected dates
          slots: formattedSchedule, // Time intervals
          doctorId: parseInt(doctorId, 10),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Помилка: ${error.error}`);
        return;
      }

      onAlert("success", "Розклад успішно збережено!");

      onResetSelectedDates();
    } catch (err) {
      alert(`Помилка з'єднання: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  async function deleteSchedule(dates, doctorId) {
    if (dates.length <= 0) {
      onAlert("warning", "Оберіть будь ласка дату");
      return;
    }
    setIsDeleting(true);
    try {
      const response = await fetch("/api/schedule/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dates, // Array of dates
          doctorId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        onResetSelectedDates();
        setIsDeleting(false);
        onAlert("success", "Запис успішно видалено!");
      } else {
        window.alert("Помилка: " + result.error);
      }
    } catch (error) {
      console.error("Error calling DELETE endpoint:", error);
      window.alert("Сталася помилка при спробі видалення.");
    }
  }

  return (
    <div className="flex w-full h-auto justify-center items-center">
      <ThemeProvider theme={theme}>
        <LoadingButton
          sx={{ m: 1 }}
          color="save"
          onClick={saveSchedule}
          loading={isSaving}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="contained"
          size="large"
        >
          Записати
        </LoadingButton>
        <LoadingButton
          sx={{ m: 1 }}
          color="cancel"
          onClick={() => deleteSchedule(dates, doctorId)}
          loading={isDeleting}
          loadingPosition="start"
          startIcon={<DeleteForeverIcon className="text-red-300" />}
          variant="contained"
          size="large"
        >
          Видалити
        </LoadingButton>
      </ThemeProvider>
    </div>
  );
};

export default ScheduleGenerator;
