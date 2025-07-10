import { Card, CardContent } from "@/components/ui/card";
import { CloudRain, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function WeatherCurrent() {
  return (
    <div className="w-full space-y-4">
     
      <Card className="bg-gradient-to-br from-blue-300 to-blue-700 p-6 rounded-lg shadow w-full h-[300px]">
      <div className="relative w-full mx-auto">
        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Tìm kiếm địa điểm..."
          className="pl-10 pr-4 py-2 border rounded-md shadow-sm"
        />
      </div>
        <CardContent className="flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold text-blue-800">30°C</h2>
              <p className="text-gray-700">Mưa nhẹ • Cảm giác như 32°C</p>
              <p className="text-sm text-gray-600 mt-2">
                Dự báo có giông lớn. Nhiệt độ thấp nhất: 27°C
              </p>
            </div>
            <CloudRain className="w-16 h-16 text-blue-600" />
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-white text-sm">
            <div>
              <p className="text-gray-200">Air quality</p>
              <p className="font-semibold text-orange-400">103</p>
            </div>
            <div>
              <p className="text-gray-200">Wind</p>
              <p className="font-semibold">9 km/h</p>
            </div>
            <div>
              <p className="text-gray-200">Humidity</p>
              <p className="font-semibold">75%</p>
            </div>
            <div>
              <p className="text-gray-200">Visibility</p>
              <p className="font-semibold">10 km</p>
            </div>
            <div>
              <p className="text-gray-200">Pressure</p>
              <p className="font-semibold">997 mb</p>
            </div>
            <div>
              <p className="text-gray-200">Dew point</p>
              <p className="font-semibold">25°</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
