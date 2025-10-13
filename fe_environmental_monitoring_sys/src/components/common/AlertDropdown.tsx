import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { Bell, AlertTriangle, Info, Trash2,} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGetAlertsQuery,
  useMarkAlertAsReadMutation,
//   useMarkAllAlertsAsReadMutation,
  useDeleteAlertMutation,
} from "@/services/alert.service";
import type { Alert } from "@/types/types";
import { toast } from "sonner";

export default function AlertDropdown() {
  const { data: alertList, isLoading, refetch } = useGetAlertsQuery({
  });
  const alertData= alertList?.Data;
  const [markAsRead] = useMarkAlertAsReadMutation();
//   const [markAllAsRead] = useMarkAllAlertsAsReadMutation();
  const [deleteAlert] = useDeleteAlertMutation();

  const alerts = [...(alertData || [])].reverse();
  const unreadCount = alerts.filter((alert: Alert) => !alert.IsRead).length;

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3000", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("alert:new", (newAlerts) => {
      console.log("Có cảnh báo mới:", newAlerts);
      toast.warning("Có cảnh báo môi trường mới ");
      refetch();
    });

    return () => {
      socket.disconnect();
    };
  }, [refetch]);

  const handleMarkAsRead = async (alertId: number) => {
    try {
      await markAsRead(alertId).unwrap();
      toast.success("Đã đánh dấu đã đọc");
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

//   const handleMarkAllAsRead = async () => {
//     try {
//       await markAllAsRead({ }).unwrap();
//       toast.success("Đã đánh dấu tất cả đã đọc");
//       refetch();
//     } catch {
//       toast.error("Có lỗi xảy ra");
//     }
//   };

  const handleDeleteAlert = async (alertId: number) => {
    try {
      await deleteAlert(alertId).unwrap();
      toast.success("Đã xóa thông báo");
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case "Nguy hiểm":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "Cảnh báo":
        return <Info className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAlertBadgeVariant = (level: string) => {
    switch (level) {
      case "Nguy hiểm":
        return "destructive";
      case "Cảnh báo":
        return "secondary";
      default:
        return "default";
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative focus:outline-none z-10">
        <Bell className="h-6 w-6 text-gray-600 hover:text-green-600 cursor-pointer" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-96 bg-white shadow-lg rounded-lg p-2 mr-4 my-4 z-100000">
        <div className="flex items-center justify-between px-2 py-1">
          <DropdownMenuLabel className="font-semibold text-gray-700">
            Thông báo cảnh báo ({unreadCount})
          </DropdownMenuLabel>
          {/* {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-6 px-2 text-xs hover:bg-gray-100"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Đánh dấu tất cả
            </Button>
          )} */}
        </div>
        
        <DropdownMenuSeparator />
        
        <ScrollArea className="h-80">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-gray-500">
              Đang tải...
            </div>
          ) : alerts.length > 0 ? (
            alerts.map((alert: Alert) => (
              <DropdownMenuItem
                key={alert.Id}
                className={`flex flex-col items-start p-3 hover:bg-gray-50 rounded-md cursor-pointer border-b border-gray-100 ${
                  !alert.IsRead ? "bg-blue-50" : ""
                }`}
                onClick={() => !alert.IsRead && handleMarkAsRead(alert.Id)}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-start gap-2 flex-1">
                    {getAlertIcon(alert.Level)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={getAlertBadgeVariant(alert.Level)}
                          className="text-xs"
                        >
                          {alert.Level}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {alert.Object_Name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 line-clamp-2">
                        {alert.Message}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {formatTime(alert.CreatedAt)}
                        </span>
                        <span className="text-xs font-medium text-red-500">
                          {alert.Value} {alert.Unit}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAlert(alert.Id);
                    }}
                    className="h-6 w-6 p-0 ml-2 hover:bg-red-100 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              Không có thông báo cảnh báo nào
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}