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

interface DeviceType {
  id: number;
  name: string;
  description: string;
}

interface Props {
  deviceTypes: DeviceType[];
}

export default function DeviceTypeTable({ deviceTypes }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<DeviceType | null>(null);

  const handleEdit = (type: DeviceType) => {
    setSelectedType(type);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    console.log("Delete type with ID:", id);
  };

  const handleAdd = () => {
    setSelectedType(null);
    setOpen(true);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;
  const totalPages = Math.ceil(deviceTypes.length / pageSize);
  const paginatedTypes = deviceTypes.slice(
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
          Thêm loại thiết bị
        </Button>
      </div>

      <div className="rounded-xl border overflow-auto h-full scrollbar-hide p-4 bg-white shadow">
        <Table className="min-w-[700px]  ">
          <TableHeader>
            <TableRow className="sticky top-0 bg-white border-b ">
              <TableHead>STT</TableHead>
              <TableHead>Tên loại thiết bị</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Số lựợng</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTypes.map((type, index) => (
              <TableRow key={type.id}>
                <TableCell>
                  {(currentPage - 1) * pageSize + index + 1}
                </TableCell>
                <TableCell>{type.name}</TableCell>
                <TableCell>{type.description}</TableCell>
                <TableCell>{type.description}</TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleEdit(type)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(type.id)}
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
              {selectedType ? "Chỉnh sửa loại thiết bị" : "Thêm loại thiết bị"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Tên loại thiết bị"
              defaultValue={selectedType?.name}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Mô tả"
              defaultValue={selectedType?.description}
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
