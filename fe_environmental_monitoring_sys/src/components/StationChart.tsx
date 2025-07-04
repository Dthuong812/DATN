import { RefreshCcw, BarChart3 } from "lucide-react";
import SensorChart from "./SensorChart";

export default function StationChart() {
  return (
    <div className="border rounded-xl p-4 space-y-3 h-full bg-white shadow">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold flex items-center gap-2 text-lg">
          <BarChart3 className="w-5 h-5" /> Dữ liệu thời gian thực - Trạm Trung tâm Hà Nội
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <button className="bg-muted px-2 py-1 rounded-md">Cập nhật #214</button>
          <button className="flex items-center gap-1 bg-black text-white px-2 py-1 rounded-md text-xs">
            <RefreshCcw className="w-3 h-3" /> Tự động
          </button>
        </div>
      </div>
      <div className="h-130 flex items-center justify-center text-muted-foreground text-sm italic my-4">
       <SensorChart />
      </div>
      <div className="text-xs text-center text-muted-foreground pt-3">
        Dữ liệu được cập nhật tự động mỗi 10 giây • Hiển thị 20 điểm dữ liệu gần nhất
      </div>
    </div>
  );
}
