import React, { useState } from "react";
import { Input } from "../ui/input";
import { X, Search } from "lucide-react";
import { useMap } from "react-leaflet";
import type { DeviceData, Object } from "@/types/types";

interface Props {
  stations: DeviceData[];
  objectData: Object;
}

const SearchBox: React.FC<Props> = ({ stations, objectData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState(false); 
  const map = useMap();

  const getObjectInfo = (station: DeviceData) => {
    const object = objectData?.Data?.data.find(
      (obj: Object) => obj.Code === station.Object_Code
    );
    return object
      ? {
          name: object.Name,
          address: object.Details_Value?.Address || "Không có thông tin",
        }
      : { name: station.Object_Code, address: "Không có thông tin" };
  };

  const filteredStations = stations.filter((station) =>
    getObjectInfo(station).name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="absolute left-4 z-[1000] w-72">
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="Tìm kiếm trạm..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
            setSelected(false); 
          }}
          onFocus={() => setShowDropdown(true)}
          className="w-full pl-4 pr-8 border-none bg-gray-50  py-2 text-sm shadow-sm 
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        />

        {!selected ? (
          <Search className="absolute right-2 text-gray-400 w-4 h-4" />
        ) : (
          <X
            className="absolute right-2 w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600"
            onClick={() => {
              setSearchTerm(""); 
              setShowDropdown(false);
              setSelected(false); 
              map.flyTo([21.028511, 105.804817], 12); 
            }}
          />
        )}
      </div>

      {showDropdown && searchTerm && !selected && (
        <ul className="absolute left-0 right-0 mt-1 max-h-60 overflow-auto rounded-md border bg-white shadow-lg z-50">
          {filteredStations.length > 0 ? (
            filteredStations.map((station, idx) => {
              const info = getObjectInfo(station);
              return (
                <li
                  key={idx}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => {
                    setSearchTerm(info.name);
                    setShowDropdown(false);
                    setSelected(true); 
                    map.setView([station.Latitude, station.Longitude], 15);
                  }}
                >
                  <div className="font-medium">{info.name}</div>
                  <div className="text-xs text-gray-500">{info.address}</div>
                </li>
              );
            })
          ) : (
            <li className="px-3 py-2 text-sm text-gray-500">Không tìm thấy</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
