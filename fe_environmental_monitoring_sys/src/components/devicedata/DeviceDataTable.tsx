import type { DeviceData } from "@/types/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Pagination from "../common/Pagination";

interface Props {
  deviceDatas: DeviceData[];
  isFetching: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: string) => void;
}

export default function DeviceDataTable({
  deviceDatas,
  isFetching,
  currentPage,
  totalPages,
  onPageChange
}: Props) {
  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        Loading realtime device data...
      </div>
    );
  }

  return (
    <div className="mx-6">
      <div className="flex-1 rounded-xl border overflow-auto h-full scrollbar-hide bg-white shadow p-4">
        <Table className="h-full">
          <TableHeader>
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
              <TableHead>Mức ngập (cm)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(deviceDatas) && deviceDatas.length > 0 ? (
              deviceDatas.map((data: DeviceData) => (
                <TableRow key={data.Id}>
                  <TableCell>
                    {new Date(data.Times).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    {data.Object_Code}
                    <br />
                    <span className="text-xs text-gray-500">
                      {data.Project_Code}
                    </span>
                  </TableCell>
                  <TableCell>
                    {data.Devices_Code}
                    <br />
                    <span className="text-xs text-gray-500">
                      {data.Latitude} - {data.Longitude}
                    </span>
                  </TableCell>
                  <TableCell>{data.DataJson?.temperature ?? "-"}</TableCell>
                  <TableCell>{data.DataJson?.pressure ?? "-"}</TableCell>
                  <TableCell>{data.DataJson?.humidity ?? "-"}</TableCell>
                  <TableCell>{data.DataJson?.iaq ?? "-"}</TableCell>
                  <TableCell>{data.DataJson?.sound_level ?? "-"}</TableCell>
                  <TableCell>{data.DataJson?.voc ?? "-"}</TableCell>
                  <TableCell>{data.DataJson?.co2 ?? "-"}</TableCell>
                  <TableCell>{data.DataJson?.distance ?? "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-gray-500">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}