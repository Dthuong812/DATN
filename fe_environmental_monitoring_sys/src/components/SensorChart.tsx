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



export default function SensorChart( ) {
  const data = [
    { time: "00:00", temperature: 25, humidity: 60, pm25: 35, aqi: 50 },
    { time: "01:00", temperature: 26, humidity: 62, pm25: 40, aqi: 55 },
    { time: "02:00", temperature: 24, humidity: 58, pm25: 30, aqi: 45 },
    { time: "00:00", temperature: 25, humidity: 60, pm25: 35, aqi: 50 },
    { time: "01:00", temperature: 26, humidity: 62, pm25: 40, aqi: 55 },
    { time: "02:00", temperature: 24, humidity: 58, pm25: 30, aqi: 45 },
    { time: "00:00", temperature: 25, humidity: 60, pm25: 35, aqi: 50 },
    { time: "01:00", temperature: 26, humidity: 62, pm25: 40, aqi: 55 },
    { time: "02:00", temperature: 24, humidity: 58, pm25: 30, aqi: 45 },
    { time: "00:00", temperature: 25, humidity: 60, pm25: 35, aqi: 50 },
    { time: "01:00", temperature: 26, humidity: 62, pm25: 40, aqi: 55 },
    { time: "02:00", temperature: 24, humidity: 58, pm25: 30, aqi: 45 },
    { time: "01:00", temperature: 26, humidity: 62, pm25: 40, aqi: 55 },
    { time: "02:00", temperature: 24, humidity: 58, pm25: 30, aqi: 45 },
    { time: "00:00", temperature: 25, humidity: 60, pm25: 35, aqi: 50 },
    { time: "01:00", temperature: 26, humidity: 62, pm25: 40, aqi: 55 },
    { time: "02:00", temperature: 24, humidity: 58, pm25: 30, aqi: 45 },
  ];

  const mockData = data.map((entry) => ({
    ...entry,
    temperature: entry.temperature + Math.random(), 
    humidity: entry.humidity + Math.random(),
    pm25: entry.pm25 + Math.random(),
    aqi: entry.aqi + Math.random(),
  }));

  return (
    <div className="w-full md:min-w-[700px] h-full border rounded-md bg-white shadow mt-4 p-4">
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={mockData}>
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
