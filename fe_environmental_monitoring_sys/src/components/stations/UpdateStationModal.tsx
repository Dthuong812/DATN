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
import type { Station } from "@/types/types";
import {
  useGetStationByIdQuery,
  useUpdateStationMutation,
} from "@/services/stations.service";
import { toast } from "sonner";

interface UpdateStationModalProps {
  stationId: number | null;
  open: boolean;
  onClose: () => void;
}

export function UpdateStationModal({
  stationId,
  open,
  onClose,
}: UpdateStationModalProps) {
  const [formData, setFormData] = useState<Partial<Station>>({});

  const { data: stationData, isSuccess } = useGetStationByIdQuery(stationId!, {
    skip: !stationId,
  });

  const [updateStation, { isLoading }] = useUpdateStationMutation();

  useEffect(() => {
    if (isSuccess && stationData) {
      setFormData({
        ...stationData,
        LocationId: Number(stationData.LocationId),
        Lat: Number(stationData.Lat),
        Lng: Number(stationData.Lng),
        Status: Number(stationData.Status),
      });
    }
  }, [stationData, isSuccess]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const parsedValue =
      ["LocationId", "Lat", "Lng", "Status"].includes(name) && value !== ""
        ? Number(value)
        : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async () => {
    if (!stationId || !formData.Name || !formData.Address) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }
    try {
      await updateStation({ id: stationId, ...formData }).unwrap();
      toast.success("Cập nhật thành công");
      onClose();
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa trạm</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="Name">Tên trạm</Label>
            <Input
              id="Name"
              name="Name"
              value={formData.Name || ""}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="Address">Địa chỉ</Label>
            <Input
              id="Address"
              name="Address"
              value={formData.Address || ""}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="LocationId">Khu vực (LocationId)</Label>
            <Input
              id="LocationId"
              name="LocationId"
              type="number"
              value={formData.Location_Id ?? ""}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="Lat">Vĩ độ (Lat)</Label>
            <Input
              id="Lat"
              name="Lat"
              type="number"
              value={formData.Lat ?? ""}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="Lng">Kinh độ (Lng)</Label>
            <Input
              id="Lng"
              name="Lng"
              type="number"
              value={formData.Lng ?? ""}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="Status">Trạng thái</Label>
            <Input
              id="Status"
              name="Status"
              type="number"
              value={formData.Status ?? ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
