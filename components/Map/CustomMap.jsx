"use client";
import React, { useEffect, useRef } from "react";
// ----------Map configuration-----------------------//
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const position = [50.3938821, 30.4930841, 21];

// -----Marker icon----------//
const customIcon = new L.Icon({
  iconUrl: "/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41], // Anchor point
  popupAnchor: [1, -34], // Popup position
});

const CustomMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Initialize the map only if it has not been initialized
    if (mapRef.current && !mapRef.current._leaflet_id) {
      // Use the ref for the map
      mapRef.current.invalidateSize(); // Update the dimensions of the map after rendering
    }

    return () => {
      // Clean the map after dismantling the component
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
      ref={mapRef} // Connect ref to MapContainer
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position} icon={customIcon}>
        <Popup>Тут знаходиться наша клініка!</Popup>
      </Marker>
    </MapContainer>
  );
};

export default CustomMap;
