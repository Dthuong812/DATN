import React, { useEffect } from "react";
import { MapContainer, TileLayer, Circle, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { PollutionStation } from "@/types/types";

const pollutionData: PollutionStation[] = [
  { name: "Trạm Cầu Giấy", lat: 21.028511, lng: 105.804817, aqi: 50 },
  { name: "Trạm Hoàn Kiếm", lat: 21.030055, lng: 105.8505, aqi: 120 },
  { name: "Trạm Hai Bà Trưng", lat: 21.005, lng: 105.845, aqi: 200 },
];

function getColor(aqi: number): string {
  if (aqi <= 50) return "green";
  else if (aqi <= 100) return "yellow";
  else if (aqi <= 150) return "orange";
  else if (aqi <= 200) return "red";
  else if (aqi <= 300) return "purple";
  return "maroon";
}

const LegendControl: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    const Legend = L.Control.extend({
      options: { position: "bottomright" },

      onAdd: () => {
        const div = L.DomUtil.create(
          "div",
          "info legend bg-white p-2 rounded shadow text-sm"
        );
        const grades = [0, 50, 100, 150, 200, 300];
        const labels = grades.map((grade, i) => {
          const next = grades[i + 1];
          const label = next ? `${grade}–${next}` : `${grade}+`;
          const color = getColor(grade);
          return `<i style="background:${color};width:18px;height:18px;display:inline-block;margin-right:5px;"></i>${label}`;
        });
        div.innerHTML = `<strong>AQI</strong><br>${labels.join("<br>")}`;
        return div;
      },
    });

    const legend = new Legend();
    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
};

const PollutionMap: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <MapContainer
        center={[21.028511, 105.804817]}
        zoom={12}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {pollutionData.map((station, idx) => (
          <Circle
            key={idx}
            center={[station.lat, station.lng]}
            radius={500}
            pathOptions={{
              color: getColor(station.aqi),
              fillColor: getColor(station.aqi),
              fillOpacity: 0.5,
            }}
          >
            <Popup>
              <b>{station.name}</b>
              <br />
              AQI: {station.aqi}
            </Popup>
          </Circle>
        ))}

        <LegendControl />
      </MapContainer>
    </div>
  );
};

export default PollutionMap;
