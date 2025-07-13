import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Thermometer } from "lucide-react";

const weatherData = [
  { device: "Nhiệt độ", icon: <Thermometer />, key: "temperature", unit: "°C" },
  { device: "Độ ẩm", icon: <Thermometer />, key: "humidity", unit: "%" },
  { device: "Áp suất", icon: <Thermometer />, key: "pressure", unit: "hPa" },
  { device: "VOC", icon: <Thermometer />, key: "voc", unit: "ppm" },
  { device: "CO2", icon: <Thermometer />, key: "co2", unit: "ppm" },
  { device: "AQI", icon: <Thermometer />, key: "aqi", unit: "" },
  { device: "Bụi mịn", icon: <Thermometer />, key: "pm25", unit: "µg/m³" },
  { device: "Mực nước", icon: <Thermometer />, key: "water", unit: "cm" },
  { device: "Tiếng ồn (dB)", icon: <Thermometer />, key: "noise", unit: "dB" },
];

const chartData = [
  {
    time: "6 PM",
    temperature: 30,
    humidity: 70,
    pressure: 1012,
    voc: 180,
    co2: 400,
    aqi: 75,
    pm25: 55,
    water: 130,
    noise: 60,
  },
  {
    time: "7 PM",
    temperature: 29,
    humidity: 72,
    pressure: 1011,
    voc: 190,
    co2: 420,
    aqi: 78,
    pm25: 52,
    water: 132,
    noise: 62,
  },
  {
    time: "8 PM",
    temperature: 28,
    humidity: 75,
    pressure: 1010,
    voc: 200,
    co2: 430,
    aqi: 80,
    pm25: 58,
    water: 134,
    noise: 64,
  },
  {
    time: "9 PM",
    temperature: 28,
    humidity: 76,
    pressure: 1010,
    voc: 210,
    co2: 440,
    aqi: 82,
    pm25: 60,
    water: 135,
    noise: 65,
  },
  {
    time: "10 PM",
    temperature: 27,
    humidity: 77,
    pressure: 1009,
    voc: 215,
    co2: 450,
    aqi: 84,
    pm25: 59,
    water: 135,
    noise: 66,
  },
];

export default function WeatherChartTabs() {
  const [selected, setSelected] = useState("temperature");

  return (
    <div className="w-full space-y-4 border rounded-lg bg-white p-4 shadow-lg mt-5">
      <Tabs
        value={selected}
        onValueChange={setSelected}
        className="space-y-4 "
      >
        <TabsList className="w-full p-0 bg-background justify-start border-b rounded-none h-[78px]">
          {weatherData.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className="rounded-none bg-background h-full data-[state=active]:shadow-none border border-transparent border-b-border data-[state=active]:border-border data-[state=active]:border-b-background -mb-[2px] rounded-t"
            >
              <code className="text-[13px] flex flex-col items-center justify-center h-full">
                <div className="font-medium text-[16px]">{tab.device}</div>
                <div className="text-xl">{tab.icon}</div>
                <div
                  className={`font-bold ${
                    typeof chartData[0][
                      tab.key as keyof (typeof chartData)[0]
                    ] === "number" &&
                    Number(
                      chartData[0][tab.key as keyof (typeof chartData)[0]]
                    ) < 50
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {chartData[0][tab.key as keyof (typeof chartData)[0]]}{" "}
                  {tab.unit}
                </div>
              </code>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent
          value={selected}
          className="h-full mt-[-24px] border-x-1 border-b-1"
        >
          <Card className="border-none shadow-none h-[500px] px-4 pl-4 pr-8">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md">
                {weatherData.find((item) => item.key === selected)?.device}
              </CardTitle>
              <Select defaultValue="hour">
                <SelectTrigger className="w-[100px] h-8 text-xs">
                  <SelectValue placeholder="Thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hour">Giờ</SelectItem>
                  <SelectItem value="day">Ngày</SelectItem>
                  <SelectItem value="week">Tuần</SelectItem>
                  <SelectItem value="month">Tháng</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="h-[85%] px-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey={selected}
                    stroke="#2563EB"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey={selected}
                    fill="#BFDBFE"
                    stroke="#3B82F6"
                    opacity={0.3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
