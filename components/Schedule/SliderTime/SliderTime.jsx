import React, { useState, useEffect, useMemo } from "react";
import Slider from "@mui/material/Slider";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

const minDistance = 1;
// -------------------- Formating time----------------------------//
function formatTime(value, selectedValue) {
  const hours = 8 + Math.floor((value * selectedValue) / 60);
  const minutes = (value * selectedValue) % 60;
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
}
// ----------------------------------------------------------------//
// ------Function generation an array of the selected time---------//
const generateTimeArray = (start, end, interval) => {
  const times = [];
  let currentTime = start;

  while (currentTime < end) {
    const hours = Math.floor(currentTime / 60);
    const minutes = currentTime % 60;
    times.push(`${hours}:${minutes.toString().padStart(2, "0")}`);
    currentTime += interval;
  }

  return times;
};
// -----------------------------------------------------//
const SliderTime = ({ onTimeSelect, selectedDates }) => {
  const [timeRange, setTimeRange] = useState([0, 28]);
  const [selectedValue, setSelectedValue] = useState(30);
  // ------Generate an array of the selected time---------//
  const timeArray = useMemo(() => {
    return generateTimeArray(
      8 * 60 + timeRange[0] * selectedValue, // Start time in minutes
      8 * 60 + timeRange[1] * selectedValue, // End time in minutes
      selectedValue // Interval
    );
  }, [timeRange, selectedValue]);
  //--------Transfer the array to the parent component--------//
  useEffect(() => {
    if (selectedDates.length > 0) {
      onTimeSelect(timeArray);
    }
  }, [selectedDates, selectedValue, timeRange]);
  // ---------------------------------------------------------//
  const handleChangeRadioButton = (event) => {
    setSelectedValue(Number(event.target.value));
  };
  //--------------------Function slider----------------------//
  const handleChange = (event, newValue, activeThumb) => {
    setTimeRange(newValue);
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 28 - minDistance);
        setTimeRange([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setTimeRange([clamped - minDistance, clamped]);
      }
    } else {
      setTimeRange(newValue);
    }
  };
  // -----------------------------------------------------------//
  return (
    <>
      <div className="flex flex-col w-full m-2">
        <div className="flex flex-col justify-center items-center mb-10">
          <h6>Інтервал прийому</h6>
          <RadioGroup
            row
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={selectedValue}
            onChange={handleChangeRadioButton}
          >
            <FormControlLabel value="30" control={<Radio />} label="30 хв" />
            <FormControlLabel value="45" control={<Radio />} label="45 хв" />
            <FormControlLabel value="60" control={<Radio />} label="1 год" />
          </RadioGroup>
        </div>
        <Slider
          value={timeRange}
          onChange={handleChange}
          valueLabelDisplay="on"
          valueLabelFormat={(value) => formatTime(value, selectedValue)}
          disableSwap
          min={0}
          max={Math.floor(14 * (60 / selectedValue))}
        />
        <div>
          Обраний час:{" "}
          {`${formatTime(timeRange[0], selectedValue)} - ${formatTime(
            timeRange[1],
            selectedValue
          )}`}
        </div>
      </div>
    </>
  );
};

export default SliderTime;
