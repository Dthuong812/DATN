import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

export default function HomeMap() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow">
      <button
        onClick={() => navigate("/map")}
        className="absolute top-2 right-4 z-[1000] rounded-lg  transition-all border-none shadow-none cursor-pointer underline font-semibold"
      >
        Chi tiết
      </button>

      <MapContainer
        center={[21.0285, 105.8542]}
        zoom={9}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        className="rounded-xl"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}
