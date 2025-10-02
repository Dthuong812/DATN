import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useAddDeviceTypeMutation } from "@/services/devicetype.service";
import { useForm } from "react-hook-form";
import type { DeviceTypeFormValue } from "@/types/types";
import { DrawerFooter } from "../ui/drawer";

interface AddDeviceTypeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddDeviceTypeModal({
  open,
  onClose,
  onSuccess,
}: AddDeviceTypeModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  reset,
  } = useForm<DeviceTypeFormValue>();

  const [addDeviceType, { isLoading }] = useAddDeviceTypeMutation();

  const onSubmit = async (data: DeviceTypeFormValue) => {
    try {
      await addDeviceType(data).unwrap();
      toast.success("Lưu thành công!");
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to add DeviceType:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] mt-10"
      onInteractOutside={(e) => e.preventDefault()}
       >
        <DialogHeader>
          <DialogTitle>Thêm loại thiết bị</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4 w-full flex-col">
            <div className="grid gap-2 w-full">
              <Label htmlFor="Code">Mã loại thiết bị</Label>
              <Input
                id="Code"
                placeholder="Mã loại thiết bị"
                {...register("Code", {
                  required: "Mã code không được bỏ trống",
                })}
              />
              {errors.Code && (
                <p className="text-sm text-red-600">{errors.Code.message}</p>
              )}
            </div>

            <div className="grid gap-2 w-full">
              <Label htmlFor="Name">Tên loại thiết bị</Label>
              <Input
                id="Name"
                placeholder="Tên loại thiết bị"
                {...register("Name", {
                  required: "Tên loại thiết bị không được bỏ trống",
                })}
              />
              {errors.Name && (
                <p className="text-sm text-red-600">{errors.Name.message}</p>
              )}
            </div>
          </div>
          <DrawerFooter className="flex justify-end gap-2 flex-row p-0">
           
           <Button
             type="button"
             variant="outline"
             onClick={() => {
               reset();      
               onClose();   
             }}
             className="cursor-pointer"
           >
             Hủy
           </Button>
           <Button
             type="submit"
             disabled={isLoading}
             className="bg-green-800 hover:bg-green-700 cursor-pointer"
           >
             {isLoading ? "Đang lưu..." : "Lưu"}
           </Button>
         </DrawerFooter>
       </form>
     </DialogContent>
    </Dialog>
  );
}
