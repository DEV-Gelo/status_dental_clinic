"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import styles from "./UserCalendar.module.css";
import {
  MdOutlineArrowBackIosNew,
  MdOutlineArrowForwardIos,
} from "react-icons/md";

export default function UserCalendar({ onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null); // Array for selected dates
  const [highlightedDates, setHighlightedDates] = useState([]);
  // const [errorMessage, setErrorMessage] = useState("");

  // -------Translations----------//
  const t = useTranslations("calendar");
  const locale = t("language");

  useEffect(() => {
    const fetchHighlightedDates = async () => {
      try {
        const response = await fetch("/api/appointment/calendarHighlight");
        if (!response.ok) throw new Error("Failed to fetch highlighted dates");
        const data = await response.json();
        setHighlightedDates(data.dates); // save the received dates
      } catch (error) {
        console.error("Error fetching highlighted dates:", error);
      }
    };

    fetchHighlightedDates();
  }, []);

  const getMonthDays = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  // ------Set Monday as the first day of the week-----//
  const getStartDayOfMonth = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };
  // ------------Switch month to prev------------//
  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };
  // ----------------------------------------------//
  // ------------Switch month to next------------//
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };
  // ----------------------------------------------//
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getMonthDays(year, month);
  const startDay = getStartDayOfMonth(year, month);

  const daysArray = Array.from({ length: 42 }, (_, i) => {
    const day = i - startDay + 1;
    return day > 0 && day <= daysInMonth ? day : "";
  });

  const monthName = currentDate.toLocaleString(locale, {
    month: "long",
  });
  const capitalizedMonthName = monthName[0].toUpperCase() + monthName.slice(1);

  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  // Helper function to format date to "YYYY-MM-DD"
  const formatDate = (day) => {
    return `${String(day).padStart(2, "0")}.${String(month + 1).padStart(
      2,
      "0"
    )}.${year}`;
  };

  // -------Check if the day is highlighted---------------//
  const isHighlighted = (day) => {
    const formattedDate = formatDate(day);
    return highlightedDates.includes(formattedDate);
  };

  // -----------Select a day in the calendar-----------//
  const handleDayClick = (day) => {
    // --------Prohibit the selection of past dates--------//
    if (
      day &&
      (new Date(year, month, day) > today ||
        (year === todayYear && month === todayMonth && day === todayDay))
    ) {
      const newSelectedDate = new Date(year, month, day);
      setSelectedDate(newSelectedDate);
      onDateSelect(newSelectedDate);
    }
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button onClick={prevMonth}>
          <MdOutlineArrowBackIosNew />
        </button>
        <h2>
          {capitalizedMonthName} {year}р.
        </h2>
        <button onClick={nextMonth}>
          <MdOutlineArrowForwardIos />
        </button>
      </div>
      <div className={styles.grid}>
        {[
          t("Mon"),
          t("Tue"),
          t("Wed"),
          t("Thu"),
          t("Fri"),
          t("Sat"),
          t("Sun"),
        ].map((day) => (
          <div key={day} className={styles.dayName}>
            {day}
          </div>
        ))}
        {daysArray.map((day, i) => {
          const isPastDate =
            day &&
            new Date(year, month, day) <
              new Date(todayYear, todayMonth, todayDay);

          const isToday =
            day === todayDay &&
            month === todayMonth &&
            year === today.getFullYear();
          const isSelected =
            selectedDate &&
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === month &&
            selectedDate.getFullYear() === year;

          const highlighted = isHighlighted(day); // Check if the day is highlighted

          return (
            <div
              key={i}
              className={`${styles.day} 
                ${isToday ? styles.today : ""} 
                ${isSelected ? styles.selected : ""} 
                ${isPastDate ? styles.disabled : ""} 
                ${
                  highlighted
                    ? styles.highlighted_available
                    : styles.highlighted_notavailable
                }
                ${day ? styles.day : styles.emptyDay}`}
              onClick={() => !isPastDate && handleDayClick(day)}
            >
              {day}
            </div>
          );
        })}
      </div>
      {/* {errorMessage && <div className={styles.error}>{errorMessage}</div>} */}
    </div>
  );
}
