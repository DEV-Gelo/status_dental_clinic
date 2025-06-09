import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./ScheduleDT.module.css";
// --------------Import MUI components-----------------//
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

  // ---------Translations-------------//
  const t = useTranslations("schedule__DataTable");
  const local = t("language");

  const monthName = onCurrentDate.toLocaleString(local, { month: "long" });
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
        onAlert("success", t("successAlertDel"));
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
    return date.toLocaleDateString(local);
  };

  return (
    <div className={styles.table_container}>
      <div className={styles.switchDisplayPastDate}>
        <p>{t("Date filter")}</p>
        <Switch
          title={t("Date filter")}
          checked={!switchDisplayPastDate}
          onClick={() => setSwitchDisplayPastDate((prev) => !prev)}
          inputProps={{ "aria-label": "controlled" }}
          size="small"
        />
      </div>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.date_header}>{t("Date")}</th>
            <th className={styles.time_header}>{t("Time")}</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {/* ----Display skeleton when loading the schedule----- */}
          {isLoadingSchedule ? (
            Array.from({ length: 8 }).map((_, index) => (
              <tr key={index} className={styles.tr_body}>
                <td className={`${styles.td} ${styles.date_body}`}>
                  <Skeleton variant="rounded" width="100%" height={60} />
                </td>
                <td className={`${styles.td} ${styles.time_body}`}>
                  <Skeleton variant="rounded" width="100%" height={60} />
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
                    className={`${styles.tr_body} hover:bg-[#f0f0f0]`}
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
                            title={t("delete")}
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
                      {`${t(
                        "There are no records for the selected doctor as of"
                      )} ${monthName} ${t("missing")}`}
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
                {t("Display schedule")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
