import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { Object } from "@/types/types";
import { Button } from "../ui/button";
import { Wifi, X } from "lucide-react";

interface MapDrawProps {
  data: Object[];
  open: boolean;
  onClose: () => void;
}

const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapDraw({
  data,
  open,
  onClose,
}: MapDrawProps) {
  const [objects, setObjects] = useState<Object[]>([]);

  useEffect(() => {
    if (data) {
      setObjects(data);
    }
  }, [data]);

  return (
    <Drawer open={open} onOpenChange={onClose} direction="right">
      <DrawerContent
        style={{ width: "100vw", maxWidth: "100vw" }}
        className="!w-full max-w-full bg-white z-100000000 m-0 p-0 "
        onInteractOutside={(e) => e.preventDefault()}
      >
        <Button
          onClick={onClose}
          className="fixed top-4 right-4 z-[100000001] text-black bg-white hover:bg-gray-100 border border-gray-200 p-1 shadow-lg cursor-pointer"
          aria-label="Đóng"
        >
          <X size={30} />
        </Button>

        <MapContainer
          center={[21.028511, 105.804817]}
          zoom={13}
          style={{ height: "100vh", width: "100%" }}
          className="m-[-2px] p-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {objects.map((obj) =>
            obj.Latitude && obj.Longitude ? (
              <Marker
                key={obj.Id}
                position={[obj.Latitude, obj.Longitude]}
                icon={customIcon}
              >
                <Tooltip>
                  <div className="text-sm">
                    <p>
                      <b>{obj.Name}</b>
                    </p>
                    <p>Mã: {obj.Code}</p>
                    <p>Công ty: {obj.Organization_Code}</p>
                    <p>Dự án: {obj.Project_Code}</p>
                    <p>
                      Trạng thái:{" "}
                      {obj.Status === 1
                        ? "Hoạt động"
                        : obj.Status === 2
                        ? "Không hoạt động"
                        : "Bảo trì"}
                    </p>
                    <p><Wifi/>Kết nối: {obj.Details_Value?.Connection_Type || "N/A"}</p>
                    <p>Địa chỉ: {obj.Details_Value?.Address || "N/A"}</p>
                  </div>
                </Tooltip>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </DrawerContent>
    </Drawer>
  );
}
