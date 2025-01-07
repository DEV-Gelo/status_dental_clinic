"use client";
import { useState } from "react";
import UserCalendar from "@/components/Appointment/UserCalendar/UserCalendar";
import styles from "./AppointmentStyle.module.css";
import AvailableDoctors from "@/components/Appointment/UserCalendar/AvailableDoctors/AvailableDoctors";

const Appointment = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [doctorsAvailability, setDoctorsAvailability] = useState([]);
  const [error, setError] = useState(null);
  const [appointmentData, setAppointmentData] = useState({
    firstName: "",
    lastName: "",
    patronymic: "",
    phone: "",
    email: "",
    service: "",
    doctorId: null,
    scheduleId: null,
    time: null,
    selectedDate: null,
  });

  // ------------Get data from AvailableDoctors-----------//
  const handleSlotSelection = (slotData) => {
    setAppointmentData((prev) => ({
      ...prev,
      ...slotData,
    }));
  };

  // ---------------------------------------------------//

  const handleAvailabilityChange = (availability) => {
    setDoctorsAvailability(availability);
  };

  const handleDateSelect = async (date) => {
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    setSelectedDate(localDate);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData((prev) => ({ ...prev, [name]: value }));
  };

  // ----------------Send data to server-------------------------------//
  const handleSubmit = async (e) => {
    e.preventDefault(); // Запобігає перезавантаженню сторінки

    // Перевіряємо, чи всі необхідні дані наявні
    const validateForm = () => {
      if (
        !appointmentData.firstName ||
        !appointmentData.lastName ||
        !appointmentData.phone ||
        !appointmentData.email
      ) {
        alert("Будь ласка, заповніть усі поля форми.");
        return false;
      }

      if (!selectedDate) {
        alert("Будь ласка, оберіть дату для запису.");
        return false;
      }

      if (doctorsAvailability?.error) {
        alert("Будь ласка, оберіть іншу дату для запису.");
        return false;
      }

      if (!appointmentData.time) {
        alert("Будь ласка, оберіть час для запису.");
        return false;
      }

      return true; // Усі перевірки пройдені
    };

    // Використання функції
    if (!validateForm()) {
      return; // Зупиняємо виконання, якщо перевірка не пройдена
    }

    // Форматування дати для передачі в базу даних
    const appointmentDate = new Date(appointmentData.selectedDate);

    try {
      const response = await fetch("/api/appointment/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: appointmentData.firstName,
          lastName: appointmentData.lastName,
          patronymic: appointmentData.patronymic,
          phone: appointmentData.phone,
          email: appointmentData.email,
          service: appointmentData.service,
          time: appointmentData.time,
          date: appointmentDate.toISOString(), // Потрібно перевести в формат ISO
          scheduleId: appointmentData.scheduleId,
          doctorId: appointmentData.doctorId,
          slotId: appointmentData.slotId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Запис успішно зроблений!");
        // Скидання стану
        setAppointmentData({
          firstName: "",
          lastName: "",
          patronymic: "",
          phone: "",
          email: "",
          service: "",
          doctorId: null,
          scheduleId: null,
          time: null,
          selectedDate: null,
          slotId: null,
        });
        mutate();
      } else {
        const data = await response.json();
        alert("Сталася помилка: " + (data.error || "Невідома помилка"));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // -----------------------------------------------------------------//

  return (
    <div className="flex flex-col w-full h-full">
      <header className="flex w-full h-[100px] justify-center items-center">
        <h1 className="font-bold text-grey text-[40px]">Запис до лікаря</h1>
      </header>
      <main>
        <div className="flex">
          <div className="flex m-5">
            <UserCalendar onDateSelect={handleDateSelect} />
          </div>
          <div className={styles.form_fields}>
            <input
              type="text"
              placeholder="Ім'я"
              name="firstName"
              value={appointmentData.firstName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Прізвище"
              name="lastName"
              value={appointmentData.lastName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="По батькові"
              name="patronymic"
              value={appointmentData.patronymic}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Номер телефону"
              name="phone"
              value={appointmentData.phone}
              onChange={handleInputChange}
              className="input_phone"
            />
            <input
              type="text"
              placeholder="Електронна пошта"
              name="email"
              value={appointmentData.email}
              onChange={handleInputChange}
            />
            <select
              name="service"
              value={appointmentData.service}
              onChange={handleInputChange}
            >
              <option value="" disabled>
                Оберіть вид послуги
              </option>
              <option value="Огляд та консультація">
                Огляд та консультація
              </option>
              <option value="Чистка (ультразвукова, AirFlow)">
                Професійна чистка (ультразвукова, AirFlow)
              </option>
              <option value="Лікування зубів">Лікування</option>
              <option value="Видалення зубів">Видалення</option>
              <option value="Інше">Інше</option>
            </select>
          </div>
        </div>
        <div>
          <AvailableDoctors
            selectedDate={selectedDate}
            onSlotSelect={handleSlotSelection}
            onAvailability={handleAvailabilityChange}
          />
        </div>
        <div className="flex w-full h-auto justify-center items-center mb-10">
          <button className="p-2 bg-slate-400" onClick={handleSubmit}>
            Записатися
          </button>
        </div>
      </main>
    </div>
  );
};

export default Appointment;
