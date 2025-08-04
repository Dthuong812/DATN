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
import type { Location, Station } from "@/types/types";
import {
  useGetStationByIdQuery,
  useUpdateStationMutation,
} from "@/services/stations.service";
import { toast } from "sonner";
import { useGetLocationsQuery } from "@/services/location.service";

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

  const { data: stationList, isSuccess } = useGetStationByIdQuery(stationId!, {
    skip: !stationId,
  });
  const stationData = stationList?.Data;
  const [updateStation, { isLoading }] = useUpdateStationMutation();
  const { data: locationList } = useGetLocationsQuery({});
  const locations = locationList?.Data || [];

  useEffect(() => {
    if (isSuccess && stationData) {
      setFormData({
        ...stationData,
        Lat: Number(stationData.Lat),
        Lng: Number(stationData.Lng),
        Status: Number(stationData.Status),
      });
    }
  }, [stationData, isSuccess]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] mt-10">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa trạm</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 ">
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
            <select
              id="LocationId"
              name="LocationId"
              value={formData.LocationId ?? ""}
              onChange={handleChange}
              className="border rounded px-2 py-1"
            >
              <option value="">{formData.LocationId }</option>
              {locations?.map((loc:Location) => (
                <option key={loc.Id} value={loc.Id}>
                  {loc.Name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="Lat">Vĩ độ (Lat)</Label>
            <Input
              id="Lat"
              name="Lat"
              type="number"
              step="any"
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
              step="any"
              value={formData.Lng ?? ""}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="Status">Trạng thái</Label>
            <select
              id="Status"
              name="Status"
              value={formData.Status ?? 0}
              onChange={handleChange}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
                ring-offset-background placeholder:text-muted-foreground focus:outline-none
                focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value={0}>Không hoạt động</option>
              <option value={1}>Hoạt động</option>
            </select>
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
