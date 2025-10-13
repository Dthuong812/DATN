import type { DeviceData, Object } from "@/types/types";
import { Wifi, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface ObjectDetailProps {
  object: Object | null;
}

export default function StationDetail({ object }: ObjectDetailProps) {
  const [latestData, setLatestData] = useState<DeviceData | null>(null); 
  const [, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!object) return;

    // Kết nối WebSocket
    const s: Socket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    setSocket(s);

    s.emit("subscribeDeviceData", { Object_Code: object.Code });

    s.on("deviceDataUpdate", (data: DeviceData | DeviceData[]) => {
      if (Array.isArray(data)) {

        const latestRecord = data[data.length - 1];
        if (latestRecord?.Object_Code === object.Code) {
          setLatestData(latestRecord);
        }
      } else {

        if (data.Object_Code === object.Code) {
          setLatestData(data);
        }
      }
    });

    s.on("disconnect", () => {
      console.warn("Disconnected. Retrying...");
    });

    s.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    return () => {
      s.disconnect(); 
    };
  }, [object]);

  if (!object) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Vui lòng chọn một trạm.
      </div>
    );
  }

  return (
    <div className="border rounded-xl p-4 space-y-2 bg-white shadow min-h-[200px]">
      <div className="flex justify-between items-center">
        <div className="font-semibold text-lg">{object.Name}</div>
        <span
          className={`flex items-center gap-1 text-sm font-medium ${
            object.Status === 1
              ? "text-green-600"
              : "text-white bg-black px-2 py-1 rounded-md"
          }`}
        >
          <Wifi className="w-4 h-4" />{" "}
          {object.Status === 1 ? "Trực tuyến" : "Bảo trì"}
        </span>
      </div>

      <div className="text-sm text-muted-foreground flex items-center gap-1">
        <MapPin className="w-4 h-4" /> {object.Details_Value.Address}
      </div>

      {latestData ? (
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            Nhiệt độ: <strong>{latestData.DataJson.temperature?? "N/A"}°C</strong>
          </div>
          <div>
            Độ ẩm: <strong>{latestData.DataJson.humidity ?? "N/A"}%</strong>
          </div>
          <div>
          Áp suất: <strong>{latestData.DataJson.pressure ?? "N/A"} hPa</strong>
          </div>
          <div>
           IAQ: <strong>{latestData.DataJson.iaq ?? "N/A"}</strong>
          </div>
          {/* <div>
          Mức ngập: <strong>{latestData.DataJson.distance ?? "N/A"}cm</strong>
          </div> */}
          <div>
            Độ ồn: <strong>{latestData.DataJson.sound_level ?? "N/A"} dB</strong>
          </div>
          <div>
            Khí VOC: <strong>{latestData.DataJson.voc ?? "N/A"}</strong>
          </div>
          <div>
            CO2: <strong>{latestData.DataJson.co2 ?? "N/A"}</strong>
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          Đang tải dữ liệu mới nhất...
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        🕒 Cập nhật lần cuối:{" "}
        {latestData?.Times
          ? new Date(latestData.Times).toLocaleTimeString("vi-VN")
          : "N/A"}
      </div>
    </div>
  );
}
