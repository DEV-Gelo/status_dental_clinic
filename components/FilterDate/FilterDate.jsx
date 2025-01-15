import React, { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { MdAutorenew } from "react-icons/md";

const currentMonth = new Date();
const monthName = currentMonth.toLocaleString("uk-UA", { month: "long" });
const capitalizedMonthName = monthName[0].toUpperCase() + monthName.slice(1);

const FilterDate = ({
  doctors,
  onDoctorFilter,
  onYearFilter,
  onMonthFilter,
  onDayFilter,
}) => {
  const [dayFilter, setDayFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState(capitalizedMonthName);
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [doctorFilter, setDoctorFilter] = useState("");
  useEffect(() => {
    onDoctorFilter(doctorFilter);
    onYearFilter(yearFilter);
    onMonthFilter(monthFilter);
    onDayFilter(dayFilter);
  }, [doctorFilter, yearFilter, monthFilter, dayFilter]);

  const handleFilterDoctor = (event) => {
    setDoctorFilter(event.target.value);
  };

  const handleFilterDay = (event) => {
    setDayFilter(event.target.value);
  };

  const handleFilterMonth = (event) => {
    setMonthFilter(event.target.value);
    setDayFilter(""); // Очищення обраного дня при зміні місяця
  };

  const handleFilterYear = (event) => {
    setYearFilter(event.target.value);
  };

  const handleClearDate = () => {
    setDayFilter("");
    setMonthFilter("");
  };

  const handleClearDoctor = () => {
    setDoctorFilter("");
  };

  // Функція для визначення, чи є рік високосним
  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  // Функція для отримання місяців та днів
  function getMonthsAndDays(year) {
    const months = [
      { name: "Січень", days: 31 },
      { name: "Лютий", days: isLeapYear(year) ? 29 : 28 },
      { name: "Березень", days: 31 },
      { name: "Квітень", days: 30 },
      { name: "Травень", days: 31 },
      { name: "Червень", days: 30 },
      { name: "Липень", days: 31 },
      { name: "Серпень", days: 31 },
      { name: "Вересень", days: 30 },
      { name: "Жовтень", days: 31 },
      { name: "Листопад", days: 30 },
      { name: "Грудень", days: 31 },
    ];

    return months.map((month, index) => ({
      month: month.name,
      days: Array.from({ length: month.days }, (_, i) => i + 1),
    }));
  }

  const year = new Date(yearFilter);
  const monthsWithDays = getMonthsAndDays(year);

  // Selection of days for the selected month
  const filteredDays = monthFilter
    ? monthsWithDays.find((m) => m.month === monthFilter)?.days || []
    : [];

  return (
    <div className="flex flex-col sm:flex-row">
      <div className="flex flex-nowrap m-2">
        <FormControl variant="standard" sx={{ m: 1, minWidth: 100 }}>
          <InputLabel id="month-label">Місяць</InputLabel>
          <Select
            labelId="month-label"
            id="month-select"
            value={monthFilter}
            onChange={handleFilterMonth}
            label="Місяць"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {monthsWithDays.map((item, index) => (
              <MenuItem key={index} value={item.month}>
                {item.month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="standard" sx={{ m: 1, minWidth: 60 }}>
          <InputLabel id="day-label">День</InputLabel>
          <Select
            labelId="day-label"
            id="day-select"
            value={dayFilter}
            onChange={handleFilterDay}
            label="День"
            disabled={!monthFilter} // Заблокувати, якщо місяць не обраний
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {filteredDays.map((day) => (
              <MenuItem key={day} value={day}>
                {day}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="standard" sx={{ m: 1, minWidth: 60 }}>
          <InputLabel id="year-label">Рік</InputLabel>
          <Select
            labelId="year-label"
            id="year-select"
            value={yearFilter}
            onChange={handleFilterYear}
            label="Рік"
          >
            {[2024, 2025, 2026].map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <button
          className="m-2"
          title="Очистити"
          onClick={handleClearDate}
          type="button"
        >
          <MdAutorenew />
        </button>
      </div>

      <div className="flex flex-nowrap m-2">
        <FormControl sx={{ m: 1, minWidth: 240 }} variant="standard">
          <InputLabel id="doctor-label">Лікар</InputLabel>
          <Select
            labelId="doctor-label"
            id="doctor-select"
            value={doctorFilter}
            onChange={handleFilterDoctor}
            label="Лікар"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {doctors.map((docName) => (
              <MenuItem key={docName.id} value={docName.id}>
                {`${docName.lastName} ${docName.firstName} ${docName.patronymic}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <button
          className=""
          title="Очистити"
          onClick={handleClearDoctor}
          type="button"
        >
          <MdAutorenew />
        </button>
      </div>
    </div>
  );
};

export default FilterDate;
