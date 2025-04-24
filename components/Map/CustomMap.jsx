// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import { useTranslations } from "next-intl";
// // ----------Map configuration-----------------------//
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// const CustomMap = ({ position }) => {
//   // -----Translation----------//
//   const t = useTranslations("CustomMap");
//   // -----Marker icon----------//
//   const customIcon = new L.Icon({
//     iconUrl: "/marker-icon.svg",
//     iconSize: [25, 41],
//     iconAnchor: [12, 41], // Anchor point
//     popupAnchor: [1, -34], // Popup position
//   });

//   const mapRef = useRef(null);

//   useEffect(() => {
//     if (mapRef.current) {
//       // Checking if the map is accessible before updating it
//       const mapInstance = mapRef.current;
//       if (mapInstance && mapInstance.setView) {
//         // Smoothly move the map to new coordinates
//         mapInstance.setView(position, 15); // 15 is the zoom level
//       }
//     }
//   }, [position]); // Update the map when the position changes
//   return (
//     <MapContainer
//       center={position}
//       zoom={15}
//       style={{ height: "100%", width: "100%", borderRadius: "10px" }}
//       ref={mapRef}
//     >
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//       <Marker position={position} icon={customIcon}>
//         <Popup>{t("Popup")}</Popup>
//       </Marker>
//     </MapContainer>
//   );
// };

// export default CustomMap;

// const parsedPosition = {
//   lat: parseFloat(position[0]),
//   lng: parseFloat(position[1]),
// };

"use client";
import React, { useCallback, useRef, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useTranslations } from "next-intl";
import { FaRoute } from "react-icons/fa";

const mapContainerStyle = {
  height: "100%",
  width: "100%",
  borderRadius: "10px",
  position: "relative",
};

const defaultZoom = 15;

const GoogleMapComponent = ({ position }) => {
  const t = useTranslations("CustomMap");
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocationFetched, setIsLocationFetched] = useState(false);

  const parsedPosition = {
    lat: parseFloat(position[0]),
    lng: parseFloat(position[1]),
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const onLoad = useCallback(
    (map) => {
      mapRef.current = map;
      map.panTo(parsedPosition);
      map.setZoom(defaultZoom);
    },
    [position]
  );

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = position.coords;
          setUserLocation(userLocation);
          setIsLocationFetched(true); // Geolocation received, now let's build a route
        },
        (error) => {
          alert(t("Error_location"));
        }
      );
    } else {
      alert(t("Geolocation is not supported"));
    }
  };

  const openMapWithRoute = () => {
    if (userLocation) {
      const userLocationString = `${userLocation.latitude},${userLocation.longitude}`;
      const destination = `${parsedPosition.lat},${parsedPosition.lng}`;
      // Building a route from geolocation to the position
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocationString}&destination=${destination}&travelmode=driving`;
      window.open(url, "_blank");
    }
  };

  if (loadError) return <div>{t("Error_loading")}</div>;
  if (!isLoaded) return <div>{t("loading")}</div>;

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={parsedPosition}
        zoom={defaultZoom}
        onLoad={onLoad}
      >
        <Marker position={parsedPosition} />
      </GoogleMap>

      {/* Button for requesting geolocation and building a route */}
      <button
        onClick={handleGeolocation}
        className="flex flex-col absolute top-24 left-2.5 w-[12.2rem] h-auto justify-center items-center bg-[#fff] text-black px-4 py-2 shadow hover:bg-[#f5f5f5] transition"
      >
        {t("Route_button")}
        <span className="m-2 text-[2rem]">
          <FaRoute />
        </span>
      </button>

      {/* If geolocation is received, the route opens automatically */}
      {isLocationFetched && openMapWithRoute()}
    </div>
  );
};

export default GoogleMapComponent;
