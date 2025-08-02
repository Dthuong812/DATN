import { Card } from "@/components/ui/card";
import MapStationPage from "@/components/stations/MapStationPage";
import StationTableView from "@/components/stations/StationTableView";
import { useState } from "react";

export default function StationPage() {
  const [viewMode, setViewMode] = useState<"map" | "table">("map");

  return (
    <div className="max-w-8xl mx-auto h-full overflow-auto scrollbar-hide z-0">
      <Card className="p-0 h-full overflow-hidden rounded-none">
        {viewMode === "map" ? (
          <MapStationPage setViewMode={setViewMode} />
        ) : (
          <StationTableView setViewMode={setViewMode} />
        )}
      </Card>
    </div>
  );
}
