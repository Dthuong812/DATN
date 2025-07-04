import StationList from "./StationList";
import StationDetail from "./StationDetail";
import StationChart from "./StationChart";


export default function StationDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-4">
      <div className="col-span-1 space-y-4">
        <StationList />
        <StationDetail />
      </div>
      <div className="lg:col-span-2">
       <StationChart />
      </div>
    </div>
  );
}
