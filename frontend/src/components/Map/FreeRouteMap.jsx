import { MapContainer, Marker, Popup, Polyline, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const workerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const complaintIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FreeRouteMap({ start, destination, route }) {
  const center = [
    (Number(start?.latitude || 12.9716) + Number(destination?.latitude || 12.9838)) / 2,
    (Number(start?.longitude || 77.5946) + Number(destination?.longitude || 77.5878)) / 2,
  ];

  const polyline = route?.polyline && typeof route.polyline === "string" && route.polyline.startsWith("[")
    ? JSON.parse(route.polyline)
    : [
        [Number(start?.latitude || 12.9716), Number(start?.longitude || 77.5946)],
        [Number(destination?.latitude || 12.9838), Number(destination?.longitude || 77.5878)],
      ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <MapContainer center={center} zoom={13} scrollWheelZoom className="h-[320px] w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[Number(start?.latitude || 12.9716), Number(start?.longitude || 77.5946)]} icon={workerIcon}>
          <Popup>Worker location</Popup>
        </Marker>

        <Marker position={[Number(destination?.latitude || 12.9838), Number(destination?.longitude || 77.5878)]} icon={complaintIcon}>
          <Popup>Complaint location</Popup>
        </Marker>

        <Polyline positions={polyline} color="#10b981" weight={5} opacity={0.8} />
      </MapContainer>
    </div>
  );
}

export default FreeRouteMap;
