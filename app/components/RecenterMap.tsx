"use client";

import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

interface RecenterMapProps {
  center: L.LatLngExpression;
}

export default function RecenterMap({ center }: RecenterMapProps) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center);
    }
  }, [center, map]);

  return null;
}
