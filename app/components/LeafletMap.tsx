"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useRef } from "react";
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

  function getBearing(start: [number, number], end: [number, number]) {
    if (end !== undefined) {
      const [lat1, lon1] = start.map((deg) => (deg * Math.PI) / 180);
      const [lat2, lon2] = end.map((deg) => (deg * Math.PI) / 180);
      console.log("lon " + lon2);
      const dLon = lon2 - lon1;

      const y = Math.sin(dLon) * Math.cos(lat2);
      const x =
        Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

      const angle = (Math.atan2(y, x) * 180) / Math.PI;
      return (angle + 360) % 360;
    }
  }

  const getRotatedIcon = (iconUrl: string, angle: number) =>
    L.divIcon({
      className: "",
      html: `
        <div style="transform: rotate(${angle}deg); width: 40px; height: 40px;">
          <img src="${iconUrl}" style="width: 100%; height: 100%; transform: rotate(0deg);" />
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

  //   const icon = getVehicleIcon(
  //     playpause === false ? "/redvehicle.png" : "/bluevehicle.png"
  //   );

  function toLatLngTuple(
    pos: L.LatLngExpression | undefined
  ): [number, number] {
    if (!pos) return [0, 0];

    if (Array.isArray(pos)) {
      return pos as [number, number];
    } else if ("lat" in pos && "lng" in pos) {
      return [pos.lat, pos.lng];
    } else {
      throw new Error("Invalid LatLngExpression");
    }
  }

  const angle = getBearing(
    toLatLngTuple(path[currentIndex]),
    toLatLngTuple(path[currentIndex + 1])
  );

  const icon = getRotatedIcon(
    playpause ? "/bluevehicle.png" : "/redvehicle.png",
    angle ?? 0
  );

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

  const showpolyline = () => {
    setCurrentIndex(0);
    setTracker(0);
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
        <Marker
          position={notrack ? path[currentIndex] : [25.1367, 82.56]}
          icon={icon}
        >
          <Popup>
            <div className="w-[19rem] flex flex-col gap-4 py-5 text-xs">
              <div className="flex justify-between h-6">
                <div className="flex gap-1 items-center">
                  <div className="p-1 border rounded-full bg-blue-600">
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

      <div className="fixed md:bottom-2 bottom-6 left-0 w-full flex flex-col gap-2 justify-center items-center z-[999] text-black">
        {notrack ? (
          <div className="max-w-[40rem] md:w-[40rem] sm:w-[30rem] w-[20rem] flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-center bg-white shadow-lg rounded-xl p-4">
            <div className="relative w-full sm:ml-3 ml-2">
              <div className="w-full h-1.5 bg-[#155dfc]/40 rounded-r-full">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${tracker}%` }}
                ></div>
              </div>

              <div
                className="absolute top-[-4px] h-3.5 w-3.5 rounded-full bg-blue-600 transition-transform duration-200"
                style={{
                  left: `calc(${tracker}% - 0.8rem)`,
                }}
              ></div>
            </div>
            <div className="flex flex-wrap gap-4 items-center justify-center w-full sm:w-auto">
              {playpause ? (
                <button
                  onClick={() => play("pause")}
                  className="text-white flex items-center cursor-pointer justify-center bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-2xl"
                >
                  <FaPause />
                </button>
              ) : (
                <button
                  onClick={() => play("play")}
                  className="text-white flex items-center justify-center cursor-pointer  bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-2xl"
                >
                  <IoPlay />
                </button>
              )}
              <button
                type="button"
                onClick={() => play("reset")}
                className="text-white bg-blue-600 cursor-pointer  hover:bg-blue-700 px-6 py-2 rounded-2xl"
              >
                <RxCountdownTimer size={16} />
              </button>
              <div className="flex justify-center items-center w-full sm:w-auto">
                <Box sx={{ width: 150 }}>
                  <Slider
                    color="secondary"
                    aria-label="Speed"
                    defaultValue={1}
                    value={speed}
                    onChange={(e, newValue) => setSpeed(newValue)}
                    onChangeCommitted={(e, newValue) => {
                      vspeedRef.current = newValue * 1000;
                      if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        play("play");
                      } else {
                        play("play");
                      }
                    }}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={5}
                  />
                </Box>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="md:w-[40rem] sm:w-[30rem] w-[20rem] bg-white shadow-lg rounded">
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
              <div className="flex flex-col sm:flex-row justify-between w-full max-w-[30rem] gap-6">
                <div className="flex gap-6">
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
                </div>

                <button
                  type="button"
                  onClick={showpolyline}
                  className="text-white bg-blue-600 hover:bg-blue-700 px-5 py-1 rounded cursor-pointer"
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
