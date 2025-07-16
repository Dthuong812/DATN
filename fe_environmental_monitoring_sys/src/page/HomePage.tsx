import HomeMap from "@/components/HomeMap";
import WeatherChart from "@/components/WeatherChart";
import WeatherCurrent from "@/components/WeatherCurrent";
import WeatherDaily from "@/components/WeatherDaily";

export default function HomePage() {
  return (
    <div className="flex flex-col h-full overflow-auto scrollbar-hide px-6 py-8">
      <div className="w-full flex flex-row h-[500px]  justify-between items-start gap-4 ">
      <div className=" w-full flex flex-col justify-between ">
      <WeatherCurrent />
      <WeatherDaily />
      </div>
      <HomeMap/>
      </div>

      <WeatherChart />
    </div>
  );
}
