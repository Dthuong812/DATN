import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { Station } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface DrawerDetailStationProps {
  open: boolean;
  onClose: () => void;
  station: Station | null;
}

export function DrawerDetailStation({
  open,
  onClose,
  station,
}: DrawerDetailStationProps) {
  if (!station) return null;

  const position: [number, number] = [station.Lat, station.Lng];

  return (
    <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full md:min-w-[700px] h-full rounded-none mt-[60px]"
      >
        <SheetHeader className="flex flex-row justify-between items-start">
          <div>
            <SheetTitle className="text-xl font-bold">{station.Name}</SheetTitle>
            <p className="text-muted-foreground text-sm">{station.Address}</p>
            <Badge variant={station.Status === 1 ? "default" : "destructive"} className="mt-2 bg-green-600">
            {station.Status === 1 ? "Hoạt động" : "Không hoạt động"}
          </Badge>
          </div>
        </SheetHeader>

        <div className="h-56 rounded-md overflow-hidden mx-4 mt-[-20px]">
          <MapContainer
            center={position}
            zoom={15}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <Marker position={position}
              icon={greenIcon}>
              <Popup>{station.Name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </SheetContent>
    </Sheet>
  );
}
