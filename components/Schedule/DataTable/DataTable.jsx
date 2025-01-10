import React, { useState } from "react";
import styles from "./ScheduleDT.module.css";

const DataTable = ({ daySchedules, selectedDoctor, onCurrentDate }) => {
  const monthName = onCurrentDate.toLocaleString("uk-UA", { month: "long" });
  const capitalizedMonthName =
    monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const year = onCurrentDate.getFullYear();

  // A function to check if a date is in the past
  const isPastDate = (scheduleDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset the time to compare only dates
    const dateToCheck = new Date(scheduleDate);
    return dateToCheck < today;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("uk-UA"); // Localize the date in the format "dd.mm.yyyy"
  };

  return (
    <>
      <div className={styles.table_container}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.date_header}>Дата</th>
              <th className={styles.time_header}>Час</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {Object.entries(daySchedules)
              .filter(([date]) => {
                const scheduleMonth = new Date(date).getMonth(); // Get a month
                const currentMonth = onCurrentDate.getMonth(); // A month from the selected date
                return scheduleMonth === currentMonth; // Compare the months
              })
              .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
              .map(([dates, objects]) => (
                <tr
                  key={dates}
                  className={`${styles.tr_body} hover:bg-[#5ba3bb20]`}
                >
                  <td
                    className={`${styles.td} ${styles.date_body} ${
                      isPastDate(dates) ? styles.past_date : ""
                    }`}
                  >
                    {formatDate(dates)}
                  </td>

                  <td className={`${styles.td} ${styles.time_body}`}>
                    <div className={`${styles.slot_container}`}>
                      {objects.map((slot, index) => (
                        <p
                          key={index}
                          className={`${styles.slot} ${
                            isPastDate(dates) ? styles.past_date_slot : ""
                          }`}
                        >
                          {slot.time}
                        </p>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* -------------------------------------------------------------------------------------------- */}
      {/* <div className={styles.table_container}>
        <div className={styles.table_wrapper}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={`${styles.th} ${styles.date_header}`}>Дата</th>
                <th className={`${styles.th} ${styles.time_header}`}>Час</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {Object.entries(daySchedules)
                .filter(([date]) => {
                  const scheduleMonth = new Date(date).getMonth(); // Get a month
                  const currentMonth = onCurrentDate.getMonth(); // A month from the selected date
                  return scheduleMonth === currentMonth; // Compare the months
                })
                .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                .map(([dates, objects]) => (
                  <tr key={dates} className="hover:bg-[#5ba3bb20]">
                    <td
                      className={`${styles.td} ${styles.date_body} ${
                        isPastDate(dates) ? styles.past_date : ""
                      }`}
                    >
                      {formatDate(dates)}
                    </td>

                    <td className={`${styles.td} ${styles.time_body}`}>
                      {objects.map((slot, index) => (
                        <p
                          key={index}
                          className={`${styles.slot} ${
                            isPastDate(dates) ? styles.past_date_slot : ""
                          }`}
                        >
                          {slot.time}
                        </p>
                      ))}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </>
  );
};

export default DataTable;
