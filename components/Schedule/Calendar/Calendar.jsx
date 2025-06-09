"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import styles from "./Calendar.module.css";
// ---Import React components----//
import {
  MdOutlineArrowBackIosNew,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
//---Import MUI components---//
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export default function Calendar({
  onDateSelect,
  selectedDoctor,
  onDaySchedule,
  resetSelectedDates,
  onTransferableDate,
  onAlert,
  isLoadingSchedule,
  clearCheckbox,
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [slots, setSlots] = useState([]);
  const [isSelectedCheckbox, setIsSelectedCheckbox] = useState(false);
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
          const groupedSlots = data.reduce((acc, slot) => {
            const scheduleDate = new Date(slot.schedule.date)
              .toISOString()
              .split("T")[0];
            if (!acc[scheduleDate]) {
              acc[scheduleDate] = [];
            }
            acc[scheduleDate].push(slot);
            return acc;
          }, {});

          // ------Transfer grouped slots by date-----------//
          onDaySchedule(groupedSlots);
          // ---Select the first and last slot for each date----//
          const firstAndLastSlots = Object.keys(groupedSlots).map((date) => {
            const slotsOnDate = groupedSlots[date];
            return {
              date,
              slots: [slotsOnDate[0], slotsOnDate[slotsOnDate.length - 1]],
            };
          });

          setSlots(firstAndLastSlots); // Update the slots state
          isLoadingSchedule(false);
        })
        .catch((error) => {
          console.error("Error loading slots:", error);
          setSlots([]); // Clear slots if error occurs
        });
    } else {
      setSlots([]); // Clear slots if no doctor is selected
    }
  }, [selectedDoctor, resetSelectedDates]);

  // -----Reset error message after select doctor--------//
  useEffect(() => {
    if (selectedDoctor && errorMessage) {
      setErrorMessage(""); // Reset error message if doctor is selected
    }
  }, [selectedDoctor]);

  // -----Send date--------//
  useEffect(() => {
    onTransferableDate(currentDate); // Pass the current date to parent component
  }, [currentDate]);

  const getMonthDays = (year, month) => new Date(year, month + 1, 0).getDate();

  // ------Clear checkbox------//
  useEffect(() => {
    setIsSelectedCheckbox(false);
  }, [clearCheckbox]);

  // ------Set Monday as the first day of the week-----//
  const getStartDayOfMonth = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  // ------------Switch month to prev------------//
  const prevMonth = () => {
    if (selectedDates.length > 0) {
      onAlert("warning", t("choose_month"));
      return;
    }
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
    setErrorMessage(""); // Reset error message when the month changes
  };

  // ------------Switch month to next------------//
  const nextMonth = () => {
    if (selectedDates.length > 0) {
      onAlert("warning", t("choose_month"));
      return;
    }
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
    setErrorMessage(""); // Reset error message when the month changes
  };

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

  // -----------Check if dates are in the past-----------//
  const isPastDateFn = (day) => {
    return (
      day &&
      new Date(year, month, day) < new Date(todayYear, todayMonth, todayDay)
    );
  };

  // ---------Select checkbox---------//
  const handleCheckbox = () => {
    setIsSelectedCheckbox((prev) => !prev);
  };
  // ---Select all days---//
  useEffect(() => {
    if (!selectedDoctor) return;

    if (isSelectedCheckbox) {
      const allDates = daysArray
        .filter((day) => day && !isPastDateFn(day))
        .map((day) => new Date(Date.UTC(year, month, day)).toISOString());
      setSelectedDates(allDates);
      onDateSelect(allDates);
    } else {
      setSelectedDates([]);
    }
  }, [isSelectedCheckbox]);

  // -----------Select a day in the calendar-----------//
  const handleDayClick = (day) => {
    if (!day) return; // Exit if no day is selected

    if (!selectedDoctor) {
      onAlert("warning", t("notSelectedDoctor")); // Alert if no doctor is selected
      return;
    }
    // -------------Select dates---------------//
    if (
      day &&
      (new Date(year, month, day) > today ||
        (year === todayYear && month === todayMonth && day === todayDay))
    ) {
      // Format the selected date in UTC
      const newSelectedDate = new Date(
        Date.UTC(year, month, day)
      ).toISOString(); // Convert date to UTC and format as ISO string

      // Check if the date is already selected
      const isSelected = selectedDates.includes(newSelectedDate);

      let updatedDates;
      if (isSelected) {
        updatedDates = selectedDates.filter(
          (dateStr) => dateStr !== newSelectedDate // Remove date if already selected
        );
      } else {
        updatedDates = [...selectedDates, newSelectedDate]; // Add date if not selected
      }

      if (JSON.stringify(updatedDates) !== JSON.stringify(selectedDates)) {
        setSelectedDates(updatedDates); // Update selected dates state
        onDateSelect(updatedDates); // Pass selected dates to parent component
      }
    }
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button
          onClick={prevMonth}
          className={
            Array.isArray(selectedDates) && selectedDates.length > 0
              ? styles.switch_month_button
              : ""
          }
        >
          <MdOutlineArrowBackIosNew />
        </button>
        <h2>
          {capitalizedMonthName} {year}
        </h2>
        <button
          onClick={nextMonth}
          className={
            Array.isArray(selectedDates) && selectedDates.length > 0
              ? styles.switch_month_button
              : ""
          }
        >
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
          const isPastDate = isPastDateFn(day);
          const isToday =
            day === todayDay &&
            month === todayMonth &&
            year === today.getFullYear();
          const isSelected = selectedDates.includes(
            new Date(Date.UTC(year, month, day)).toISOString()
          );
          //  Filter only those slots that correspond to the current day
          const slotsForDay =
            day &&
            slots.find(
              (slotGroup) =>
                slotGroup.date ===
                new Date(Date.UTC(year, month, day)).toISOString().split("T")[0]
            );

          return (
            <div
              key={i}
              className={`${styles.day} ${isToday ? styles.today : ""} ${
                isSelected ? styles.selected : ""
              } ${isPastDate ? styles.disabled : ""} ${
                day ? styles.day : styles.emptyDay
              }`}
              onClick={() => !isPastDate && handleDayClick(day)}
            >
              {day}
              {day &&
                !isPastDate &&
                slotsForDay &&
                slotsForDay.slots.length > 0 && (
                  <span
                    className={isSelected ? styles.selected_slot : styles.slot}
                  >
                    {slotsForDay.slots[0].time} -{" "}
                    {slotsForDay.slots[slotsForDay.slots.length - 1].time}
                  </span>
                )}
            </div>
          );
        })}
      </div>
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
      {Array.isArray(selectedDates) && selectedDates.length > 0 && (
        <div className={styles.checkbox}>
          <FormControlLabel
            label={t("all_dates")}
            control={
              <Checkbox
                checked={isSelectedCheckbox}
                onChange={handleCheckbox}
              />
            }
            labelPlacement="start"
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "0.8rem",
                fontWeight: "500",
              },
            }}
          />
        </div>
      )}
    </div>
  );
}
