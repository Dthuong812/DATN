import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "../ui/button";
import type { DeviceData, Object } from "@/types/types";
import { io, type Socket } from "socket.io-client";
import { useGetObjectQuery } from "@/services/object.service";
import SearchBox from "./SearchBox";

function getValueByType(station: DeviceData, type: string): number {
  switch (type) {
    case "AQI":
      return station.DataJson?.iaq ?? 0;
    case "Temperature":
      return station.DataJson?.temperature ?? 0;
    case "Humidity":
      return station.DataJson?.humidity ?? 0;
    case "Pressure":
      return station.DataJson?.pressure ?? 0;
    case "Noise":
      return station.DataJson?.sound_level ?? 0;
    case "Flood":
      return station.DataJson?.distance ?? 0;
    default:
      return 0;
  }
}

function getColor(type: string, value: number): string {
  if (type === "AQI") {
    if (value <= 50) return "green";
    else if (value <= 100) return "yellow";
    else if (value <= 150) return "orange";
    else if (value <= 200) return "red";
    else if (value <= 300) return "purple";
    else return "brown";
  } else if (type === "Temperature") {
    if (value <= 10) return "blue";
    else if (value <= 20) return "lightblue";
    else if (value <= 30) return "orange";
    else return "red";
  } else if (type === "Humidity") {
    if (value <= 30) return "yellow";
    else if (value <= 60) return "green";
    else return "blue";
  } else if (type === "Pressure") {
    if (value <= 1000) return "red";
    else if (value <= 1025) return "green";
    else return "orange";
  } else if (type === "Noise") {
    if (value <= 40) return "green";
    else if (value <= 60) return "yellow";
    else if (value <= 80) return "orange";
    else return "red";
  } else if (type === "Flood") {
    if (value === 0) return "green";
    else if (value <= 1) return "yellow";
    else if (value <= 2) return "orange";
    else return "red";
  }
  return "gray";
}

const getTextColor = (bgColor: string) => {
  const c = bgColor.toLowerCase();
  if (["blue", "green", "red", "purple", "brown"].includes(c)) {
    return "white";
  }
  return "black";
};

const LegendControl: React.FC<{ type: string }> = ({ type }) => {
  const map = useMap();
  useEffect(() => {
    const Legend = L.Control.extend({
      options: { position: "bottomright" },
      onAdd: () => {
        const div = L.DomUtil.create(
          "div",
          "info legend bg-white p-2 rounded shadow text-sm"
        );
        let grades: number[] = [];
        let descriptions: string[] = [];

        if (type === "AQI") {
          grades = [50, 100, 150, 200, 300];
          descriptions = [
            "Tốt",
            "Trung bình",
            "Kém",
            "Xấu",
            "Rất xấu",
            "Nguy hiểm",
          ];
        } else if (type === "Temperature") {
          grades = [10, 20, 30];
          descriptions = ["Rất lạnh", "Lạnh", "Ấm", "Nóng"];
        } else if (type === "Humidity") {
          grades = [30, 60, 100];
          descriptions = ["Khô", "Bình thường", "Ẩm"];
        } else if (type === "Pressure") {
          grades = [1000, 1025, 1050];
          descriptions = ["Thấp", "Bình thường", "Cao"];
        } else if (type === "Noise") {
          grades = [40, 60, 80, 100];
          descriptions = ["Yên tĩnh", "Trung bình", "Ồn", "Rất ồn"];
        } else if (type === "Flood") {
          grades = [1, 2, 3];
          descriptions = ["Nhẹ", "Trung bình", "Nặng"];
        }

        const labels = grades.map((grade, i) => {
          const color = getColor(type, grade);
          return `<div style="display: flex; align-items: center; margin-bottom: 5px; padding-right:8px">
                    <i style="background:${color};width:18px;height:18px;display:inline-block;margin-right:5px;"></i>
                    <span>< ${grade} (${descriptions[i] || ""})</span>
                  </div>`;
        });

        div.innerHTML = `<div style="display: flex; flex-direction: row;">${labels.join(
          ""
        )}</div>`;
        return div;
      },
    });

    const legend = new Legend();
    legend.addTo(map);
    return () => {
      legend.remove();
    };
  }, [map, type]);

  return null;
};

const ZoomControlTopRight: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    const zoomControl = L.control.zoom({ position: "topright" });
    zoomControl.addTo(map);
    return () => {
      map.removeControl(zoomControl);
    };
  }, [map]);
  return null;
};


const PollutionMap: React.FC = () => {
  const [selectedType, setSelectedType] = useState("AQI");
  const [stations, setStations] = useState<DeviceData[]>([]);
  const [, setSocket] = useState<Socket | null>(null);
  const { data: objectData } = useGetObjectQuery({});

  useEffect(() => {
    const s: Socket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
    setSocket(s);
    s.emit("subscribeDeviceData");

    s.on("deviceDataUpdate", (data: DeviceData | DeviceData[]) => {
      if (Array.isArray(data)) setStations(data);
      else {
        setStations((prev) => {
          const updated = [...prev];
          const index = updated.findIndex(
            (st) => st.Object_Code === data.Object_Code
          );
          if (index >= 0) updated[index] = data;
          else updated.push(data);
          return updated;
        });
      }
    });

    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <MapContainer
        center={[21.028511, 105.804817]}
        zoom={12}
        className="w-full h-full"
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <div className="absolute top-6">
          <SearchBox stations={stations} objectData={objectData} />
          <div className="absolute left-80 z-[1000] flex flex-row gap-4">
            {[
              "AQI",
              "Temperature",
              "Humidity",
              "Pressure",
              "Noise",
              "Flood",
            ].map((type) => (
              <Button
                key={type}
                className={`bg-white text-green-600 px-6 py-2 rounded-md shadow hover:bg-green-600 hover:text-white ${
                  selectedType === type ? "bg-green-600 text-white" : ""
                }`}
                onClick={() => setSelectedType(type)}
              >
                {type === "AQI"
                  ? "AQI"
                  : type === "Temperature"
                  ? "Nhiệt độ"
                  : type === "Humidity"
                  ? "Độ ẩm"
                  : type === "Pressure"
                  ? "Áp suất"
                  : type === "Noise"
                  ? "Độ ồn"
                  : "Mức ngập"}
              </Button>
            ))}
          </div>
        </div>
        {stations.map((station, idx) => {
          const value = getValueByType(station, selectedType);
          const color = getColor(selectedType, value);
          const textColor = getTextColor(color);
          const object = objectData?.Data?.data.find(
            (obj: Object) => obj.Code === station.Object_Code
          );
          const name = object?.Name || station.Object_Code;
          const address =
            object?.Details_Value?.Address || "Không có thông tin";

          return (
            <Marker
              key={idx}
              position={[station.Latitude, station.Longitude]}
              icon={L.divIcon({
                html: `<div style="
                  background:${color};
                  border-radius:50%;
                  width:40px;
                  height:40px;
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  color:${textColor};
                  font-weight:bold;
                  font-size:10px;
                  border:2px solid white;
                  box-shadow:0 0 5px rgba(0,0,0,0.3);
                ">${value}</div>`,
                className: "",
                iconSize: [40, 40],
              })}
            >
              <Popup>
                <b>{name}</b>
                <br />
                Địa chỉ: {address}
                <br />
                {selectedType}: {value}
              </Popup>
            </Marker>
          );
        })}
        <ZoomControlTopRight />
        <LegendControl type={selectedType} />
      </MapContainer>
    </div>
  );
};

export default PollutionMap;
