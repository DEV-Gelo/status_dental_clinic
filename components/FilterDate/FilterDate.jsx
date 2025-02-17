"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
// ---------Import MUI components-------------//
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
// ---------Import React icons------------//
import { MdAutorenew } from "react-icons/md";

const FilterDate = ({
  doctors,
  onDoctorFilter,
  onYearFilter,
  onMonthFilter,
  onDayFilter,
}) => {
  // ---------Translation---------------//
  const t = useTranslations("admin__FilterDate");
  const l = useTranslations("admin");
  const locale = l("language");
  // ----Get current month--------//
  const currentMonth = new Date();
  const monthName = currentMonth.toLocaleString(locale, {
    month: "long",
  });
  const capitalizedMonthName =
    monthName.charAt(0).toUpperCase() + monthName.slice(1);
  //-----------------States-------------------------//
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

  const handleFilterDoctor = (event) => setDoctorFilter(event.target.value);
  const handleFilterDay = (event) => setDayFilter(event.target.value);
  const handleFilterMonth = (event) => {
    setMonthFilter(event.target.value);
    setDayFilter(""); // Clean the day when the month changes
  };
  const handleFilterYear = (event) => setYearFilter(event.target.value);
  const handleClearDate = () => {
    setDayFilter("");
    setMonthFilter("");
  };
  const handleClearDoctor = () => setDoctorFilter("");

  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  function getMonthsAndDays(year) {
    const months = [
      { name: t("January"), days: 31 },
      { name: t("February"), days: isLeapYear(year) ? 29 : 28 },
      { name: t("March"), days: 31 },
      { name: t("April"), days: 30 },
      { name: t("May"), days: 31 },
      { name: t("June"), days: 30 },
      { name: t("July"), days: 31 },
      { name: t("August"), days: 31 },
      { name: t("September"), days: 30 },
      { name: t("October"), days: 31 },
      { name: t("November"), days: 30 },
      { name: t("December"), days: 31 },
    ];

    return months.map((month) => ({
      month: month.name,
      days: Array.from({ length: month.days }, (_, i) => i + 1),
    }));
  }

  const monthsWithDays = getMonthsAndDays(yearFilter);
  const filteredDays = monthFilter
    ? monthsWithDays.find((m) => m.month === monthFilter)?.days || []
    : [];

  return (
    <div className="flex flex-col flex-wrap justify-center items-center">
      <h6>{t("Filter")}</h6>
      <div className="flex flex-nowrap m-2">
        <FormControl variant="standard" sx={{ m: 1, minWidth: 100 }}>
          <InputLabel id="month-label">{t("month")}</InputLabel>
          <Select
            labelId="month-label"
            id="month-select"
            value={monthFilter}
            onChange={handleFilterMonth}
            label="Month"
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
          <InputLabel id="day-label">{t("day")}</InputLabel>
          <Select
            labelId="day-label"
            id="day-select"
            value={dayFilter}
            onChange={handleFilterDay}
            label="Day"
            disabled={!monthFilter}
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
          <InputLabel id="year-label">{t("year")}</InputLabel>
          <Select
            labelId="year-label"
            id="year-select"
            value={yearFilter}
            onChange={handleFilterYear}
            label="Year"
          >
            {[
              2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034,
              2035,
            ].map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <button
          className="m-2"
          title={t("clear_title")}
          onClick={handleClearDate}
          type="button"
        >
          <MdAutorenew />
        </button>
      </div>

      <div className="flex flex-nowrap m-2">
        <FormControl sx={{ m: 1, minWidth: 240 }} variant="standard">
          <InputLabel id="doctor-label">{t("doctor")}</InputLabel>
          <Select
            labelId="doctor-label"
            id="doctor-select"
            value={doctorFilter}
            onChange={handleFilterDoctor}
            label="Doctor"
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
          title={t("clear_title")}
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
