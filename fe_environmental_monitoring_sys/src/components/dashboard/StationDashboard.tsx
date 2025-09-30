import { useEffect, useState } from "react";
import StationDetail from "./StationDetail";
import StationChart from "./StationChart";
import { useGetObjectQuery } from "@/services/object.service";
import type { Object } from "@/types/types";
import { useSearchParams } from "react-router-dom";
import ObjectList from "./StationList";

export default function StationDashboard() {
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState({
    Name: searchParams.get("Name") || "",
  });
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10000;
  const { data} = useGetObjectQuery( {...filter,page,pageSize}, {
    refetchOnMountOrArgChange: true,
  });

  const stations: Object[] = data?.Data?.data || [];
  const [selectedStation, setSelectedStation] = useState<Object | null>(null);

  useEffect(() => {
    if (stations.length > 0 && !selectedStation) {
      setSelectedStation(stations[0]); 
    }
  }, [stations, selectedStation]);

  const handleFilter = (filterValue: string) => {
    setFilter({ Name: filterValue }); 
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4 mb-6">
      <div className="col-span-1 space-y-4">
        <ObjectList
          objects={stations}
          selectedStation={selectedStation}
          onSelect={setSelectedStation}
          onFilter={handleFilter}
        />
        <StationDetail object={selectedStation} />
      </div>
      <div className="lg:col-span-2">
        <StationChart object={selectedStation} />
      </div>
    </div>
  );
}
