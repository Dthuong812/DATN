import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import type { DeviceData } from "@/types/types";

interface Props {
  deviceDatas: DeviceData[];
}

export default function DeviceDataChart({ deviceDatas }: Props) {
  const groupedData = deviceDatas.reduce((acc, data) => {
    const deviceCode = data.Devices_Code;
    if (!acc[deviceCode]) {
      acc[deviceCode] = [];
    }
    acc[deviceCode].push({
      time: new Date(data.Times).toLocaleTimeString(),
      temperature: data.DataJson?.temperature ?? null,
      humidity: data.DataJson?.humidity ?? null,
      pressure: data.DataJson?.pressure ?? null,
      iqa: data.DataJson?.iqa ?? null,
      sound_level: data.DataJson?.sound_level ?? null,
      voc: data.DataJson?.voc ?? 0,
      co2: data.DataJson?.co2 ?? null,
    });
    return acc;
  }, {} as Record<string, { time: string; temperature: number | null; humidity: number | null; pressure: number | null; iqa: number | null; sound_level: number | null;voc:number;co2:number | null }[]>);

  return (
    <div className="grid 2xl:grid-cols-2 3xl:grid-cols-3 gap-4 mx-6">
      {Object.keys(groupedData).map((deviceCode) => (
        <div key={deviceCode} className="border rounded-lg p-4 shadow">
          <h4 className="text-center text-lg font-semibold mb-4">Thiết bị: {deviceCode}</h4>
          <LineChart
            width={400}
            height={300}
            data={groupedData[deviceCode].reverse().slice(-10)}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Nhiệt độ (°C)" />
            <Line type="monotone" dataKey="humidity" stroke="#82ca9d" name="Độ ẩm (%)" />
            <Line type="monotone" dataKey="pressure" stroke="#ffc658" name="Áp suất (hPa)" />
            <Line type="monotone" dataKey="iaq" stroke="#58ff98" name="IAQ" />
            <Line type="monotone" dataKey="sound_level" stroke="#c760d4" name="Độ ồn (DB)" />
            <Line type="monotone" dataKey="co2" stroke="#c760d4" name="CO2" />
            <Line type="monotone" dataKey="voc" stroke="#c760d4" name="VOC" />
            {/* <Line type="monotone" dataKey="distance" stroke="#ff9258" name="Độ ồn (dB)" /> */}
          </LineChart>
        </div>
      ))}
    </div>
  );
}