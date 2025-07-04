import { Wifi, MapPin } from "lucide-react";

export default function StationDetail() {
  return (
    <div className="border rounded-xl p-4 space-y-2 bg-white shadow">
      <div className="flex justify-between items-center">
        <div className="font-semibold text-lg">Trạm Trung tâm Hà Nội</div>
        <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
          <Wifi className="w-4 h-4" /> Trực tuyến
        </span>
      </div>

      <div className="text-sm text-muted-foreground flex items-center gap-1">
        <MapPin className="w-4 h-4" /> Hoàn Kiếm, Hà Nội
      </div>

      <div className="flex items-center gap-2">
        <span className="font-semibold">Chỉ số AQI:</span>
        <span className="text-lg font-semibold text-orange-600">102.35</span>
        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-md">Moderate</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>Nhiệt độ: <strong>28.7°C</strong></div>
        <div>Độ ẩm: <strong>63.2%</strong></div>
        <div>PM2.5: <strong>66.1 µg/m³</strong></div>
        <div>Độ ồn: <strong>68.0 dB</strong></div>
      </div>

      <div className="text-xs text-muted-foreground">
        🕒 Cập nhật lần cuối: 22:45:53 04/07/2025
      </div>
      <div className="text-xs text-muted-foreground">7 cảm biến hoạt động</div>
    </div>
  );
}
