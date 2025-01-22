import React, { useEffect, useState } from "react";
import styles from "./ScheduleDT.module.css";

import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import Switch from "@mui/material/Switch";

const DataTable = ({
  daySchedules,
  onCurrentDate,
  onAlert,
  onResetSelectedDates,
  selectedDoctor,
  isLoadingSchedule,
}) => {
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [deletingRows, setDeletingRows] = useState({});
  const [switchDisplayPastDate, setSwitchDisplayPastDate] = useState(true);

  const monthName = onCurrentDate.toLocaleString("uk-UA", { month: "long" });
  // Selection of slots
  const toggleSlotSelection = (slot) => {
    setSelectedSlots((prevSelected) => {
      if (prevSelected.some((s) => s.id === slot.id)) {
        return prevSelected.filter((s) => s.id !== slot.id);
      } else {
        return [...prevSelected, slot];
      }
    });
  };

  // Deleting slots for a specific date
  const handleDeleteSlots = async (date) => {
    setDeletingRows((prev) => ({ ...prev, [date]: true }));

    const slotsForDate = selectedSlots.filter((slot) =>
      daySchedules[date]?.some((s) => s.id === slot.id)
    );

    const slotIds = slotsForDate.map((slot) => slot.id);

    try {
      const response = await fetch("/api/schedule/delete_slots", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotIds }),
      });

      const data = await response.json();
      if (response.ok) {
        onAlert("success", "Слоти успішно видалено");
        setSelectedSlots((prevSelected) =>
          prevSelected.filter((slot) => !slotIds.includes(slot.id))
        );
        onResetSelectedDates();
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setDeletingRows((prev) => ({ ...prev, [date]: false }));
    }
  };

  const isPastDate = (scheduleDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(scheduleDate);
    return dateToCheck < today;
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA");
  };

  return (
    <div className={styles.table_container}>
      <div className={styles.switchDisplayPastDate}>
        <p>Фільтр дат</p>
        <Switch
          title="Фільтр дат"
          checked={switchDisplayPastDate}
          onClick={() => setSwitchDisplayPastDate((prev) => !prev)}
          inputProps={{ "aria-label": "controlled" }}
          size="small"
        />
      </div>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.date_header}>Дата</th>
            <th className={styles.time_header}>Час</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {/* ----Display skeleton when loading the schedule----- */}
          {isLoadingSchedule ? (
            Array.from({ length: 4 }).map((_, index) => (
              <tr key={index} className={styles.tr_body}>
                <td className={`${styles.td} ${styles.date_body}`}>
                  <Skeleton variant="rounded" width="100%" height={120} />
                </td>
                <td className={`${styles.td} ${styles.time_body}`}>
                  <Skeleton variant="rounded" width="100%" height={120} />
                </td>
              </tr>
            ))
          ) : selectedDoctor ? (
            Object.entries(daySchedules)
              .filter(([date]) => {
                const scheduleMonth = new Date(date).getMonth();
                const currentMonth = onCurrentDate.getMonth();
                return scheduleMonth === currentMonth;
              })
              .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
              .map(([date, slots]) =>
                switchDisplayPastDate && isPastDate(date) ? (
                  ""
                ) : (
                  <tr
                    key={date}
                    className={`${styles.tr_body} hover:bg-[#5ba3bb20]`}
                  >
                    <td
                      className={`${styles.td} ${styles.date_body} ${
                        isPastDate(date) ? styles.past_date : ""
                      }`}
                    >
                      {formatDate(date)}
                    </td>
                    <td className={`${styles.td} ${styles.time_body}`}>
                      <div className={styles.slot_button_container}>
                        <div className={`${styles.slot_container}`}>
                          {slots.map((slot, index) => (
                            <p
                              key={index}
                              className={`${styles.slot} ${
                                isPastDate(date) ? styles.past_date_slot : ""
                              } ${slot.isBooked ? styles.isBooked_slot : ""} ${
                                selectedSlots.some((s) => s.id === slot.id)
                                  ? styles.selected_slot
                                  : ""
                              }`}
                              onClick={() => toggleSlotSelection(slot)}
                            >
                              {slot.time}
                            </p>
                          ))}
                        </div>
                        <div className={styles.button_container}>
                          <button
                            title="Видалити"
                            className={styles.delete_button}
                            onClick={() => handleDeleteSlots(date)}
                            disabled={
                              !selectedSlots.some((s) =>
                                daySchedules[date]?.some(
                                  (slot) => slot.id === s.id
                                )
                              )
                            }
                          >
                            {deletingRows[date] ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : (
                              <DeleteIcon />
                            )}
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              )
              // If there is no data after filtering and sorting
              .concat(
                Object.entries(daySchedules).filter(([date]) => {
                  const scheduleMonth = new Date(date).getMonth();
                  const currentMonth = onCurrentDate.getMonth();
                  return scheduleMonth === currentMonth;
                }).length === 0 && (
                  <tr key={monthName}>
                    <td
                      colSpan={2}
                      className={`${styles.td} ${styles.noDataMessage}`}
                    >
                      {`Записи для обраного лікаря станом на ${monthName} місяць відсутні.`}
                    </td>
                  </tr>
                )
              )
          ) : (
            <tr>
              <td
                colSpan={2}
                className={`${styles.td} ${styles.noDataMessage}`}
              >
                {`Оберіть лікаря, для відображення розкладу.`}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
