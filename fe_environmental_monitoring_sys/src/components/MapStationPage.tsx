import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2 } from "lucide-react";
import L from "leaflet";
import { toast } from "sonner";
import DrawerDetailStation from "./DrawerDetailStation";
import "leaflet/dist/leaflet.css";
import StationListModal from "./StationListModal";

// Tùy chỉnh icon màu
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

// Component bắt sự kiện click map khi đang thêm trạm
function AddMarkerOnClick({
  onClick,
  isAdding,
}: {
  onClick: (latlng: L.LatLng) => void;
  isAdding: boolean;
}) {
  useMapEvents({
    click(e) {
      if (isAdding) {
        onClick(e.latlng);
      }
    },
  });
  return null;
}

export default function SensorStationPage() {
  const [stations, setStations] = useState([
    {
      id: 1,
      name: "Trạm Hoàn Kiếm",
      lat: 21.0285,
      lng: 105.8542,
      address: "Hoàn Kiếm, Hà Nội",
      deviceCount: 5,
      status: "Hoạt động",
    },
    {
      id: 2,
      name: "Trạm Ba Đình",
      lat: 21.037,
      lng: 105.8345,
      address: "Ba Đình, Hà Nội",
      deviceCount: 3,
      status: "Bảo trì",
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newPosition, setNewPosition] = useState<L.LatLng | null>(null);
  const [newInfo, setNewInfo] = useState({ name: "", address: "" });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const handleViewDetails = () => {
    setIsDrawerOpen(true);
  };

  const handleStartAdd = () => {
    toast.warning("Vui lòng chọn vị trí trạm mới trên bản đồ!");
    setIsAdding(true);
    setNewPosition(null);
    setNewInfo({ name: "", address: "" });
  };

  const handleMapClick = (latlng: L.LatLng) => {
    setNewPosition(latlng);
  };

  const handleSaveStation = () => {
    if (!newInfo.name || !newInfo.address || !newPosition) return;

    const newStation = {
      id: Date.now(),
      name: newInfo.name,
      address: newInfo.address,
      lat: newPosition.lat,
      lng: newPosition.lng,
      deviceCount: 0,
      status: "Hoạt động",
    };

    setStations([...stations, newStation]);
    setIsAdding(false);
    setNewPosition(null);
    setNewInfo({ name: "", address: "" });
  };

  const activeCount = stations.filter((s) => s.status === "Hoạt động").length;
  const maintenanceCount = stations.length - activeCount;

  return (
    <div className="relative max-w-8xl mx-auto h-full w-full overflow-auto scrollbar-hide z-0">
      <CardContent className="h-full w-full p-0">
        <div className="absolute top-4 right-4 z-[1000]">
          <Button
            onClick={handleStartAdd}
            className="flex gap-2 cursor-pointer hover:bg-green-500"
          >
            <Plus size={18} /> Thêm trạm mới
          </Button>
        </div>

        <div className="h-full w-full overflow-hidden">
          <MapContainer
            center={[21.0285, 105.8542]}
            zoom={13}
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <AddMarkerOnClick isAdding={isAdding} onClick={handleMapClick} />

            {isAdding && newPosition && (
              <Marker
                position={[newPosition.lat, newPosition.lng]}
                icon={greenIcon}
              >
                <Popup>
                  <div className="space-y-2 text-sm w-64">
                    <p className="font-bold">Thêm trạm mới</p>
                    <Input
                      placeholder="Tên trạm"
                      value={newInfo.name}
                      onChange={(e) =>
                        setNewInfo({ ...newInfo, name: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Địa chỉ"
                      value={newInfo.address}
                      onChange={(e) =>
                        setNewInfo({ ...newInfo, address: e.target.value })
                      }
                    />
                    <Button className="w-full" onClick={handleSaveStation}>
                      Lưu
                    </Button>
                  </div>
                </Popup>
              </Marker>
            )}

            {stations.map((station) => (
              <Marker
                key={station.id}
                position={[station.lat, station.lng]}
                icon={station.status === "Hoạt động" ? greenIcon : greyIcon}
              >
                <Popup>
                  <div className="text-sm space-y-1 w-40">
                    <p className="font-bold">{station.name}</p>
                    <p>{station.address}</p>
                    <p>Thiết bị: {station.deviceCount}</p>
                    <p>Trạng thái: {station.status}</p>
                    <div className="flex flex-col items-center">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleViewDetails()}
                        className="text-xs px-2 py-1 w-40"
                      >
                        Thông tin chi tiết
                      </Button>
                      <div className="flex gap-2 mt-2 flex-wrap justify-center">
                        <Button size="icon" variant="outline">
                          <Pencil size={16} />
                        </Button>
                        <Button size="icon" variant="destructive">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>

      {/* Drawer chi tiết */}
      <DrawerDetailStation
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Box thống kê góc phải dưới */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white shadow-md rounded-lg p-4 text-sm space-y-2 w-40">
        <p className="font-semibold text-base">Thống kê </p>
        <div className="flex justify-between">
          <span className="text-green-600">Hoạt động</span>
          <span className="font-medium">{activeCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Bảo trì</span>
          <span className="font-medium">{maintenanceCount}</span>
        </div>
        <div
          onClick={() => setOpenModal(true)}
          className="flex justify-between font-semibold text-blue-800 pt-2 border-t mt-2 cursor-pointer "
        >
          <span>Tổng cộng</span>
          <span>{stations.length}</span>
        </div>
      </div>

      <StationListModal
        open={openModal}
        onOpenChange={setOpenModal}
        stations={stations}
        onEdit={(station) => console.log("Edit", station)}
        onDelete={(id) => console.log("Delete", id)}
        onAdd={() => console.log("Add new")}
      />
    </div>
  );
}
