import L from "leaflet";

export const getVehicleIcon = (iconUrl: string) => {
  return L.icon({
    iconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};
