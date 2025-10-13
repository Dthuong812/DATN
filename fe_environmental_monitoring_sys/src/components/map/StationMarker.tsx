import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { DeviceData, Object, SensorConfigType } from "@/types/types";

interface StationMarkerProps {
  station: DeviceData;
  config: SensorConfigType;
  object?: Object;
  getColor: (value: number) => string;
  getTextColor: (color: string) => string;
}

const StationMarker: React.FC<StationMarkerProps> = ({
  station,
  config,
  object,
  getColor,
  getTextColor,
}) => {
  const value = station.DataJson?.[config.Field] ?? 0;
  const color = getColor(value);
  const textColor = getTextColor(color);

  return (
    <Marker
      position={[station.Latitude, station.Longitude]}
      icon={L.divIcon({
        html: `<div style="
          background:${color};
          border-radius:50%;
          width:40px;
          height:40px;
          display:flex;
          align-items:center;
          justify-content:center;
          color:${textColor};
          font-weight:bold;
          font-size:10px;
          border:2px solid white;
          box-shadow:0 0 5px rgba(0,0,0,0.3);
        ">${value.toFixed(0)}</div>`,
        className: "",
        iconSize: [40, 40],
      })}
    >
      <Popup>
        <b>{object?.Name || station.Object_Code}</b>
        <br />
        Địa chỉ: {object?.Details_Value?.Address || "Không có thông tin"}
        <br />
        {config.Label}: {value.toFixed(2)} {config.Unit}
      </Popup>
    </Marker>
  );
};

export default StationMarker;
