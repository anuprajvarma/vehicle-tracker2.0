"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState, useRef } from "react";
import { GoClock } from "react-icons/go";
import { FaCarAlt } from "react-icons/fa";
// import icon from "leaflet/dist/images/marker-icon.png";
// import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { IoPlay } from "react-icons/io5";
import { FaPause } from "react-icons/fa6";
import { PiMapPinFill } from "react-icons/pi";
import { RxCountdownTimer } from "react-icons/rx";
import PathWithArrows from "./Direction";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";

const todayPath: L.LatLngExpression[] = [
  [25.145346, 82.570056], // Bhatwa Ki Pokhari
  [25.1505, 82.5695], // Ghantaghar (Clock Tower)
  [25.147, 82.568], // Pethi Ka Chaurha
  [25.1455, 82.5707], // Ghirdhar Ka Chaurha
  [25.1442, 82.5688], // City Cart (central area)
  [25.13496, 82.56844], // Mirzapur Station :contentReference[oaicite:1]{index=1}
  [25.1337, 82.56443], // Shuklha Road (near city center) :contentReference[oaicite:2]{index=2}
];

const previousDayPath: L.LatLngExpression[] = [
  [25.1462, 82.5709],
  [25.1475, 82.5697],
  [25.148, 82.5678],
  [25.1457, 82.5671],
  [25.1449, 82.5663],
  [25.1436, 82.5652],
  [25.1337, 82.56443],
];

const thisWeekPath: L.LatLngExpression[] = [
  [25.1345, 82.5661],
  [25.136, 82.567],
  [25.1381, 82.5687],
  [25.1404, 82.5699],
  [25.1432, 82.5712],
  [25.1453, 82.572],
  [25.1337, 82.56443],
];

const previousWeekPath: L.LatLngExpression[] = [
  [25.139, 82.5648],
  [25.1406, 82.5663],
  [25.142, 82.5679],
  [25.1437, 82.5691],
  [25.1451, 82.5703],
  [25.1465, 82.571],
  [25.1337, 82.56443],
];

const thisMonthPath: L.LatLngExpression[] = [
  [25.1328, 82.564],
  [25.1341, 82.5654],
  [25.1359, 82.5668],
  [25.1377, 82.568],
  [25.1402, 82.5693],
  [25.1424, 82.5705],
  [25.1445, 82.5717],
];

const previousMonthPath: L.LatLngExpression[] = [
  [25.1305, 82.5632],
  [25.1322, 82.5647],
  [25.1343, 82.566],
  [25.1367, 82.5674],
  [25.1391, 82.5688],
  [25.1414, 82.5702],
  [25.1436, 82.5716],
];

const DefaultIcon = L.icon({
  iconUrl: "./vehicle.svg",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export default function LeafletMap() {
  let interval;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [playpause, setplaypause] = useState<boolean>(false);
  const [tracker, setTracker] = useState(0);
  //   const [vspeed, setVspeed] = useState(1000);
  const vspeedRef = useRef(1000);
  const [path, setpath] = useState<L.LatLngExpression[]>([
    [25.145346, 82.570056],
    [25.1505, 82.5695],
    [25.147, 82.568],
    [25.1455, 82.5707],
    [25.1442, 82.5688],
    [25.13496, 82.56844],
    [25.1337, 82.56443],
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  const valuetext = (value: number) => {
    console.log(value);
    vspeedRef.current = value * 1000;
    return `${value}°C`;
  };

  const play = (action: string) => {
    if (action === "play") {
      //   if (tracker !== 0) {
      //     setTracker(0);
      //   }
      if (currentIndex >= todayPath.length - 1) {
        console.log("Already at the end");
        setCurrentIndex(0);
        setTracker(0);
      }
      setplaypause(true);
      intervalRef.current = setInterval(() => {
        console.log(vspeedRef.current);
        setTracker((prev) => {
          return prev + 100 / path.length;
        });
        setCurrentIndex((prevIndex) => {
          if (prevIndex >= todayPath.length - 1) {
            if (intervalRef.current) {
              setplaypause(false);
              clearInterval(intervalRef.current);
            }
            return prevIndex;
          }

          return prevIndex + 1;
        });
      }, vspeedRef.current);
    } else if (action === "reset") {
      setCurrentIndex(0);
      setTracker(0);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setplaypause(false);
    }
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
        <PathWithArrows positions={path} color="blue" />
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
          <div className="w-[25rem] flex items-center bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700">
            <div
              className={`bg-blue-600 h-1.5 rounded-l-full dark:bg-blue-500`}
              style={{ width: `${tracker}%` }}
            ></div>
            <div className="bg-blue-600 h-3.5 w-3.5 rounded-full dark:bg-blue-500"></div>
          </div>
          <div className="flex gap-6">
            <div className="text-white flex items-center bg-blue-600 hover:bg-blue-700 px-6 py-1 rounded-2xl">
              {playpause ? (
                <FaPause onClick={() => play("pause")} />
              ) : (
                <IoPlay onClick={() => play("play")} />
              )}
            </div>
            <button
              type="button"
              onClick={() => play("reset")}
              className="text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-2xl"
            >
              <RxCountdownTimer size={16} />
            </button>
            <Box sx={{ width: 150 }}>
              <Slider
                color="secondary"
                aria-label="Temperature"
                defaultValue={1}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                shiftStep={2}
                step={1}
                marks
                min={1}
                max={5}
              />
            </Box>
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
