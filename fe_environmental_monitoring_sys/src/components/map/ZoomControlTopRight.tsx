import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const ZoomControlTopRight: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    const zoomControl = L.control.zoom({ position: "topright" });
    zoomControl.addTo(map);
    return () => {
      map.removeControl(zoomControl);
    };
  }, [map]);
  return null;
};

export default ZoomControlTopRight;
