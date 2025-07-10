const forecast = [
    { day: "Hôm nay", icon: "🌦️", high: 33, low: 27 , air: 103, wind:9 , humidity: 75, visibility: 10, pressure: 997, dewPoint: 25 },
    { day: "Thứ 6", icon: "🌧️", high: 31, low: 26, air: 103, wind:9 , humidity: 75, visibility: 10, pressure: 997, dewPoint: 25  },
    { day: "Thứ 7", icon: "🌩️", high: 31, low: 26  , air: 103, wind:9 , humidity: 75, visibility: 10, pressure: 997, dewPoint: 25 },
    { day: "CN", icon: "⛅", high: 32, low: 27 , air: 103, wind:9 , humidity: 75, visibility: 10, pressure: 997, dewPoint: 25  },
    { day: "Thứ 2", icon: "☀️", high: 34, low: 28 , air: 103, wind:9 , humidity: 75, visibility: 10, pressure: 997, dewPoint: 25  },
    { day: "Thứ 3", icon: "🌩️", high: 31, low: 26 , air: 103, wind:9 , humidity: 75, visibility: 10, pressure: 997, dewPoint: 25  },
    { day: "Thứ 4", icon: "⛅", high: 32, low: 27  , air: 103, wind:9 , humidity: 75, visibility: 10, pressure: 997, dewPoint: 25 },
  ];
  
  export default function WeatherDaily() {
    return (
      <div className="flex overflow-x-auto gap-4 mt-1 px-1 py-3 w-full ">
        {forecast.map((item, i) => (
          <div
            key={i}
            className="w-full md:min-w-[93px] bg-white shadow rounded-md text-center p-2"
          >
            <p className="text-sm text-gray-600">{item.day}</p>
            <p className="text-2xl">{item.icon}</p>
            <p className="text-sm text-gray-700">
              {item.high}° / {item.low}°
            </p>
            <p className="text-sm text-gray-700">
                {item.air} AQI
            </p>
            <p className="text-sm text-gray-700">
                {item.wind} km/h
            </p>
            <p className="text-sm text-gray-700">
                {item.humidity}%
            </p>
            <p className="text-sm text-gray-700">
                {item.visibility} km
            </p>
            <p className="text-sm text-gray-700">
              {item.pressure} mb
            </p>
          </div>
        ))}
      </div>
    );
  }
  