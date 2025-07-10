import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area } from "recharts";

const hourlyData = [
  { time: "6 PM", temp: 30, rain: 0 },
  { time: "7 PM", temp: 29, rain: 1 },
  { time: "8 PM", temp: 28, rain: 3 },
  { time: "9 PM", temp: 28, rain: 5 },
  { time: "10 PM", temp: 27, rain: 4 },
  { time: "11 PM", temp: 27, rain: 2 },
  { time: "12 AM", temp: 27, rain: 1 },
];

export default function WeatherChart() {
  return (
    <div className="h-[300px] bg-white p-4 rounded-lg shadow mt-6">
      <h3 className="text-md font-semibold mb-4 text-gray-800">Biểu đồ nhiệt độ & mưa</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={hourlyData}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="temp" stroke="#1D4ED8" />
          <Area type="monotone" dataKey="rain" fill="#93C5FD" stroke="#3B82F6" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
