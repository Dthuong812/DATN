// components/InfoCards.tsx

import { CheckCircle, AlertTriangle, GaugeCircle, Activity } from "lucide-react";

interface InfoCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  isCollapsed?: boolean;
}

export default function InfoCard({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const cards: InfoCardProps[] = [
    {
      title: "Trạm hoạt động",
      value: "2/3",
      icon: <CheckCircle className="w-12 h-12" />,
      color: "text-green-500",
      isCollapsed,
    },
    {
      title: "Cảnh báo hoạt động",
      value: "2",
      icon: <AlertTriangle className="w-12 h-12" />,
      color: "text-orange-500",
      isCollapsed,
    },
    {
      title: "AQI trung bình",
      value: "104",
      icon: <GaugeCircle className="w-12 h-12" />,
      color: "text-blue-600",
      isCollapsed,
    },
    {
      title: "Cập nhật cuối",
      value: "22:45:44",
      icon: <Activity className="w-6 h-6" />,
      color: "text-purple-500",
      isCollapsed,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-8xl mx-auto pb-4 pt-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`border rounded-xl p-4 shadow-sm bg-white flex items-center justify-between
            ${isCollapsed 
              ? "w-full md:min-w-[320px] lg:min-w-[336px]" 
              : "w-full md:min-w-[270px] lg:min-w-[284px]"
            }`}
        >
          <div>
            <div className="text-sm text-muted-foreground">{card.title}</div>
            <div className={`text-xl font-semibold ${card.color}`}>{card.value}</div>
          </div>
          <div className={`text-2xl ${card.color}`}>{card.icon}</div>
        </div>
      ))}
    </div>
  );
}
