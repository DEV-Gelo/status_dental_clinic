import React, { useState } from "react";
import styles from "./ScheduleDT.module.css";

const DataTable = ({ daySchedules, selectedDoctor }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthName = currentDate.toLocaleString("uk-UA", { month: "long" });
  const capitalizedMonthName =
    monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const year = currentDate.getFullYear();

  // Функція для перевірки, чи дата в минулому
  const isPastDate = (scheduleDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Скидаємо час для порівняння тільки дати
    const dateToCheck = new Date(scheduleDate);
    return dateToCheck < today;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("uk-UA"); // Локалізуємо дату у форматі "dd.mm.yyyy"
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };
  return (
    <>
      <div className={styles.table_container}>
        <div className={styles.month_container}>
          <button onClick={prevMonth} className="bg-green-500" type="button">
            prev
          </button>
          <div className={`${styles.th} ${styles.month_header}`}>
            {capitalizedMonthName} {year}р.
          </div>
          <button onClick={nextMonth} className="bg-green-500" type="button">
            next
          </button>
        </div>
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
                  const scheduleMonth = new Date(date).getMonth(); // Отримати місяць
                  const currentMonth = currentDate.getMonth(); // Місяць з обраної дати
                  return scheduleMonth === currentMonth; // Порівняти місяці
                })
                .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                .map(([dates, objects]) => (
                  <tr key={dates}>
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
      </div>
    </>
  );
};

export default DataTable;
