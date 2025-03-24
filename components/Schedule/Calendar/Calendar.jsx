"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import styles from "./Calendar.module.css";
import {
  MdOutlineArrowBackIosNew,
  MdOutlineArrowForwardIos,
} from "react-icons/md";

export default function Calendar({
  onDateSelect,
  selectedDoctor,
  onDaySchedule,
  resetSelectedDates,
  onTransferableDate,
  onAlert,
  isLoadingSchedule,
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [slots, setSlots] = useState([]);

  const t = useTranslations("schedule__calendar");
  const local = t("language");

  useEffect(() => {
    if (selectedDoctor) {
      setSelectedDates(resetSelectedDates);
      isLoadingSchedule(true);
      fetch(`/api/schedule/get?doctorId=${selectedDoctor}`)
        .then((response) => response.json())
        .then((data) => {
          const groupedSlots = data.reduce((acc, slot) => {
            const scheduleDate = new Date(slot.schedule.date).toISOString();
            if (!acc[scheduleDate]) {
              acc[scheduleDate] = [];
            }
            acc[scheduleDate].push(slot);
            return acc;
          }, {});

          onDaySchedule(groupedSlots);

          const firstAndLastSlots = Object.keys(groupedSlots).map((date) => {
            const slotsOnDate = groupedSlots[date];
            return {
              date,
              slots: [slotsOnDate[0], slotsOnDate[slotsOnDate.length - 1]],
            };
          });

          setSlots(firstAndLastSlots);
          isLoadingSchedule(false);
        })
        .catch((error) => {
          console.error("Error loading slots:", error);
          setSlots([]);
        });
    } else {
      setSlots([]);
    }
  }, [selectedDoctor, resetSelectedDates]);

  useEffect(() => {
    if (selectedDoctor && errorMessage) {
      setErrorMessage("");
    }
  }, [selectedDoctor]);

  useEffect(() => {
    onTransferableDate(currentDate);
  }, [currentDate]);

  const getMonthDays = (year, month) => new Date(year, month + 1, 0).getDate();

  const getStartDayOfMonth = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getMonthDays(year, month);
  const startDay = getStartDayOfMonth(year, month);
  const daysArray = Array.from({ length: 42 }, (_, i) => {
    const day = i - startDay + 1;
    return day > 0 && day <= daysInMonth ? day : "";
  });

  const monthName = currentDate.toLocaleString(local, { month: "long" });
  const capitalizedMonthName = monthName[0].toUpperCase() + monthName.slice(1);

  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const handleDayClick = (day) => {
    if (!day || !selectedDoctor) {
      onAlert("warning", t("notSelectedDoctor"));
      return;
    }

    const newSelectedDate = new Date(Date.UTC(year, month, day)).toISOString();
    const isSelected = selectedDates.includes(newSelectedDate);

    let updatedDates = isSelected
      ? selectedDates.filter((dateStr) => dateStr !== newSelectedDate)
      : [...selectedDates, newSelectedDate];

    console.log("updatedDates:", updatedDates);

    if (JSON.stringify(updatedDates) !== JSON.stringify(selectedDates)) {
      setSelectedDates(updatedDates);
      onDateSelect(updatedDates);
    }
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button onClick={prevMonth}>
          <MdOutlineArrowBackIosNew />
        </button>
        <h2>
          {capitalizedMonthName} {year}
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
          const dayISO = day
            ? new Date(Date.UTC(year, month, day)).toISOString()
            : null;
          const isSelected = selectedDates.includes(dayISO);
          const slotsForDay = slots.find(
            (slotGroup) => slotGroup.date === dayISO
          );

          return (
            <div
              key={i}
              className={`${styles.day} ${isSelected ? styles.selected : ""} ${
                day ? styles.day : styles.emptyDay
              }`}
              onClick={() => day && handleDayClick(day)}
            >
              {day}
              {day && slotsForDay && slotsForDay.slots.length > 0 && (
                <span className={styles.slot}>
                  {slotsForDay.slots[0].time} -{" "}
                  {slotsForDay.slots[slotsForDay.slots.length - 1].time}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
    </div>
  );
}
