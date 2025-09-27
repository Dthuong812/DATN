import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import type { Device, Sensor } from "@/types/types";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import Pagination from "../Pagination";
import DeleteDeviceButton from "./DeleteDeviceButton";
import UpdateDeviceDraw from "./UpdateDeviceDraw";
import { useState } from "react";

interface DeviceProps {
  devices: Device[];
  isFetching: boolean;
  currentPage: number;
  pageSize: number;
  totalPages?: number;
  totalRecords?: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (size: string) => void;
}

export default function DeviceTable({
  devices,
  isFetching,
  currentPage,
  totalPages = 1,
  onPageChange,
}: DeviceProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const handleEdit = (deviceId: number) => {
    setSelectedDeviceId(deviceId);
    setModalOpen(true);
  };
  if (isFetching) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-2">
      <div className="flex-1  rounded-xl border overflow-auto h-full scrollbar-hide  bg-white shadow p-4">
        <Table className="min-w-[1000px] ">
          <TableHeader>
            <TableRow className="sticky top-0  bg-white border-b">
              <TableHead>Mã thiết bị</TableHead>
              <TableHead>Mã loại thiết bị</TableHead>
              <TableHead>Mã đối tượng</TableHead>
              <TableHead>Series</TableHead>
              <TableHead>Cảm biến</TableHead>
              <TableHead>Đơn vị</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {devices.map((device: Device) => (
              <TableRow key={device.Id} className="pl-2">
                <TableCell>
                  {device.Code}
                  <br />
                  <span className="text-xs text-gray-500">{device.Name}</span>
                </TableCell>
                <TableCell>{device.DeviceType_Code}</TableCell>
                <TableCell>{device.Object_Code}</TableCell>
                <TableCell>{device.Series}</TableCell>
                <TableCell>
                  {device.Details_Data?.sensors &&
                  device.Details_Data.sensors.length > 0 ? (
                    device.Details_Data.sensors.map(
                      (sensor: Sensor, index: number) => (
                        <div key={index} className="mb-1">
                          <span className="">{sensor.name}</span>
                        </div>
                      )
                    )
                  ) : (
                    <span className="text-gray-500">Không có dữ liệu</span>
                  )}
                </TableCell>
                <TableCell>
                  {device.Details_Data?.sensors &&
                  device.Details_Data.sensors.length > 0
                    ? device.Details_Data.sensors
                        .map((sensor: Sensor) => {
                          const units = Object.values(sensor.unit || {}).filter(
                            (unit) =>
                              unit !== undefined && unit !== null && unit !== ""
                          );
                          return units.join(", ");
                        })
                        .join(", ")
                    : "Không có dữ liệu"}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleEdit(device.Id)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button size="icon" variant="destructive">
                      <DeleteDeviceButton id={device.Id} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
      {selectedDeviceId !== null && (
        <UpdateDeviceDraw
          deviceId={selectedDeviceId}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
