import ActivityAlert from "@/components/ActivityAlert";
import EnvironmentOverview from "@/components/EnvironmentOverview";
import InfoCard from "@/components/InfoCard";
import StationDashboard from "@/components/StationDashboard";
import { useOutletContext } from "react-router-dom";

interface AdminContextType {
  isCollapsed: boolean;
}

export default function DashboardPage() {
  useOutletContext<AdminContextType>();
  const alerts = [
    {
      title: "Bụi mịn PM2.5 vượt ngưỡng",
      description:
        "Nồng độ PM2.5 tại trạm Cầu Giấy đã vượt ngưỡng cảnh báo (78 µg/m³)",
      level: "warning" as const,
    },
    {
      title: "Chỉ số AQI ở mức không lành mạnh",
      description:
        "AQI tại trạm Cầu Giấy đạt 112, không lành mạnh cho nhóm nhạy cảm",
      level: "danger" as const,
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-auto scrollbar-hide">
      <InfoCard isCollapsed={false} />
      <div className="py-4">
        <ActivityAlert alerts={alerts} />
      </div>
      <div className="space-y-4 py-4">
        <EnvironmentOverview />
      </div>
      <StationDashboard />
    </div>
  );
}
