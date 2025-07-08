import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface Station {
  id: number; 
  name: string;
  address: string;
}

interface StationListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stations: Station[];
  onEdit: (station: Station) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

export default function StationListModal({
  open,
  onOpenChange,
  stations,
  onEdit,
  onDelete,
}: StationListModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full md:min-w-5xl p-4 h-full max-h-[80vh] overflow-y-auto z-[999999999]">
        <DialogHeader className=" flex  mb-4">
          <DialogTitle>Danh sách các trạm</DialogTitle>

        </DialogHeader>
        <div className="overflow-x-auto h-full overflow-y-auto">
          <table className="min-w-full text-sm text-left border">
            <thead className="bg-gray-100 font-semibold">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Tên trạm</th>
                <th className="p-2 border">Địa chỉ</th>
                <th className="p-2 border text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {stations.map((station, index) => (
                <tr key={station.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{station.name}</td>
                  <td className="p-2 border">{station.address}</td>
                  <td className="p-2 border text-center space-x-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => onEdit(station)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => onDelete(station.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
              {stations.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
