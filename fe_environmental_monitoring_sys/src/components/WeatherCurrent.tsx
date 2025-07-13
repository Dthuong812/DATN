import { Card, CardContent } from "@/components/ui/card"
import { CloudRain, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function WeatherCurrent() {
  return (
    <Card className="bg-gradient-to-br from-blue-300 to-blue-700 rounded-xl shadow-md border-none">
      <CardContent className="p-6 space-y-4 text-white">
        <div className="relative">
          <Search className="absolute left-3 top-2 text-blue-900 w-5 h-5" />
          <Input
            type="text"
            placeholder="Tìm kiếm địa điểm..."
            className="pl-10 pr-4 py-2 bg-white text-gray-800 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold text-white">30°C</h2>
            <p className="text-white/80">Mưa nhẹ • Cảm giác như 32°C</p>
            <p className="text-sm text-white/70 mt-2">
              Dự báo có giông lớn. Nhiệt độ thấp nhất: 27°C
            </p>
          </div>
          <CloudRain className="w-16 h-16 text-white" />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-sm">
          {[
            { label: "Air quality", value: "103", className: "text-orange-400" },
            { label: "Wind", value: "9 km/h" },
            { label: "Humidity", value: "75%" },
            { label: "Visibility", value: "10 km" },
            { label: "Pressure", value: "997 mb" },
            { label: "Dew point", value: "25°" },
          ].map((item, idx) => (
            <div key={idx}>
              <p className="text-white/80">{item.label}</p>
              <p className={`font-semibold ${item.className ?? "text-white"}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  )
}
