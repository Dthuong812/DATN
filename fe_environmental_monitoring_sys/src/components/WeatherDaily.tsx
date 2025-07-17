import { Card, CardContent } from "@/components/ui/card"

const forecast = [
  { day: "Hôm nay", icon: "🌦️", high: 33, low: 27, air: 103, wind: 9, humidity: 75, visibility: 10, pressure: 997 },
  { day: "Thứ 6", icon: "🌧️", high: 31, low: 26, air: 103, wind: 9, humidity: 75, visibility: 10, pressure: 997 },
  { day: "Thứ 7", icon: "🌩️", high: 31, low: 26, air: 103, wind: 9, humidity: 75, visibility: 10, pressure: 997 },
  { day: "CN", icon: "⛅", high: 32, low: 27, air: 103, wind: 9, humidity: 75, visibility: 10, pressure: 997 },
  { day: "Thứ 2", icon: "☀️", high: 34, low: 28, air: 103, wind: 9, humidity: 75, visibility: 10, pressure: 997 },
  { day: "Thứ 3", icon: "🌩️", high: 31, low: 26, air: 103, wind: 9, humidity: 75, visibility: 10, pressure: 997 },
  { day: "Thứ 4", icon: "⛅", high: 32, low: 27, air: 103, wind: 9, humidity: 75, visibility: 10, pressure: 997 },
]

export default function WeatherDaily() {
  return (
    <div className="flex overflow-x-auto gap-4 px-1 pt-2 pb-2 w-full">
      {forecast.map((item, i) => (
        <Card
          key={i}
          className="min-w-[120px] bg-white shadow-sm rounded-xl text-center py-2"
        >
          <CardContent className="space-y-1">
            <p className="text-sm text-gray-600">{item.day}</p>
            <p className="text-2xl">{item.icon}</p>
            <p className="text-sm text-gray-700 font-medium">
              {item.high}° / {item.low}°
            </p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>{item.air} AQI</p>
              <p>{item.wind} km/h</p>
              <p>{item.humidity}%</p>
              <p>{item.visibility} km</p>
              <p>{item.pressure} mb</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
