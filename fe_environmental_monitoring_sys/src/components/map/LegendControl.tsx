import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import type { SensorConfigType } from "@/types/types";

const LegendControl: React.FC<{ config : SensorConfigType}> = ({ config }) => {
  const map = useMap();

  useEffect(() => {
    if (!config) return;

    const Legend = L.Control.extend({
      options: { position: "bottomright" },
      onAdd: () => {
        const div = L.DomUtil.create(
          "div",
          "info legend bg-white p-2 rounded shadow text-sm"
        );
        const labels = config.Thresholds.map((thr: number, i: number) => {
          const color = config.Colors[i];
          const desc = config.Descriptions?.[i] || "";
          return `
            <div style="display:flex;align-items:center;margin-bottom:5px;">
              <i style="background:${color};width:18px;height:18px;display:inline-block;margin-right:5px;"></i>
              <span>< ${thr} ${config.Unit} (${desc})</span>
            </div>`;
        });

        div.innerHTML = `<div>${labels.join("")}</div>`;
        return div;
      },
    });

    const legend = new Legend();
    legend.addTo(map);
    return () => {
      legend.remove();
    };
  }, [map, config]);

  return null;
};

export default LegendControl;
