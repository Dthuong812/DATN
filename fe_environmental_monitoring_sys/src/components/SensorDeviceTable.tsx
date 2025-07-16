import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import Pagination from "./Pagination";

interface Device {
  id: number;
  name: string;
  type: string;
  location: string;
}

interface Props {
  devices: Device[];
}

export default function SensorDeviceTable({ devices }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const handleEdit = (device: Device) => {
    setSelectedDevice(device);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    console.log("Delete device with ID:", id);
  };

  const handleAdd = () => {
    setSelectedDevice(null);
    setOpen(true);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 13;
  const totalPages = Math.ceil(devices.length / pageSize);
  const paginatedDevices = devices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="mt-2">
      <div className="flex justify-end mb-4">
        <Button
          onClick={handleAdd}
          className="flex items-center bg-green-600 gap-2 hover:bg-green-600 cursor-pointer text-white"
        >
          <Plus size={16} />
          Thêm thiết bị
        </Button>
      </div>
      <div className="flex-1  rounded-xl border overflow-auto h-full scrollbar-hide  bg-white shadow p-4">
        <Table className="min-w-[1000px] ">
          <TableHeader>
            <TableRow className="sticky top-0  bg-white border-b">
              <TableHead>STT</TableHead>
              <TableHead>Tên thiết bị</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Trạm</TableHead>
              <TableHead>Đơn vị</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Ngày sửa</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedDevices.map((device, index) => (
              <TableRow key={device.id} className="pl-2">
                <TableCell>
                  {(currentPage - 1) * pageSize + index + 1}
                </TableCell>
                <TableCell>{device.name}</TableCell>
                <TableCell>{device.type}</TableCell>
                <TableCell>{device.location}</TableCell>
                <TableCell>{device.name}</TableCell>
                <TableCell>{device.type}</TableCell>
                <TableCell>{device.location}</TableCell>
                <TableCell>{device.name}</TableCell>
                <TableCell>{device.type}</TableCell>

                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleEdit(device)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(device.id)}
                    >
                      <Trash2 size={16} />
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
        onPageChange={(page) => setCurrentPage(page)}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDevice ? "Chỉnh sửa thiết bị" : "Thêm thiết bị mới"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Tên thiết bị"
              defaultValue={selectedDevice?.name}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Loại"
              defaultValue={selectedDevice?.type}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Vị trí"
              defaultValue={selectedDevice?.location}
              className="w-full border rounded px-3 py-2"
            />
            <div className="text-right">
              <Button onClick={() => setOpen(false)}>Lưu</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
