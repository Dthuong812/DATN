import { useState } from "react";
import StationList from "./StationList";
import StationDetail from "./StationDetail";
import StationChart from "./StationChart";
import type { Station } from "@/types/types";

export default function StationDashboard() {
  const stations: Station[] = [
    { name: "Trạm Trung tâm Hà Nội", location: "Hoàn Kiếm, Hà Nội", status: "Hoạt động", aqi: 102.35 },
    { name: "Trạm Cầu Giấy", location: "Cầu Giấy, Hà Nội", status: "Hoạt động", aqi: 85.1 },
    { name: "Trạm 2", location: "Cầu Giấy, Hà Nội", status: "Hoạt động", aqi: 85.1 },
    { name: "Trạm 3", location: "Cầu Giấy, Hà Nội", status: "Hoạt động", aqi: 85.1 },
    { name: "Trạm Thanh Xuân", location: "Thanh Xuân, Hà Nội", status: "Bảo trì", aqi: 70.0 },
  ];

  const [selectedStation, setSelectedStation] = useState<Station | null>(stations[0]); 

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4 mb-6">
      <div className="col-span-1 space-y-4">
        <StationList stations={stations} onSelect={setSelectedStation} />
        <StationDetail station={selectedStation} />
      </div>
      <div className="lg:col-span-2">
        <StationChart station={selectedStation} />
      </div>
    </div>
  );
}
