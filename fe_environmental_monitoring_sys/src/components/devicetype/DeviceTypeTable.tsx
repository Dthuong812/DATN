import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Pencil} from "lucide-react";
import type { DeviceType } from "@/types/types";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import Pagination from "../common/Pagination";
import { useState } from "react";
import AddDeviceTypeModal from "./AddDeviceTypeModal";
import UpdateDeviceTypeModal from "./UpdateDeviceTypeModal";
import DeleteDeviceTypeButton from "./DeleteDeviceTypeButton";

interface DeviceProps {
  deviceType: DeviceType[];
  isFetching: boolean;
}

export default function DeviceTypeTable({
  deviceType,
  isFetching,
}: DeviceProps) {
  const [open, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDeviceTypeId, setSelectedDeviceTypeId] = useState<
    number | null
  >(null);
  const handleEdit = (deviceTypeId: number) => {
    setSelectedDeviceTypeId(deviceTypeId);
    setModalOpen(true);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(deviceType.length / itemsPerPage);
  const typeData = deviceType.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    (deviceType.length > 0 )? (
        <div className="mt-2">
        <div className="flex-1  rounded-xl border overflow-auto h-full scrollbar-hide  bg-white shadow p-4">
          <div className="flex justify-end">
            <Button
              className="bg-green-600 text-white hover:bg-green-700 cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              Thêm loại thiết bị
            </Button>
          </div>
          <Table className="min-w-[1000px] ">
            <TableHeader>
              <TableRow className="sticky top-0  bg-white border-b">
                <TableHead>Mã loại thiết bị</TableHead>
                <TableHead>Tên loại thiết bị</TableHead>
                <TableHead className="text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>
  
            <TableBody>
              {typeData.map((type: DeviceType) => (
                <TableRow key={type.Id} className="pl-2">
                  <TableCell>{type.Code}</TableCell>
                  <TableCell>{type.Name}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleEdit(type.Id)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button size="icon" variant="destructive">
                        <DeleteDeviceTypeButton id={type.Id} />
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
          onPageChange={setCurrentPage}
        />
  
        <AddDeviceTypeModal open={open} onClose={() => setIsOpen(false)} />
        <UpdateDeviceTypeModal
          deviceTypeId={selectedDeviceTypeId}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </div>
    ):(
        <TableRow>
        <TableCell colSpan={7} className="text-center py-8">
          <div className="flex flex-col items-center space-y-2">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">Không có dữ liệu</p>
              <p className="text-sm text-muted-foreground">
                Thử thay đổi bộ lọc hoặc kiểm tra lại kết nối
              </p>
            </div>
          </div>
        </TableCell>
      </TableRow>
    )
)
}
