import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { Device } from "@/types/types";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface MapDrawProps {
  data: Device[];
  open: boolean;
  onClose: () => void;
}

const createCustomIcon = (iconUrl: string) =>
  new L.Icon({
    iconUrl : "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

const createClusterCustomIcon = (cluster: any) => {
  return new L.DivIcon({
    html: `<div class="flex items-center justify-center rounded-full bg-blue-500 text-white text-sm font-bold" 
                style="width: 40px; height: 40px;">
                ${cluster.getChildCount()}
             </div>`,
    className: "cluster-marker",
    iconSize: L.point(40, 40, true),
  });
};

export default function MapDraw({ data, open, onClose }: MapDrawProps) {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    if (data) {
      setDevices(data);
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

          <MarkerClusterGroup
            iconCreateFunction={createClusterCustomIcon} 
            showCoverageOnHover={false} 
            spiderfyOnEveryZoom={true} 
          >
            {devices.map((device) =>
              device.Latitude && device.Longitude ? (
                <Marker
                  key={device.Id}
                  position={[device.Latitude, device.Longitude]}
                  icon={createCustomIcon(
                    String(device.Icon_Id || "default-icon.png")
                  )}
                >
                  <Tooltip>
                    <div className="text-sm">
                      <p>
                        <b>{device.Name}</b>
                      </p>
                      <p>Mã: {device.Code}</p>
                      <p>Loại thiết bị: {device.DeviceType_Code}</p>
                      <p>Mã đối tượng: {device.Object_Code}</p>
                    </div>
                  </Tooltip>
                </Marker>
              ) : null
            )}
          </MarkerClusterGroup>
        </MapContainer>
      </DrawerContent>
    </Drawer>
  );
}
