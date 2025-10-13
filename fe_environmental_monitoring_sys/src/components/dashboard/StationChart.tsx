import { BarChart3, Grid3X3 } from "lucide-react";
import type { DeviceData, Object } from "@/types/types";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useGetDeviceDatasQuery } from "@/services/devicedata.service";

interface StationChartProps {
  object: Object | null;
}

export default function StationChart({ object }: StationChartProps) {
  const [dataPoints, setDataPoints] = useState<DeviceData[]>([]); 
  const [, setSocket] = useState<Socket | null>(null);
  const navigate = useNavigate();

  const { data: apiResponse} = useGetDeviceDatasQuery(
    {
      Object_Code: object?.Code || "",
      page: 1,
      pageSize: 20, 
    },
    { skip: !object }
  );

  useEffect(() => {
    if (apiResponse?.Data?.data && Array.isArray(apiResponse.Data.data)) {
      setDataPoints(apiResponse.Data.data.slice(0, 20));
    }
  }, [apiResponse]);

  useEffect(() => {
    if (!object) return;

    const s: Socket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    setSocket(s);

    s.emit("subscribeDeviceData", { Object_Code: object.Code });

    s.on("deviceDataUpdate", (data: DeviceData | DeviceData[]) => {
      if (Array.isArray(data)) {
        const latestRecords = data.filter(
          (record) => record.Object_Code === object.Code
        );
        setDataPoints((prev) => {
          const updatedData = [...latestRecords, ...prev].slice(0, 20).reverse(); 
          return updatedData;
        });
      } else {
        if (data.Object_Code === object.Code) {
          setDataPoints((prev) => {
            const updatedData = [data, ...prev].slice(0, 20).reverse(); 
            return updatedData;
          });
        }
      }
    });

    s.on("disconnect", () => {
      console.warn("Disconnected. Retrying...");
    });

    s.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    return () => {
      s.disconnect();
    };
  }, [object]);

  const handleNavigate = () => {
    if (object) {
      navigate(`/admin/realtime/?Object_Code=${object.Code}&page=1`); 
    }
  };

  return (
    <div className="border rounded-xl p-4 space-y-3 h-full bg-white shadow">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold flex items-center gap-2 text-lg">
          <BarChart3 className="w-5 h-5" />
          Dữ liệu thời gian thực – {object ? object.Name : "Chưa chọn trạm"}
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <Button
            className="flex items-center gap-1 bg-green-700 text-white px-2 py-1 rounded-md text-xs w-20 h-7 hover:bg-green-700 cursor-pointer"
            onClick={handleNavigate}
          >
            <Grid3X3 className="w-2 h-2" /> Chi tiết
          </Button>
        </div>
      </div>

      <div className="h-130 flex items-center justify-center text-muted-foreground text-sm italic my-4">
        {object ? (
          <div className="w-full md:min-w-[700px] h-full border rounded-md bg-white shadow mt-4 p-4">
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={dataPoints}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="Times"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  }
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="DataJson.temperature"
                  name="Nhiệt độ"
                  stroke="#f87171"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="DataJson.humidity"
                  name="Độ ẩm"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="DataJson.iaq"
                  name="Chỉ số chất lượng không khí"
                  stroke="#86efac"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="DataJson.pressure"
                  name="Áp suất "
                  stroke="#71e6f8"
                  strokeWidth={2}
                  dot={false}
                />
                {/* <Line
                  type="monotone"
                  dataKey="DataJson.distance"
                  name="Mức ngập"
                  stroke="#910ee9"
                  strokeWidth={2}
                  dot={false}
                /> */}
                <Line
                  type="monotone"
                  dataKey="DataJson.sound_level"
                  name="Độ ồn"
                  stroke="#ef86ba"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="DataJson.co2"
                  name="CO2"
                  stroke="#405040"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="DataJson.voc"
                  name="Khí VOC"
                  stroke="#444eac"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          "Vui lòng chọn trạm để xem dữ liệu"
        )}
      </div>

      <div className="text-xs text-center text-muted-foreground pt-3">
        Dữ liệu được cập nhật tự động mỗi 5 giây • Hiển thị 20 điểm dữ liệu gần
        nhất
      </div>
    </div>
  );
}
