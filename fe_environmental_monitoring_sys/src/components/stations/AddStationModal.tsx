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
import { useAddStationMutation } from "@/services/stations.service";
import { toast } from "sonner";
import type { StationFormValues } from "@/types/types";

interface AddStationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddStationModal({
  open,
  onClose,
  onSuccess,
}: AddStationModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StationFormValues>();

  const [addStation, { isLoading }] = useAddStationMutation();

  const onSubmit = async (data: StationFormValues) => {
    try {
      await addStation(data).unwrap();
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm trạm dừng</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="grid gap-2">
            <Label htmlFor="Name">Tên trạm</Label>
            <Input
              id="Name"
              placeholder="Tên trạm"
              {...register("Name", { required: "Tên trạm không được bỏ trống" })}
            />
            {errors.Name && (
              <p className="text-sm text-red-600">{errors.Name.message}</p>
            )}
          </div>


          <div className="grid gap-2">
            <Label htmlFor="Address">Địa chỉ</Label>
            <Input
              id="Address"
              placeholder="Địa chỉ"
              {...register("Address", { required: "Địa chỉ không được bỏ trống" })}
            />
            {errors.Address && (
              <p className="text-sm text-red-600">{errors.Address.message}</p>
            )}
          </div>


          <div className="grid gap-2">
            <Label htmlFor="LocationId">ID Khu vực</Label>
            <Input
              id="LocationId"
              type="number"
              placeholder="ID Khu vực"
              {...register("LocationId", {
                valueAsNumber: true,
                required: "ID khu vực là bắt buộc",
                min: { value: 1, message: "ID phải lớn hơn 0" },
              })}
            />
            {errors.LocationId && (
              <p className="text-sm text-red-600">{errors.LocationId.message}</p>
            )}
          </div>


          <div className="grid gap-2">
            <Label htmlFor="Lat">Vĩ độ (Lat)</Label>
            <Input
              id="Lat"
              type="number"
              step="any"
              placeholder="Vĩ độ"
              {...register("Lat", {
                valueAsNumber: true,
                required: "Vĩ độ không được bỏ trống",
              })}
            />
            {errors.Lat && (
              <p className="text-sm text-red-600">{errors.Lat.message}</p>
            )}
          </div>


          <div className="grid gap-2">
            <Label htmlFor="Lng">Kinh độ (Lng)</Label>
            <Input
              id="Lng"
              type="number"
              step="any"
              placeholder="Kinh độ"
              {...register("Lng", {
                valueAsNumber: true,
                required: "Kinh độ không được bỏ trống",
              })}
            />
            {errors.Lng && (
              <p className="text-sm text-red-600">{errors.Lng.message}</p>
            )}
          </div>


          <div className="grid gap-2">
            <Label htmlFor="Status">Trạng thái</Label>
            <select
              id="Status"
              defaultValue={0}
              {...register("Status", { valueAsNumber: true })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
                ring-offset-background placeholder:text-muted-foreground focus:outline-none
                focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value={0}>Không hoạt động</option>
              <option value={1}>Hoạt động</option>
            </select>
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
