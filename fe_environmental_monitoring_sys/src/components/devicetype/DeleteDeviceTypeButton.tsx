import { Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useDeleteDeviceTypeMutation } from "@/services/devicetype.service";

export default function DeleteDeviceTypeButton({
    id,
  }: {
    id: number;
  }) {
    const [deleteDeviceType] = useDeleteDeviceTypeMutation();
    const handleDelete = async () => {
      try {
        const res = await deleteDeviceType(id).unwrap();
        if (res.Status === 1) {
          toast.success("Xoá thành công!");
        }
        else {
          toast.error("Lỗi xoá loại thiết bị.");
        }
      } catch {
        toast.error("Lỗi xoá loại thiết bị.");
      }
    };
  return (
    <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button className="text-red-600 bg-white hover:bg-gray-100 border border-gray-200 w-9 h-9 p-0 cursor-pointer">
        <Trash2 size={16} />
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Bạn chắc chắn muốn xoá loại thiết bị này?</AlertDialogTitle>
        <AlertDialogDescription>
          Hành động này không thể hoàn tác. Dữ liệu loại thiết bị và thông tin liên
          quan sẽ bị xoá vĩnh viễn.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="cursor-pointer">Huỷ</AlertDialogCancel>
        <AlertDialogAction
          onClick={handleDelete}
          className="bg-green-800 hover:bg-red-500 cursor-pointer"
        >
          Xoá
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  );
}