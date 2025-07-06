import { useState } from "react";
import type { Station } from "@/types/types";

interface StationListProps {
  stations: Station[];
  onSelect: (station: Station) => void;
}

export default function StationList({ stations, onSelect }: StationListProps) {
  const [activeStation, setActiveStation] = useState<Station | null>(null);

  const handleSelect = (station: Station) => {
    setActiveStation(station); 
    onSelect(station); 
  };

  return (
    <div className="space-y-4 border rounded-xl p-4 bg-white shadow min-h-[400px] ">
      <h2 className="font-semibold flex items-center gap-2 text-lg border-b pb-2">
        📍 Chọn trạm giám sát
      </h2>
      <div className="space-y-2 overflow-auto scrollbar-hide max-h-[310px] pr-1">
        {stations.map((station, i) => (
          <div
            key={i}
            onClick={() => handleSelect(station)}
            className={`p-3 rounded-xl flex justify-between items-center cursor-pointer
              ${
                activeStation?.name === station.name
                  ? "bg-green-100 border-green-700 shadow"
                  : ""
              } hover:shadow`}
          >
            <div>
              <div className="font-semibold">{station.name}</div>
              <div className="text-sm text-muted-foreground">{station.location}</div>
            </div>
            <span
              className={`px-3 py-1 text-xs rounded-md font-medium ${
                station.status === "Hoạt động"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-900 text-white"
              }`}
            >
              {station.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
