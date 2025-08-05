import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Location} from "@/types/types";
import { toast } from "sonner";
import { useGetLocationByIdQuery, useUpdateLocationMutation } from "@/services/location.service";

interface UpdateLocationModalProps {
  locationId: number | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function UpdateLocationModal({
  locationId,
  open,
  onClose,
  onSuccess
}: UpdateLocationModalProps) {
  const [formData, setFormData] = useState<Partial<Location>>({});

  const { data: locationList, isSuccess } = useGetLocationByIdQuery(locationId!, {
    skip: !locationId,
  });
  const locationData = locationList?.Data;
  const [updateLocation, { isLoading }] = useUpdateLocationMutation();


  useEffect(() => {
    if (isSuccess && locationData ) {
      setFormData({
        ...locationData ,
      });
    }
  }, [locationData , isSuccess]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updateLocation({ id: locationId, ...formData }).unwrap();
      toast.success("Cập nhật thành công");
      onClose();
      onSuccess?.();
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] mt-10">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa khu vực</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 ">
          <div className="grid gap-2">
            <Label htmlFor="Name">Tên khu vực</Label>
            <Input
              id="Name"
              name="Name"
              value={formData.Name || ""}
              onChange={handleChange}
            />
          </div>

        </div>

        <div className="flex justify-end space-x-2  ">
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
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
