import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import type { ObjectFormValue, Organization, Project } from "@/types/types";
import { toast } from "sonner";
import { useGetOrganizationsQuery } from "@/services/organization.service";
import {
  useGetObjectByIdQuery,
  useUpdateObjectMutation,
} from "@/services/object.service";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface UpdateObjectDrawProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  objectId: number; // id của object cần update
}

const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function UpdateObjectDraw({
  open,
  onClose,
  onSuccess,
  objectId,
}: UpdateObjectDrawProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ObjectFormValue>({});

  const { data: listOrgs } = useGetOrganizationsQuery({});
  const org = listOrgs?.Data;

  const { data: objectDetail, isFetching } = useGetObjectByIdQuery(objectId, {
    skip: !open,
  });
  const [updateObject, { isLoading }] = useUpdateObjectMutation();

  const [selectedProjectCode, setSelectedProjectCode] = useState<string>("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [latitude, setLatitude] = useState<number>(21.028511);
  const [longitude, setLongitude] = useState<number>(105.804817);

  useEffect(() => {
    if (objectDetail?.Data) {
      reset(objectDetail.Data);
      setSelectedProjectCode(objectDetail.Data.Project_Code);
      setLatitude(objectDetail.Data.Latitude || 21.028511);
      setLongitude(objectDetail.Data.Longitude || 105.804817);

      const selectedOrg = org?.find(
        (o: Organization) => o.Code === objectDetail.Data.Organization_Code
      );
      setFilteredProjects(selectedOrg?.Projects || []);
    }
  }, [objectDetail, reset, org]);

  const handleOrganizationChange = (organizationCode: string) => {
    const selectedOrg = org?.find(
      (o: Organization) => o.Code === organizationCode
    );
    setFilteredProjects(selectedOrg?.Projects || []);
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        if (!isNaN(lat) && !isNaN(lng)) {
          setLatitude(lat);
          setLongitude(lng);
          setValue("Latitude", lat);
          setValue("Longitude", lng);
        }
      },
    });

    return latitude && longitude ? (
      <Marker position={[latitude, longitude]} icon={customIcon}></Marker>
    ) : null;
  };

  const MapController = () => {
    const map = useMap();

    useEffect(() => {
      if (!isNaN(latitude) && !isNaN(longitude)) {
        map.flyTo([latitude, longitude], 13);
      }
    }, [latitude, longitude, map]);

    return null;
  };

  const onSubmit = async (data: ObjectFormValue) => {
    try {
      const {
        CreatedBy,
        CreatedAt,
        DeletedAt,
        UpdatedAt,
        UpdatedBy,
        ...clean
      } = data;
      await updateObject({ id: objectId, ...clean }).unwrap();
      toast.success("Cập nhật thành công!");
      onClose();
      if (onSuccess) onSuccess();
    } catch {
      toast.error("Có lỗi khi cập nhật!");
    }
  };

  return (
    <Drawer open={open} onOpenChange={onClose} direction="right">
      <DrawerContent
        style={{ width: "500px", maxWidth: "500px" }}
        className="!w-[500px] max-w-[500px] ml-auto p-6 space-y-4 mt-[35px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DrawerHeader>
          <DrawerTitle className="ml-[-18px] mb-[-18px]">
            Cập nhật đối tượng
          </DrawerTitle>
        </DrawerHeader>

        {isFetching ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 overflow-auto scrollbar-hide px-2"
          >
            <div className="grid gap-1">
              <Label htmlFor="Organization_Code">Mã công ty</Label>
              <select
                id="Organization_Code"
                {...register("Organization_Code")}
                onChange={(e) => handleOrganizationChange(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">-- Chọn mã công ty --</option>
                {org?.map((p: Organization) => (
                  <option key={p.Code} value={p.Code}>
                    {p.Name}
                  </option>
                ))}
              </select>
              {errors.Organization_Code && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Organization_Code.message}
                </p>
              )}
            </div>

            <div className="grid gap-1">
              <Label htmlFor="Project_Code">Mã dự án</Label>
              <select
                id="Project_Code"
                {...register("Project_Code")}
                onChange={(e) => setSelectedProjectCode(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">-- Chọn mã dự án --</option>
                {filteredProjects?.map((p: Project) => (
                  <option key={p.Code} value={p.Code}>
                    {p.Name}
                  </option>
                ))}
              </select>
              {errors.Project_Code && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Project_Code.message}
                </p>
              )}
            </div>

            {selectedProjectCode === "EcoMonitor" && (
              <>
                <Label htmlFor="Code">Mã đối tượng</Label>
                <Input id="Code" {...register("Code")} className="mt-[-10px]" />

                <Label htmlFor="Name">Tên đối tượng</Label>
                <Input id="Name" {...register("Name")} className="mt-[-10px]" />

                <Label htmlFor="Address">Địa chỉ</Label>
                <Input
                  id="Address"
                  {...register("Details_Value.Address")}
                  className="mt-[-10px]"
                />

                <div className="flex gap-4">
                  <div className="w-full">
                    <Label htmlFor="Latitude">Vĩ độ</Label>
                    <Input
                      id="Latitude"
                      value={latitude}
                      {...register("Latitude")}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value)) setLatitude(value);
                      }}
                      className="mt-[4px]"
                    />
                  </div>
                  <div className="w-full">
                    <Label htmlFor="Longitude">Kinh độ</Label>
                    <Input
                      id="Longitude"
                      className="mt-[4px] "
                      value={longitude}
                      {...register("Longitude")}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value)) setLongitude(value);
                      }}
                    />
                  </div>
                </div>

                <MapContainer
                  center={[latitude, longitude]}
                  zoom={13}
                  style={{ height: "240px", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <LocationMarker />
                  <MapController />
                </MapContainer>
              </>
            )}
            <div className="flex justify-between gap-4">
              <div className="w-full">
                <Label className="mt-[-4px] mb-[3px]">Ngày lắp đặt</Label>
                <Input
                  type="date"
                  {...register("Details_Value.Installation_Date")}
                />
              </div>
              <div className="w-full">
                <Label className="mt-[-4px] mb-[3px]">Ngày bảo trì</Label>
                <Input
                  type="date"
                  {...register("Details_Value.Last_Maintenance_Date")}
                />
              </div>
            </div>

            <div className="flex justify-between gap-4">
              <div className="w-full">
                <Label className="mt-[-4px] mb-[3px]">Kết nối</Label>
                <select
                  {...register("Details_Value.Connection_Type")}
                  defaultValue={
                    objectDetail?.Data?.Details_Value?.Connection_Type || ""
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">-- Chọn kết nối --</option>
                  <option value="4G">4G</option>
                  <option value="WIFI">WIFI</option>
                  <option value="LAN">LAN</option>
                  <option value="WAN">WAN</option>
                  <option value="LORA">LORA</option>
                </select>
              </div>

              <div className="w-full">
                <Label className="mt-[-4px] mb-[3px]">Nguồn điện (V)</Label>
                <select
                  {...register("Details_Value.Power_Supply")}
                  defaultValue={
                    objectDetail?.Data?.Details_Value?.Power_Supply || ""
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">-- Chọn nguồn điện --</option>
                  <option value="5">5V</option>
                  <option value="12">12V</option>
                  <option value="24">24V</option>
                  <option value="220">220V</option>
                  <option value="Pin">Pin</option>
                  <option value="Năng lượng mặt trời">
                    Năng lượng mặt trời
                  </option>
                </select>
              </div>
            </div>

            <div className="w-full">
              <Label className="mt-[-4px] mb-[3px]">Trạng thái</Label>
              <Input
                disabled
                value={
                  objectDetail?.Data?.Status === 1
                    ? "Hoạt động"
                    : objectDetail?.Data?.Status === 2
                    ? "Không hoạt động"
                    : "Bảo trì"
                }
              />
            </div>
            <div className="w-full">
              <Label className="mt-[-4px] mb-[3px]">Ghi chú</Label>
              <Input
                disabled
                value={objectDetail?.Data?.Details_Value?.Note || ""}
              />
            </div>

            <DrawerFooter className="flex justify-end gap-2 flex-row p-0 sticky bottom-0 bg-white pt-4 mt-4 z-10000">
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
                {isLoading ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </DrawerFooter>
          </form>
        )}
      </DrawerContent>
    </Drawer>
  );
}
