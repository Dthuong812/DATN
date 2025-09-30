import DeviceDataTable from "@/components/devicedata/DeviceDataTable";
import DeviceDataChart from "@/components/devicedata/DeviceDataChart";
import { useGetDeviceDatasQuery } from "@/services/devicedata.service";
import type { DeviceData } from "@/types/types";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ChartSpline, ScrollText, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RealTimePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    Devices_Code: searchParams.get("Devices_Code") || "",
    Object_Code: searchParams.get("Object_Code") || "",
    Project_Code: searchParams.get("Project_Code") || "",
    DataType: searchParams.get("DataType") || "1", 
  });
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  const { data: apiResponse, isFetching: apiFetching } = useGetDeviceDatasQuery(
    {
      ...filters,
      page,
      pageSize,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [deviceDatas, setDeviceDatas] = useState<DeviceData[]>([]);
  const [viewMode, setViewMode] = useState<"chart" | "table">("table");
  const [totalRecords, setTotalRecords] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (apiResponse?.Data?.data && Array.isArray(apiResponse.Data.data)) {
      setDeviceDatas(apiResponse.Data.data);
      setTotalRecords(apiResponse.Data.total || 0);
    } else {
      setDeviceDatas([]);
      setTotalRecords(0);
    }
  }, [apiResponse]);

  useEffect(() => {
    if (filters.DataType === "1") {
      // Chỉ thiết lập WebSocket khi DataType = 1
      const s: Socket = io(import.meta.env.VITE_SOCKET_URL, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });
      setSocket(s);

      s.on("disconnect", () => {
        console.warn("Disconnected. Retrying...");
      });

      s.on("connect_error", (err) => {
        console.error("Connection error:", err.message);
      });

      return () => {
        s.disconnect();
      };
    } else {
      // Nếu DataType != 1, ngắt kết nối WebSocket
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [filters.DataType]);

  useEffect(() => {
    if (socket && filters.DataType === "1") {
      socket.emit("subscribeDeviceData", filters);
    }
  }, [socket, filters]);

  useEffect(() => {
    if (!socket || filters.DataType !== "1") return;

    socket.on("deviceDataUpdate", (data: DeviceData | DeviceData[]) => {
      const newDataArr = Array.isArray(data) ? data : [data];

      setDeviceDatas((prev) => {
        if (page === 1) {
          return [...newDataArr, ...prev].slice(0, pageSize);
        }
        return prev;
      });

      if (page === 1) {
        setTotalRecords((prev) => prev + newDataArr.length);
      }
    });

    return () => {
      socket.off("deviceDataUpdate");
    };
  }, [socket, filters.DataType, page, pageSize]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set(key, value);
    } else {
      newSearchParams.delete(key);
    }
    newSearchParams.set("page", "1");
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    setFilters({
      Devices_Code: "",
      Object_Code: "",
      Project_Code: "",
      DataType: "1", // Reset DataType về mặc định là 1
    });
    setSearchParams({ page: "1", pageSize: pageSize.toString() });
  };

  const handlePageChange = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", newPage.toString());
    setSearchParams(newSearchParams);
  };

  const handlePageSizeChange = (newSize: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("pageSize", newSize);
    newSearchParams.set("page", "1");
    setSearchParams(newSearchParams);
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="max-w-8xl mx-auto pt-8 pb-6">
      <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm mx-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label className="mb-1 block text-sm font-medium text-gray-600">
                Mã thiết bị
              </Label>
              <Input
                type="text"
                value={filters.Devices_Code}
                onChange={(e) => handleFilterChange("Devices_Code", e.target.value)}
                placeholder="Nhập mã thiết bị"
                className="w-full border-none bg-gray-50 px-3 py-2 text-sm shadow-sm 
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
            <div>
              <Label className="mb-1 block text-sm font-medium text-gray-600">
                Mã đối tượng
              </Label>
              <Input
                type="text"
                value={filters.Object_Code}
                onChange={(e) => handleFilterChange("Object_Code", e.target.value)}
                placeholder="Nhập mã đối tượng"
                className="w-full border-none bg-gray-50 px-3 py-2 text-sm shadow-sm 
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
            <div>
              <Label className="mb-1 block text-sm font-medium text-gray-600">
                Mã dự án
              </Label>
              <Input
                type="text"
                value={filters.Project_Code}
                onChange={(e) => handleFilterChange("Project_Code", e.target.value)}
                placeholder="Nhập mã dự án"
                className="w-full border-none bg-gray-50 px-3 py-2 text-sm shadow-sm 
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
            <div>
              <Label className="mb-1 block text-sm font-medium text-gray-600">
                Loại dữ liệu (DataType)
              </Label>
              <select
                value={filters.DataType}
                onChange={(e) => handleFilterChange("DataType", e.target.value)}
                className="w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-gray-50 focus:ring-2 focus:ring-gray-50 cursor-pointer"
              >
                <option value="1">5 giây</option>
                <option value="2">1 giờ</option>
                <option value="3">1 ngày</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              className={`px-4 py-2 mx-2 rounded ${
                viewMode === "chart"
                  ? "bg-green-800 hover:bg-green-700 cursor-pointer text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
              }`}
              onClick={() => setViewMode("chart")}
            >
              <ChartSpline /> Xem dạng biểu đồ
            </Button>
            <Button
              className={`px-4 py-2 rounded-md ${
                viewMode === "table"
                  ? "bg-green-800 hover:bg-green-700 cursor-pointer text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
              }`}
              onClick={() => setViewMode("table")}
            >
              <ScrollText /> Xem dạng bảng
            </Button>
            <Button
              onClick={clearFilters}
              className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            >
              <X /> Xóa bộ lọc
            </Button>
          </div>
        </div>
      </div>
      {viewMode === "table" ? (
        <div className="!h-[600px]">
          <DeviceDataTable
            deviceDatas={deviceDatas}
            isFetching={apiFetching && deviceDatas.length === 0}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      ) : (
        <DeviceDataChart deviceDatas={deviceDatas} />
      )}
    </div>
  );
}
