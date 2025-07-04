import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  {
    time: "23:41",
    temperature: 35,
    humidity: 50,
    pm25: 5,
    aqi: 85,
  },
  {
    time: "23:42",
    temperature: 35,
    humidity: 51,
    pm25: 3,
    aqi: 82,
  },
  {
    time: "23:43",
    temperature: 35,
    humidity: 52,
    pm25: 4,
    aqi: 78,
  },
  {
    time: "23:44",
    temperature: 35,
    humidity: 53,
    pm25: 2,
    aqi: 75,
  },
  {
    time: "23:45",
    temperature: 35,
    humidity: 54,
    pm25: 3,
    aqi: 80,
  },
  {
    time: "23:41",
    temperature: 35,
    humidity: 50,
    pm25: 5,
    aqi: 85,
  },
  {
    time: "23:42",
    temperature: 35,
    humidity: 51,
    pm25: 3,
    aqi: 82,
  },
  {
    time: "23:43",
    temperature: 35,
    humidity: 52,
    pm25: 4,
    aqi: 78,
  },
  {
    time: "23:44",
    temperature: 35,
    humidity: 53,
    pm25: 2,
    aqi: 75,
  },
  {
    time: "23:45",
    temperature: 35,
    humidity: 54,
    pm25: 3,
    aqi: 80,
  },
  {
    time: "23:41",
    temperature: 35,
    humidity: 50,
    pm25: 5,
    aqi: 85,
  },
  {
    time: "23:42",
    temperature: 35,
    humidity: 51,
    pm25: 3,
    aqi: 82,
  },
  {
    time: "23:43",
    temperature: 35,
    humidity: 52,
    pm25: 4,
    aqi: 78,
  },
  {
    time: "23:44",
    temperature: 35,
    humidity: 53,
    pm25: 2,
    aqi: 75,
  },
  {
    time: "23:45",
    temperature: 35,
    humidity: 54,
    pm25: 3,
    aqi: 80,
  },
  {
    time: "23:41",
    temperature: 35,
    humidity: 50,
    pm25: 5,
    aqi: 85,
  },
  {
    time: "23:42",
    temperature: 35,
    humidity: 51,
    pm25: 3,
    aqi: 82,
  },
  {
    time: "23:43",
    temperature: 35,
    humidity: 52,
    pm25: 4,
    aqi: 78,
  },
  {
    time: "23:44",
    temperature: 35,
    humidity: 53,
    pm25: 2,
    aqi: 75,
  },
  {
    time: "23:45",
    temperature: 35,
    humidity: 54,
    pm25: 3,
    aqi: 80,
  },
  {
    time: "23:41",
    temperature: 35,
    humidity: 50,
    pm25: 5,
    aqi: 85,
  },
  {
    time: "23:42",
    temperature: 35,
    humidity: 51,
    pm25: 3,
    aqi: 82,
  },
  {
    time: "23:43",
    temperature: 35,
    humidity: 52,
    pm25: 4,
    aqi: 78,
  },
  {
    time: "23:44",
    temperature: 35,
    humidity: 53,
    pm25: 2,
    aqi: 75,
  },
  {
    time: "23:45",
    temperature: 35,
    humidity: 54,
    pm25: 3,
    aqi: 80,
  },
];

export default function SensorChart() {
  return (
    <div className="w-full md:min-w-[700px] h-full border rounded-md bg-white shadow mt-4 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="temperature"
            name="Nhiệt độ"
            stroke="#f87171"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="humidity"
            name="Độ ẩm"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="pm25"
            name="Bụi mịn PM2.5"
            stroke="#38bdf8"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="aqi"
            name="Chỉ số chất lượng không khí"
            stroke="#86efac"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
