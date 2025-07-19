"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { GoClock } from "react-icons/go";
import { FaCarAlt } from "react-icons/fa";
// import icon from "leaflet/dist/images/marker-icon.png";
// import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { IoPlay } from "react-icons/io5";
import { PiMapPinFill } from "react-icons/pi";
import { RxCountdownTimer } from "react-icons/rx";
import PathWithArrows from "./Direction";

const todayPath: L.LatLngExpression[] = [
  [19.123, 72.835],
  [19.124, 72.837],
  [19.127, 72.84],
  [19.13, 72.845],
  [19.128, 72.848],
  [19.124, 72.846],
  [19.123, 72.835],
];

const previousDayPath: L.LatLngExpression[] = [
  [19.123, 72.835],
  [19.122, 72.83],
  [19.12, 72.828],
  [19.118, 72.833],
  [19.121, 72.837],
  [19.123, 72.835],
  [19.123, 72.834],
];

// This Week Path
const thisWeekPath: L.LatLngExpression[] = [
  [19.123, 72.835], // origin
  [19.126, 72.839],
  [19.128, 72.842],
  [19.131, 72.847],
  [19.128, 72.851],
  [19.125, 72.846],
  [19.123, 72.835], // back to origin
];

// Previous Week Path
const previousWeekPath: L.LatLngExpression[] = [
  [19.123, 72.835], // origin
  [19.121, 72.831],
  [19.117, 72.827],
  [19.114, 72.829],
  [19.116, 72.834],
  [19.12, 72.837],
  [19.123, 72.835], // back to origin
];

// This Month Path
const thisMonthPath: L.LatLngExpression[] = [
  [19.123, 72.835], // origin
  [19.128, 72.836],
  [19.132, 72.839],
  [19.135, 72.843],
  [19.138, 72.848],
  [19.134, 72.852],
  [19.128, 72.849],
  [19.123, 72.835], // back to origin
];

// Previous Month Path
const previousMonthPath: L.LatLngExpression[] = [
  [19.123, 72.835], // origin
  [19.118, 72.832],
  [19.113, 72.829],
  [19.11, 72.83],
  [19.112, 72.835],
  [19.117, 72.839],
  [19.121, 72.837],
  [19.123, 72.835], // back to origin
];

const DefaultIcon = L.icon({
  iconUrl: "./vehicle.svg",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export default function LeafletMap() {
  let interval;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [path, setpath] = useState<L.LatLngExpression[]>([
    [19.123, 72.835],
    [19.124, 72.837],
    [19.127, 72.84],
    [19.13, 72.845],
    [19.128, 72.848],
    [19.124, 72.846],
    [19.123, 72.835],
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  //   useEffect(() => {
  //     if (currentIndex >= todayPath.length - 1) return;

  //     const interval = setInterval(() => {
  //       console.log("asdjfsjdflj " + currentIndex + todayPath.length);
  //       setCurrentIndex((prev) => prev + 1);
  //     }, 1000); // change speed here (1000ms = 1s)

  //     return () => clearInterval(interval);
  //   }, [currentIndex]);

  const play = () => {
    if (currentIndex >= todayPath.length - 1) {
      console.log("Already at the end");
      return; // ✅ Exit early
    }

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex >= todayPath.length - 1) {
          clearInterval(intervalId); // ✅ Stop when done
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, 1000);
  };

  useEffect(() => {
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  const showpolyline = () => {
    setCurrentIndex(0);
    if (selectedOption === "Today") {
      setpath(todayPath);
      setShowFilters(false);
    } else if (selectedOption === "Previous day") {
      setpath(previousDayPath);
      setShowFilters(false);
    } else if (selectedOption === "This week") {
      setpath(thisWeekPath);
      setShowFilters(false);
    } else if (selectedOption === "Previous week") {
      setpath(previousWeekPath);
      setShowFilters(false);
    } else if (selectedOption === "This month") {
      setpath(thisMonthPath);
      setShowFilters(false);
    } else {
      setpath(previousMonthPath);
      setShowFilters(false);
    }
  };

  return (
    <div className="relative h-screen w-full">
      <MapContainer
        center={path[0]}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Path lines with arrows */}
        <PathWithArrows positions={path} color="blue" />
        {/* <PathWithArrows positions={previousDayPath} color="orange" /> */}

        <Marker position={path[currentIndex]}>
          <Popup>
            <div className="w-[15rem] h-[30rem] flex flex-col gap-4 py-5 text-xs">
              <div className="flex justify-between h-6">
                <div className="flex gap-1 items-center">
                  <div className="p-1 border rounded-full">
                    <FaCarAlt />
                  </div>
                  <p>WIRELESS</p>
                </div>
                <div className="flex gap-1 items-center">
                  <GoClock size={16} />
                  <p>Jul 20, 07:09 AM</p>
                </div>
              </div>
              <div className="flex gap-1 items-center">
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

      {/* Bottom Accordion Filter */}
      <div className="fixed bottom-7 left-0 w-full flex flex-col gap-2 justify-center items-center z-[999] text-black">
        <div className="w-[50rem] flex gap-4 items-center bg-white shadow-lg rounded p-4">
          <div className="w-[25rem] bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-1.5 rounded-full dark:bg-blue-500"
              style={{ width: "45%" }}
            ></div>
          </div>
          <div className="flex gap-6">
            <button
              type="button"
              onClick={play}
              className="text-white bg-blue-600 hover:bg-blue-700 px-6 py-1 rounded-2xl"
            >
              <IoPlay />
            </button>
            <button
              type="button"
              onClick={showpolyline}
              className="text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-2xl"
            >
              <RxCountdownTimer size={16} />
            </button>
          </div>
        </div>
        <div className="w-[50rem] bg-white shadow-lg rounded">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between p-4"
          >
            <p>Configure</p>
            <svg
              data-accordion-icon
              className={`w-4 h-4 transform transition-transform ${
                showFilters ? "rotate-0" : "rotate-180"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5 5 1 1 5"
              />
            </svg>
          </button>

          {showFilters && (
            <div className="flex justify-center w-full px-4 pb-4">
              <div className="flex justify-between w-full max-w-[40rem] gap-6">
                <select className="border px-2 py-1 rounded">
                  <option value="WIRELESS">WIRELESS</option>
                  <option value="WIRED">WIRED</option>
                </select>

                <select
                  value={selectedOption}
                  onChange={handleChange}
                  className="border px-2 py-1 rounded"
                >
                  <option value="Today">Today</option>
                  <option value="Previous day">Previous day</option>
                  <option value="This week">This week</option>
                  <option value="Previous week">Previous week</option>
                  <option value="This month">This month</option>
                  <option value="Previous month">Previous month</option>
                </select>

                <button
                  type="button"
                  onClick={showpolyline}
                  className="text-white bg-blue-600 hover:bg-blue-700 px-5 py-1 rounded"
                >
                  Show
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
