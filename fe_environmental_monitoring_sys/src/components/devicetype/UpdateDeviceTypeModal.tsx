import type {DeviceTypeFormValue } from "@/types/types";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useGetDeviceTypeByIdQuery, useUpdateDeviceTypeMutation } from "@/services/devicetype.service";

interface UpdateDeviceTypeModalProps {
  deviceTypeId: number | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function UpdateDeviceTypeModal({
  deviceTypeId,
  open,
  onClose,
  onSuccess,
}: UpdateDeviceTypeModalProps) {
  const { handleSubmit, setValue, register, reset } =
    useForm<DeviceTypeFormValue>();

  const { data: DeviceTypeList, isSuccess } = useGetDeviceTypeByIdQuery(
    deviceTypeId!,
    {
      skip: !deviceTypeId,
    }
  );
  const DeviceTypeData = DeviceTypeList?.Data;

  const [updateDeviceType, { isLoading }] = useUpdateDeviceTypeMutation();

  useEffect(() => {
    if (isSuccess && DeviceTypeData) {
      reset({
        Code: DeviceTypeData.Code,
        Name: DeviceTypeData.Name,
      });
      
    }
  }, [DeviceTypeData, isSuccess, setValue, reset]);

  const handleSubmitForm = async (data: DeviceTypeFormValue) => {
    try {
      const payload = {
        Code: data.Code,
        Name: data.Name,
      };
      await updateDeviceType({ id: deviceTypeId, ...payload }).unwrap();
      toast.success("Cập nhật thành công");
      onClose();
      onSuccess?.();
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] mt-10"
      onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa loại thiết bị</DialogTitle>
        </DialogHeader>
        <div className="flex gap-4 w-full">
          <div className="grid gap-4 w-full ">
            <div className="grid gap-2">
              <Label htmlFor="Code">Mã loại thiết bị</Label>
              <Input
                id="Code"
                placeholder="Mã code"
                {...register("Code", {
                  required: "Mã code không được bỏ trống",
                })}
              />
            </div>
          </div>
          <div className="grid gap-4 w-full ">
            <div className="grid gap-2">
              <Label htmlFor="Name">Tên loại thiết bị</Label>
              <Input
                id="Name"
                placeholder="Tên loại thiết bị"
                {...register("Name", {
                  required: "Tên loại thiết bị không được bỏ trống",
                })}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit(handleSubmitForm)}
            disabled={isLoading}
            className="bg-green-800 hover:bg-green-700 cursor-pointer"
          >
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
