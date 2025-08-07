import type { Location, Station } from "@/types/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import "leaflet/dist/leaflet.css";
import TableDetailStation from "./TableDetailStation";
import { useGetLocationByIdQuery } from "@/services/location.service";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
interface DrawerDetailLocationProps {
  open: boolean;
  onClose: () => void;
  location: Location | null;
}

export function DrawerDetailLocation({
  open,
  onClose,
  location,
}: DrawerDetailLocationProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const locationId = location?.Id;
  const { data, isLoading } = useGetLocationByIdQuery(locationId, {
    skip: !location?.Id,
  });

  if (!location) return null;
  const stations = data?.Data?.Stations ?? [];

  const greenIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  const handleStationClick = (lat: number, lng: number) => {
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], 15);
    }
  };
  return (
    <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full md:min-w-[700px] h-full rounded-none mt-[60px] px-5"
      >
        <SheetHeader className="flex flex-row justify-between items-start">
          <div>
            <SheetTitle className="text-xl font-bold ml-[-10px]">
              {location.Name}
            </SheetTitle>
          </div>
        </SheetHeader>
        <div className="h-60 rounded-md overflow-hidden mt-[-20px]">
          {stations.length > 0 ? (
            <MapContainer
              center={[stations[0].Lat, stations[0].Lng]}
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
              ref={mapRef}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {stations.map((station: Station) => (
                <Marker
                  key={station.Id}
                  position={[station.Lat, station.Lng]}
                  icon={greenIcon}
                >
                  <Popup>{station.Name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="text-center p-4">Không có trạm nào</div>
          )}
        </div>
        {isLoading ? (
          <p className="text-center p-4">Đang tải trạm...</p>
        ) : (
          <TableDetailStation stations={stations} onStationClick={handleStationClick} />
        )}
      </SheetContent>
    </Sheet>
  );
}
