import { useState } from "react";
import type { Object } from "@/types/types";
import { Input } from "../ui/input";


interface ObjectListProps {
  objects: Object[];
  selectedStation: Object | null;
  onSelect: (station: Object) => void;
  onFilter: (filter: string) => void;
}

export default function ObjectList({
  objects,
  selectedStation,
  onSelect,
  onFilter,
}: ObjectListProps) {
  const [filter, setFilter] = useState("");

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(value)
    setFilter(value);
    onFilter(value);
  };

  return (
    <div className="space-y-4 border rounded-xl p-4 bg-white shadow min-h-[430px]">
      <div className="flex flex-row gap-2 w-full items-center mb-2">
        <h2 className="font-semibold flex items-center gap-2 text-lg w-full">
          Chọn trạm giám sát
        </h2>
        <Input
          type="text"
          value={filter}
          onChange={handleFilterChange}
          placeholder="Tìm kiếm trạm theo tên..."
          className="w-full p-2 border rounded-md "
        />
      </div>
      <hr />
      <div className="space-y-2 overflow-auto scrollbar-hide max-h-[310px] pr-1">
        {objects.map((station, i) => (
          <div
            key={i}
            onClick={() => onSelect(station)}
            className={`p-3 rounded-xl flex justify-between items-center cursor-pointer
              ${
                selectedStation?.Code === station.Code
                  ? "bg-green-100 border-green-700 shadow"
                  : ""
              } hover:shadow`}
          >
            <div>
              <div className="font-semibold">{station.Name}</div>
              <div className="text-sm text-muted-foreground">
                {station.Details_Value.Address}
              </div>
            </div>
            <span
              className={`px-3 py-1 text-xs rounded-md font-medium ${
                station.Status === 1
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-900 text-white"
              }`}
            >
              {station.Status === 1 ? "Hoạt động" : "Bảo trì"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
