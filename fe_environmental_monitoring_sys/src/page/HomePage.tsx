import HomeMap from "@/components/HomeMap";
import WeatherChart from "@/components/WeatherChart";
import WeatherCurrent from "@/components/WeatherCurrent";
import WeatherDaily from "@/components/WeatherDaily";

export default function HomePage() {
  return (
    <div className="max-w-8xl mx-auto px-4 py-8">
      <div className="w-full flex flex-row h-[500px]  justify-between items-start gap-4">
      <div className=" w-full flex flex-col justify-between">
      <WeatherCurrent />
      <WeatherDaily />
      </div>
      <HomeMap/>
      </div>

      <WeatherChart />
    </div>
  );
}
