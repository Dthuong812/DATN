import StationDashboard from "@/components/dashboard/StationDashboard";
import { useOutletContext } from "react-router-dom";

interface AdminContextType {
  isCollapsed: boolean;
}

export default function DashboardPage() {
  useOutletContext<AdminContextType>();

  return (
    <div className="flex flex-col h-full overflow-auto scrollbar-hide px-6 mt-6">
      <StationDashboard />
    </div>
  );
}
