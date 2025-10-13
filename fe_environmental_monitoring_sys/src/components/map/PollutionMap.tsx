import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "../ui/button";
import type { DeviceData, Object, SensorConfigType } from "@/types/types";
import { io, type Socket } from "socket.io-client";
import { useGetObjectQuery } from "@/services/object.service";
import { useGetConfigsQuery } from "@/services/senser-config.service";
import SearchBox from "./SearchBox";
import LegendControl from "./LegendControl";
import ZoomControlTopRight from "./ZoomControlTopRight";
import StationMarker from "./StationMarker";
import { useGetLatestDeviceDatasQuery } from "@/services/devicedata.service";

const PollutionMap: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>("AQI");
  const [stations, setStations] = useState<DeviceData[]>([]);
  const [, setSocket] = useState<Socket | null>(null);
  const { data: objectData } = useGetObjectQuery({});
  const { data: configsList, isLoading, isError } = useGetConfigsQuery({});
  const configs = configsList?.Data ?? []; 
  const { data: apiResponse} = useGetLatestDeviceDatasQuery({});
  useEffect(() => {
    if (apiResponse && Array.isArray(apiResponse)) {
      setStations(apiResponse);
    }
  }, [apiResponse]);
  useEffect(() => {
    const s: Socket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
    });
    setSocket(s);
    s.emit("subscribeDeviceData");

    s.on("deviceDataUpdate", (data: DeviceData | DeviceData[]) => {
      if (Array.isArray(data)) setStations(data);
      else {
        setStations((prev) => {
          const updated = [...prev];
          const idx = updated.findIndex(
            (st) => st.Object_Code === data.Object_Code
          );
          if (idx >= 0) updated[idx] = data;
          else updated.push(data);
          return updated;
        });
      }
    });

    return () => {
      s.disconnect();
    };
  }, []);

  const configMap = Object.fromEntries(
    configs.map((cfg: SensorConfigType) => [
      cfg.Code,
      {
        Label: cfg.Label,
        Unit: cfg.Unit,
        Thresholds: cfg.Thresholds,
        Colors: cfg.Colors,
        Descriptions: cfg.Descriptions,
        Field: cfg.Field,
      },
    ])
  );

  const types = Object.keys(configMap);
  const currentCfg = configMap[selectedType];


  const getColor = (value: number): string => {
    if (!currentCfg) return "gray";
    for (let i = 0; i < currentCfg.Thresholds.length; i++) {
      if (value <= currentCfg.Thresholds[i]) return currentCfg.Colors[i];
    }
    return currentCfg.Colors[currentCfg.Colors.length - 1];
  };


  const getTextColor = (bg: string) =>
    ["blue", "green", "red", "purple", "brown"].includes(bg.toLowerCase())
      ? "white"
      : "black";

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
            {types.map((type) => (
              <Button
                key={type}
                className={`bg-white text-green-600 px-6 py-2 rounded-md shadow hover:bg-green-600 hover:text-white ${
                  selectedType === type ? "bg-green-600 text-white" : ""
                }`}
                onClick={() => setSelectedType(type)}
              >
                {configMap[type].Label}
              </Button>
            ))}
          </div>
        </div>

        {stations.map((station, idx) => {
          const cfg = configMap[selectedType];
          if (!cfg) return null;

          const object = objectData?.Data?.data.find(
            (obj: Object) => obj.Code === station.Object_Code
          );

          return (
            <StationMarker
              key={idx}
              station={station}
              config={cfg}
              object={object}
              getColor={getColor}
              getTextColor={getTextColor}
            />
          );
        })}

        <ZoomControlTopRight />
        {currentCfg && <LegendControl config={currentCfg} />}
      </MapContainer>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-[2000]">
          <div className="text-lg font-semibold">Đang tải dữ liệu cấu hình...</div>
        </div>
      )}

      {(isError || (!configs.length && !isLoading)) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-[2000]">
          <div className="text-red-600 font-semibold">Lỗi tải dữ liệu cấu hình!</div>
        </div>
      )}
    </div>
    
  );
};

export default PollutionMap;
