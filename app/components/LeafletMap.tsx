"use client";

import dynamic from "next/dynamic";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState, useRef } from "react";
import { GoClock } from "react-icons/go";
import { FaCarAlt } from "react-icons/fa";
import { IoPlay } from "react-icons/io5";
import { FaPause } from "react-icons/fa6";
import { PiMapPinFill } from "react-icons/pi";
import { RxCountdownTimer } from "react-icons/rx";
import { BsFuelPumpFill } from "react-icons/bs";
import { MdBatteryFull } from "react-icons/md";
import PathWithArrows from "./Direction";
import Slider from "@mui/material/Slider";
import { GiPadlock } from "react-icons/gi";
import { IoMdKey } from "react-icons/io";
import Box from "@mui/material/Box";
import {
  todayPath,
  previousDayPath,
  thisWeekPath,
  thisMonthPath,
  previousWeekPath,
  previousMonthPath,
} from "../constants/pathData";
import RecenterMap from "./RecenterMap";
import CarInfo from "./CarInfo";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

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
  const [selectedOption, setSelectedOption] = useState<string>("Today");
  const [playpause, setplaypause] = useState<boolean>(false);
  const [tracker, setTracker] = useState(0);
  const vspeedRef = useRef(1000);
  const [speed, setSpeed] = useState(1);
  const [notrack, setNoTrack] = useState(false);
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

  const play = (action: string) => {
    if (action === "play") {
      if (currentIndex >= todayPath.length - 1) {
        setCurrentIndex(0);
        setTracker(0);
      }
      setplaypause(true);
      intervalRef.current = setInterval(() => {
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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCurrentIndex(0);
      setTracker(0);
      setplaypause(false);
      setSpeed(1);
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
    setNoTrack(true);
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
        center={path.length > 0 ? path[0] : [0, 0]}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        {path.length > 0 && <RecenterMap center={path[0]} />}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {notrack ? <PathWithArrows positions={path} color="blue" /> : <></>}
        <Marker position={notrack ? path[currentIndex] : [25.1367, 82.56]}>
          <Popup>
            <div className="w-[19rem] flex flex-col gap-4 py-5 text-xs">
              <div className="flex justify-between h-6">
                <div className="flex gap-1 items-center">
                  <div className="p-1 border rounded-full bg-[#4860C1]">
                    <FaCarAlt size={20} className="text-white" />
                  </div>
                  <p className="font-semibold">WIRELESS</p>
                </div>
                <div className="flex gap-1 items-center bg-[#59E155]/30 text-[#177020] px-2 rounded-sm">
                  <GoClock size={16} />
                  <p className="font-semibold">Jul 20, 07:09 AM</p>
                </div>
              </div>
              <div className="flex gap-1 items-center">
                <PiMapPinFill className="text-[#049596]" size={20} />
                <div className="overflow-hidden w-full">
                  <div className="whitespace-nowrap animate-marquee">
                    <span className="inline-block px-4">
                      A22, New Panchganga Hsg.So, Vijay Nagar, Deolali Camp,
                      Nashik Maharashtra 422001
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full h-full flex justify-center">
                <div className="flex flex-wrap gap-4 items-center pl-2">
                  <CarInfo info="0.00 km/h" infotype="Speed" />
                  <CarInfo info="0.00 km/h" infotype="Distance" />
                  <CarInfo info="16 %" infotype="Battery" />
                  <CarInfo info="0.00 km/h" infotype="Total Distance" />
                  <CarInfo
                    info="0.00 km/h"
                    infotype="Distance From Last Stop"
                  />
                  <CarInfo info="00h.00m" infotype="Total Running" />
                  <CarInfo info="00h.00m" infotype="Today Stopped" />
                  <CarInfo info="STOPPED" infotype="Current Status" />
                  <CarInfo info="0.00 km/h" infotype="Today Max Speed" />
                  <CarInfo info="16 %" infotype="Custom Value" />
                </div>
              </div>
              <div className="w-full flex gap-4 items-center justify-center">
                <div className="px-6 py-1.5 rounded-full bg-amber-500/20">
                  <IoMdKey className="text-amber-600" size={20} />
                </div>
                <div className="px-6 py-1.5 rounded-full bg-amber-500/20">
                  <MdBatteryFull className="text-amber-600" size={20} />
                </div>
                <div className="px-6 py-1.5 rounded-full bg-amber-500/20">
                  <BsFuelPumpFill className="text-amber-600" size={20} />
                </div>
                <div className="px-6 py-1.5 rounded-full bg-amber-500/20">
                  <GiPadlock className="text-amber-600" size={20} />
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      <div className="fixed bottom-2 left-0 w-full flex flex-col gap-2 justify-center items-center z-[999] text-black">
        {notrack ? (
          <div className="w-[50rem] flex gap-4 items-center bg-white shadow-lg rounded p-4">
            <div className="w-[25rem] flex items-center bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700">
              <div
                className={`bg-blue-600 h-1.5 rounded-l-full dark:bg-blue-500`}
                style={{ width: `${tracker}%` }}
              ></div>
              <div className="bg-blue-600 h-3.5 w-3.5 rounded-full dark:bg-blue-500"></div>
            </div>
            <div className="flex gap-6">
              {playpause ? (
                <button
                  onClick={() => play("pause")}
                  className="text-white flex items-center bg-blue-600 hover:bg-blue-700 px-6 py-1 rounded-2xl"
                >
                  <FaPause />
                </button>
              ) : (
                <button
                  onClick={() => play("play")}
                  className="text-white flex items-center bg-blue-600 hover:bg-blue-700 px-6 py-1 rounded-2xl"
                >
                  <IoPlay />
                </button>
              )}

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
                  value={speed}
                  onChange={(e, newValue) => setSpeed(newValue)}
                  onChangeCommitted={(e, newValue) => {
                    vspeedRef.current = newValue * 1000;
                    if (intervalRef.current) {
                      console.log("adioafsdl");
                      clearInterval(intervalRef.current);
                      play("play");
                    } else {
                      play("play");
                    }
                  }}
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
        ) : (
          <></>
        )}
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
