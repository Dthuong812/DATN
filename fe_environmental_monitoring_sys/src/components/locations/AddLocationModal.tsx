import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type {LocationFormValues } from "@/types/types";
import { useAddLocationMutation} from "@/services/location.service";

interface AddLocationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddLocationModal({
  open,
  onClose,
  onSuccess,
}: AddLocationModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LocationFormValues>();

  const [addLocation, { isLoading }] = useAddLocationMutation();
  const onSubmit = async (data: LocationFormValues) => {
    try {
      await addLocation(data).unwrap();
      reset();
      toast.success("Thêm trạm thành công!");
      onClose();
      onSuccess?.();
    } catch {
      toast.error("Thêm trạm thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] mt-10">
        <DialogHeader>
          <DialogTitle>Thêm trạm dừng</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="Name">Tên khu vực</Label>
            <Input
              id="Name"
              placeholder="Tên khu vực"
              {...register("Name", {
                required: "Tên khu vực không được bỏ trống",
              })}
            />
            {errors.Name && (
              <p className="text-sm text-red-600">{errors.Name.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-green-800 hover:bg-green-700 cursor-pointer"
            >
              {isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
