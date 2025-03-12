"use client";
import React, { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
// ----------Map configuration-----------------------//
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const CustomMap = ({ position }) => {
  // -----Translation----------//
  const t = useTranslations("CustomMap");
  // -----Marker icon----------//
  const customIcon = new L.Icon({
    iconUrl: "/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41], // Anchor point
    popupAnchor: [1, -34], // Popup position
  });

  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      // Checking if the map is accessible before updating it
      const mapInstance = mapRef.current;
      if (mapInstance && mapInstance.flyTo) {
        // Smoothly move the map to new coordinates
        mapInstance.flyTo(position, 15); // 15 is the zoom level
      }
    }
  }, [position]); // Update the map when the position changes
  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ height: "100%", width: "100%", borderRadius: "10px" }}
      ref={mapRef}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position} icon={customIcon}>
        <Popup>{t("Popup")}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default CustomMap;
