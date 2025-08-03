import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import L from "leaflet";
// import { toast } from "sonner";
import { DrawerDetailStation } from "./DrawerDetailStation";
import "leaflet/dist/leaflet.css";
import { useGetStationsQuery } from "@/services/stations.service";
import type { Station } from "@/types/types";
import { UpdateStationModal } from "./UpdateStationModal";
import { DeleteStationButton } from "./DeleteStationButton";

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const greyIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapStationPage({
  setViewMode,
}: {
  setViewMode: (mode: "map" | "table") => void;
}) {
  const { data, refetch } = useGetStationsQuery({});
  const stations = data?.Data ?? [];
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedStationId, setSelectedStationId] = useState<number | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const handleViewDetails = (station: Station) => {
    setSelectedStation(station);
    setDetailDrawerOpen(true);
  };
  const handleEdit = (id: number) => {
    setSelectedStationId(id);
    setModalOpen(true);
  };
  function CustomZoomControl() {
    const map = useMap();

    useEffect(() => {
      const zoomControl = L.control.zoom({ position: "bottomleft" });
      zoomControl.addTo(map);
      return () => {
        zoomControl.remove();
      };
    }, [map]);

    return null;
  }

  return (
    <div className="relative max-w-8xl mx-auto h-full w-full overflow-auto scrollbar-hide z-0">
      <CardContent className="h-full w-full p-0">
        <div className="h-full w-full overflow-hidden">
          <MapContainer
            center={[21.0285, 105.8542]}
            zoom={13}
            scrollWheelZoom
            zoomControl={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <CustomZoomControl />
            {stations.map((station: Station) => (
              <Marker
                key={station.Id}
                position={[station.Lat, station.Lng]}
                icon={station.Status === 1 ? greenIcon : greyIcon}
              >
                <Popup>
                  <div className="text-sm space-y-1 w-40">
                    <p className="font-bold">{station.Name}</p>
                    <p>{station.Address}</p>
                    <p>Thiết bị: 1</p>
                    <p
                      className={`w-fit mt-2 px-2 py-1 rounded-md ${
                        station.Status === 1 ? "bg-green-100 text-green-900" : "bg-gray-100 text-red-900"
                      }`}
                    >
                      {station.Status === 1 ? "Hoạt động" : "Không hoạt động"}
                    </p>
                    <div className="flex flex-col items-center">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleViewDetails(station)}
                        className="text-xs px-2 py-1 w-40"
                      >
                        Thông tin chi tiết
                      </Button>
                      <div className="flex gap-2 mt-2 flex-wrap justify-center">
                        <Button
                          className="cursor-pointer"
                          size="icon"
                          variant="outline"
                          onClick={() => handleEdit(station.Id)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <DeleteStationButton
                          id={station.Id}
                          refetch={refetch}
                        />
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
      <DrawerDetailStation
        open={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
        station={selectedStation}
      />
      <div className="absolute bottom-4 right-4 z-[1000] bg-white shadow-md rounded-lg p-4 text-sm space-y-2 w-40">
        <p className="font-semibold text-base">Thống kê </p>
        <div className="flex justify-between">
          <span className="text-green-600">Hoạt động</span>
          <span className="font-medium">
            {stations.filter((s: Station) => s.Status === 1).length}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Không hoạt động</span>
          <span className="font-medium">
            {stations.filter((s: Station) => s.Status === 0).length}
          </span>
        </div>
        <div
          className="flex justify-between font-semibold text-blue-800 pt-2 border-t mt-2 cursor-pointer"
          onClick={() => setViewMode("table")}
        >
          <span>Tổng cộng</span>
          <span>{stations.length}</span>
        </div>
      </div>
      <UpdateStationModal
        stationId={selectedStationId}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
