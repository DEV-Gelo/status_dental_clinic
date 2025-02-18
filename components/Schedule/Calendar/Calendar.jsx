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
  const [selectedDates, setSelectedDates] = useState([]); // Array for selected dates
  const [errorMessage, setErrorMessage] = useState(""); // Error message
  const [slots, setSlots] = useState([]); // Store slots for the doctor

  // ---------Translations-------------//
  const t = useTranslations("schedule__calendar");
  const local = t("language");

  // ---------- Load slots for the selected doctor------------//
  useEffect(() => {
    if (selectedDoctor) {
      setSelectedDates(resetSelectedDates);
      isLoadingSchedule(true);
      fetch(`/api/schedule/get?doctorId=${selectedDoctor}`)
        .then((response) => response.json())
        .then((data) => {
          // Group slots by date using schedule.date
          const groupedSlots = data.reduce((acc, slot) => {
            const scheduleDate = new Date(slot.schedule.date).toDateString();
            if (!acc[scheduleDate]) {
              acc[scheduleDate] = [];
            }
            acc[scheduleDate].push(slot);
            return acc;
          }, {});
          // ------Transfer grouped slots by date-----------//
          onDaySchedule(groupedSlots);

          // Select the first and last slot for each date
          const firstAndLastSlots = Object.keys(groupedSlots).map((date) => {
            const slotsOnDate = groupedSlots[date];
            const firstSlot = slotsOnDate[0]; // First slot
            const lastSlot = slotsOnDate[slotsOnDate.length - 1]; // Last slot
            return { date, slots: [firstSlot, lastSlot] };
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

  // -----Reset error message after select doctor--------//

  useEffect(() => {
    if (selectedDoctor && errorMessage) {
      setErrorMessage("");
    }
  }, [selectedDoctor]);

  // -----Send date--------//

  useEffect(() => {
    onTransferableDate(currentDate);
  }, [currentDate]);

  // -------------------------------------------------//
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
    setErrorMessage(""); // Reset a message when the month changes
  };

  // ------------Switch month to next------------//
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
    setErrorMessage(""); // Reset a message when the month changes
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

  const monthName = currentDate.toLocaleString(local, { month: "long" });
  const capitalizedMonthName = monthName[0].toUpperCase() + monthName.slice(1);

  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  // -----------Select a day in the calendar-----------//
  const handleDayClick = (day) => {
    if (!day) {
      // If the cell is empty, exit the function
      return;
    }
    if (!selectedDoctor) {
      // If the doctor is not selected, do not allow the selection of the date
      onAlert("warning", t("notSelectedDoctor"));
      return; // Stop further processing
    }

    // -------------Select dates---------------//
    if (
      day &&
      (new Date(year, month, day) > today ||
        (year === todayYear && month === todayMonth && day === todayDay))
    ) {
      const newSelectedDate = new Date(year, month, day);
      const isDateSelected = selectedDates.some(
        (date) =>
          date.getDate() === newSelectedDate.getDate() &&
          date.getMonth() === newSelectedDate.getMonth() &&
          date.getFullYear() === newSelectedDate.getFullYear()
      );

      let updatedDates;
      if (isDateSelected) {
        updatedDates = selectedDates.filter(
          (date) =>
            !(
              date.getDate() === newSelectedDate.getDate() &&
              date.getMonth() === newSelectedDate.getMonth() &&
              date.getFullYear() === newSelectedDate.getFullYear()
            )
        );
      } else {
        updatedDates = [...selectedDates, newSelectedDate];
      }

      // Checking whether the array has actually changed
      if (JSON.stringify(updatedDates) !== JSON.stringify(selectedDates)) {
        setSelectedDates(updatedDates);
        onDateSelect(updatedDates); // Transfer only when changing
      }
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
          const isPastDate =
            day &&
            new Date(year, month, day) <
              new Date(todayYear, todayMonth, todayDay);

          const isToday =
            day === todayDay &&
            month === todayMonth &&
            year === today.getFullYear();
          const isSelected = selectedDates.some(
            (date) =>
              date.getDate() === day &&
              date.getMonth() === month &&
              date.getFullYear() === year
          );

          //  Filter only those slots that correspond to the current day
          const slotsForDay =
            day &&
            slots.find(
              (slotGroup) =>
                new Date(slotGroup.date).toDateString() ===
                new Date(year, month, day).toDateString()
            );

          return (
            <div
              key={i}
              className={`${styles.day} 
                ${isToday ? styles.today : ""} 
                ${isSelected ? styles.selected : ""} 
                ${isPastDate ? styles.disabled : ""} 
                ${day ? styles.day : styles.emptyDay}`}
              onClick={() => !isPastDate && handleDayClick(day)}
            >
              {day}
              {day &&
                !isPastDate &&
                slotsForDay &&
                slotsForDay.slots.length > 0 && (
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
