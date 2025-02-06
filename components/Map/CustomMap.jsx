"use client";
import React, { useEffect, useRef } from "react";
// ----------Map configuration-----------------------//
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet"; // Імпортуємо Leaflet
import "leaflet/dist/leaflet.css";

const position = [50.3938821, 30.4930841, 21]; // Київ

// 🔥 Фікс для іконки маркера
const customIcon = new L.Icon({
  iconUrl: "/marker-icon.png",
  iconSize: [25, 41], // Розмір іконки
  iconAnchor: [12, 41], // Точка прив’язки
  popupAnchor: [1, -34], // Позиція попапа
});

const CustomMap = () => {
  const mapRef = useRef(null); // Використовуємо ref для карти

  useEffect(() => {
    if (mapRef.current && !mapRef.current._leaflet_id) {
      // Ініціалізуємо карту тільки якщо вона не була ініціалізована
      const customIcon = new L.Icon({
        iconUrl: "/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      // Тепер використовуємо ref для карти
      mapRef.current.invalidateSize(); // Оновлюємо розміри карти після рендерингу
    }

    return () => {
      // Очищаємо карту після демонтажу компонента
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ height: "100%", width: "100%", borderRadius: "10px" }}
      ref={mapRef} // Підключаємо ref до MapContainer
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position} icon={customIcon}>
        <Popup>Тут знаходиться наша клініка!</Popup>
      </Marker>
    </MapContainer>
  );
};

export default CustomMap;
