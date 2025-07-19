"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { GoClock } from "react-icons/go";
import { FaCarAlt } from "react-icons/fa";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { PiMapPinFill } from "react-icons/pi";

const DefaultIcon = L.icon({
  iconUrl: icon.src || icon,
  shadowUrl: iconShadow.src || iconShadow,
});

export default function LeafletMap() {
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        position: "relative",
      }}
    >
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker position={[51.49, -0.12]}>
          <Popup>
            <div className="w-[15rem] h-[30rem] flex flex-col gap-4 py-5 text-xs">
              <div className="flex justify-between h-6">
                <div className="flex gap-1 items-center a text-xs">
                  <div className="p-1 border rounded-full">
                    <FaCarAlt />
                  </div>
                  <p>WIRELESS</p>
                </div>
                <div className="flex gap-1 items-center text-xs">
                  <GoClock size={16} />
                  <p>Jul 20, 07:09 AM</p>
                </div>
              </div>
              <div className="flex gap-1 items-center text-xs">
                <PiMapPinFill size={16} />
                <div className="w-full overflow-hidden whitespace-nowrap">
                  <div className="inline-block animate-marquee px-4">
                    A22, New Panchganga Hsg.So, Vijay Nagar, Deolali Camp,
                    Nashik Maharashtra 422001
                  </div>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      <div className="fixed bottom-7 text-black left-0 w-full flex justify-center shadow-lg transition-all duration-300 z-[999]">
        <div className="w-[50rem] bg-white">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between p-4"
          >
            <p>Configure</p>
            <svg
              data-accordion-icon
              className="w-3 h-3 rotate-180 shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5 5 1 1 5"
              />
            </svg>
          </button>
          {showFilters ? (
            <div className="flex justify-center w-full">
              <div className="flex justify-between py-4 w-[40rem] ">
                <div className="flex gap-[3rem] h-6 items-start">
                  <select id="countries" className="">
                    <option value="WIRELESS">WIRELESS</option>
                    <option value="WIRED">WIRED</option>
                  </select>
                  <select id="countries" className="">
                    <option value="Today">Today</option>
                    <option value="Previous day">Previous day</option>
                    <option value="This week">This week</option>
                    <option value="Previous week">Previous week</option>
                    <option value="This month">This month</option>
                    <option value="Previous month">Previous month</option>
                  </select>
                </div>
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Show
                </button>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
