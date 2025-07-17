import type { Station } from "@/types/types";
import { Wifi, MapPin } from "lucide-react";

interface StationDetailProps {
  station: Station | null;
}

export default function StationDetail({ station }: StationDetailProps) {
  if (!station) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Vui lòng chọn một trạm.
      </div>
    );
  }

  return (
    <div className="border rounded-xl p-4 space-y-2 bg-white shadow">
      <div className="flex justify-between items-center">
        <div className="font-semibold text-lg">{station.name}</div>
        <span
          className={`flex items-center gap-1 text-sm font-medium ${
            station.status === "Hoạt động"
              ? "text-green-600"
              : "text-white bg-black px-2 py-1 rounded-md"
          }`}
        >
          <Wifi className="w-4 h-4" />{" "}
          {station.status === "Hoạt động" ? "Trực tuyến" : "Bảo trì"}
        </span>
      </div>

      <div className="text-sm text-muted-foreground flex items-center gap-1">
        <MapPin className="w-4 h-4" /> {station.location}
      </div>

      <div className="flex items-center gap-2">
        <span className="font-semibold">Chỉ số AQI:</span>
        <span className="text-lg font-semibold text-orange-600">
          {station.aqi}
        </span>
        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-md">
          Moderate
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          Nhiệt độ: <strong>28.7°C</strong>
        </div>
        <div>
          Độ ẩm: <strong>63.2%</strong>
        </div>
        <div>
          PM2.5: <strong>66.1 µg/m³</strong>
        </div>
        <div>
          Độ ồn: <strong>68.0 dB</strong>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        🕒 Cập nhật lần cuối: 22:45:53 04/07/2025
      </div>
      <div className="text-xs text-muted-foreground">7 cảm biến hoạt động</div>
    </div>
  );
}
