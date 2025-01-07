"use client";

import { useState } from "react";

const ScheduleGenerator = ({ dates, times, doctorId, onSaveSuccess }) => {
  // Генерація розкладу
  const formattedSchedule = dates
    .map((date) => {
      const localDate = new Date(date);
      localDate.setHours(localDate.getHours() + 2);
      const formattedDate = localDate.toISOString().split("T")[0];

      return times.map((time) => {
        return {
          date: formattedDate, // Використовуємо без змінення часової зони
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
      alert("Дати не обрані!");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dates, // Масив обраних дат
          slots: formattedSchedule, // Інтервали часу
          doctorId: parseInt(doctorId, 10),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Помилка: ${error.error}`);
        return;
      }

      alert("Розклад успішно збережено!");

      onSaveSuccess();
    } catch (err) {
      alert(`Помилка з'єднання: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  async function deleteSchedule(dates, doctorId) {
    try {
      const response = await fetch("/api/schedule/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dates, // Масив дат
          doctorId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        window.alert(result.message);

        onSaveSuccess();
      } else {
        window.alert("Помилка: " + result.error);
      }
    } catch (error) {
      console.error("Error calling DELETE endpoint:", error);
      window.alert("Сталася помилка при спробі видалення.");
    }
  }

  return (
    <div className="flex w-full h-auto p-2 justify-center items-center">
      <button
        className="m-2 p-2 border-[1px] border-[#5ba3bb]"
        onClick={() => saveSchedule()}
        disabled={isSaving}
      >
        {isSaving ? "Збереження..." : "Зберегти"}
      </button>
      <button
        className="m-2 p-2 border-[1px] border-[#5ba3bb]"
        onClick={() => deleteSchedule(dates, doctorId)}
        disabled={isDeleting}
      >
        {isDeleting ? "Видалення..." : "Видалити"}
      </button>
    </div>
  );
};

export default ScheduleGenerator;
