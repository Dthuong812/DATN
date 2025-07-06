import Sidebar from "@/components/layout/SideBar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

interface AdminContextType {
  isCollapsed: boolean;
}

export default function AdminPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="h-full flex overflow-hidden ">
      <div className={isCollapsed ? "w-20" : "w-72"}>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>
      <div className="flex-1 px-6 bg-gray-50 overflow-y-auto ">
        <Outlet context={{ isCollapsed } as AdminContextType} />
      </div>
    </div>
  );
}
