import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";

interface RecenterMapProps {
  center: LatLngExpression;
}

const RecenterMap = ({ center }: RecenterMapProps) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);

  return null;
};

export default RecenterMap;
