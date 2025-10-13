import type { DeviceDataReport } from "@/types/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function TableReport({
  data,
}: {
  data: [];
}) {
    console.log(data)
  return (
    <div className=" w-4/5 mt-[-20px]">
      <div className="flex-1 overflow-auto h-full scrollbar-hide bg-white shadow p-4 border-none">
        <Table className="h-full overflow-auto scrollbar-hide">
          <TableHeader className="sticky top-0 bg-white z-10 shadow">
            <TableRow>
              <TableHead>Thời gian</TableHead>
              <TableHead>Mã đối tượng</TableHead>
              <TableHead>Mã thiết bị</TableHead>
              <TableHead>Nhiệt độ (°C)</TableHead>
              <TableHead>Áp suất (hPa)</TableHead>
              <TableHead>Độ ẩm (%)</TableHead>
              <TableHead>IAQ</TableHead>
              <TableHead>Độ ồn (dB)</TableHead>
              <TableHead>CO2</TableHead>
              <TableHead>VOC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((item: DeviceDataReport) => (
                <TableRow key={item.Id}>
                  <TableCell>
                    {new Date(item.Times).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    {item.Object_Code}
                    <br />
                    <span className="text-xs text-gray-500">
                      {item.Project_Code}
                    </span>
                  </TableCell>
                  <TableCell>
                    {item.Devices_Code}
                  </TableCell>
                  <TableCell>{item.temperature ?? item.Temperature ?? "-"}</TableCell>
                  <TableCell>{item.pressure ??item.Pressure ?? "-"}</TableCell>
                  <TableCell>{item.humidity ??item.Humidity ??"-"}</TableCell>
                  <TableCell>{item.iaq ??item.AQI?? "-"}</TableCell>
                  <TableCell>{item.sound_level ??item.Noise ?? "-"}</TableCell>
                  <TableCell>{item.co2 ?? item.CO2 ?? "-"}</TableCell>
                  <TableCell>{item.voc ??item.VOC ?? "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-gray-500">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
