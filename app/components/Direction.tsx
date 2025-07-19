"use client";

import { useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet-polylinedecorator";

export default function PathWithArrows({
  positions,
  color,
}: {
  positions: L.LatLngExpression[];
  color: string;
}) {
  const map = useMap();

  useEffect(() => {
    const baseLine = L.polyline(positions, { color });
    const decorator = L.polylineDecorator(baseLine, {
      patterns: [
        {
          offset: 25,
          repeat: 50,
          symbol: L.Symbol.arrowHead({
            pixelSize: 10,
            polygon: false,
            pathOptions: { color },
          }),
        },
      ],
    });

    baseLine.addTo(map);
    decorator.addTo(map);

    return () => {
      map.removeLayer(baseLine);
      map.removeLayer(decorator);
    };
  }, [positions, color, map]);

  return null;
}
