import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useDeleteUserMutation } from "@/services/user.service";

export default function DeleteUserButton({
  id,
  refetch,
}: {
  id: number;
  refetch: () => void;
}) {
  const [deleteUser] = useDeleteUserMutation();
  const handleDelete = async () => {
    try {
      const res = await deleteUser(id).unwrap();
      if (res.Status === 1) {
        toast.success("Xoá thành công!");
        refetch();
      } else {
        toast.error("Xoá thất bại: " + res.Message);
      }
    } catch {
      toast.error("Lỗi xoá người dùng.");
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
          <AlertDialogTitle>
            Bạn chắc chắn muốn xoá người dùng này?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Dữ liệu người dùng và thông tin liên
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
