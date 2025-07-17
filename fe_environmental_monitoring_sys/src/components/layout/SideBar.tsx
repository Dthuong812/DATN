import {
  LayoutDashboard,
  Users,
  Settings,
  HelpCircle,
  UtilityPole,
  ChartCandlestick,
  FilePlus2,
  ScanEye,
  ChartColumnIncreasing,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";


import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";
interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
}
export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const location = useLocation();

  const navItems = [
    { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
    { href: "/admin/realtime", label: "Giám sát", icon: ChartColumnIncreasing },
    { href: "/admin/station", label: "Trạm cảm biến", icon: UtilityPole },
    { href: "/admin/sensors", label: "Thiết bị", icon: ChartCandlestick },
    { href: "/admin/report", label: "Báo cáo", icon: FilePlus2 },
    { href: "/admin/logs", label: "Logs", icon: ScanEye },
    { href: "/admin/user", label: "Người dùng", icon: Users },
  ];

  const bottomNavItems = [
    { href: "/admin/settings", label: "Cài đặt", icon: Settings },
    { href: "/admin/help", label: "Trợ giúp", icon: HelpCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      className={`h-[95vh] border-r flex flex-col z-[100]
          bg-white dark:bg-gray-900 pb-6 fixed shadow-sm
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-20" : "w-72"} px-4`}
    >
      <div
        className={`flex items-center mb-8 px-2 ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        <Button
          onClick={() => setIsCollapsed(!isCollapsed)}
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-4 z-[100] bg-white dark:bg-gray-800 shadow-md border rounded-full w-8 h-8"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <nav className="space-y-2 mb-4 flex-1">
        {navItems.map((item) => (
          <Link to={item.href} key={item.href}>
            <Button
              variant="ghost"
              className={`w-full text-[16px] h-11 transition-all rounded-lg flex  items-center px-4 
                  ${isCollapsed ? "justify-center my-3" : "justify-start my-3"} 
                  ${
                    isActive(item.href)
                      ? "bg-green-100 dark:bg-green-900 font-medium"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }
                `}
            >
              <item.icon
                className={`
                    ${
                      isActive(item.href)
                        ? "text-green-600"
                        : "text-gray-700 dark:text-gray-300 "
                    }
                    ${
                      isCollapsed
                        ? "mx-auto !w-[22px] !h-[22px] "
                        : "mx-3 !w-5 !h-5"
                    }
                  `}
              />
              {!isCollapsed && (
                <span
                  className={`text-[16px] ${
                    isActive(item.href)
                      ? "text-green-600"
                      : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {item.label}
                </span>
              )}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-2 border-t pt-4">
        {bottomNavItems.map((item) => (
          <Link to={item.href} key={item.href}>
            <Button
              variant="ghost"
              className={`w-full justify-start text-[16px] h-11 transition-all rounded-lg
                  ${isCollapsed ? "px-2" : "px-4"} 
                  ${
                    isActive(item.href)
                      ? "bg-green-100 dark:bg-green-900 font-medium"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }
                `}
            >
              <item.icon
                className={`w-5 h-5 
                    ${
                      isActive(item.href)
                        ? "text-green-600"
                        : "text-gray-700 dark:text-gray-300"
                    }
                    ${isCollapsed ? "mx-auto !w-[22px] !h-[22px]" : "mr-3"}
                  `}
              />
              {!isCollapsed && (
                <span
                  className={`text-[16px] ${
                    isActive(item.href)
                      ? "text-green-600"
                      : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {item.label}
                </span>
              )}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
