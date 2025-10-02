import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
// import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { ObjectFormValue, Organization, Project } from "@/types/types";
import { toast } from "sonner";
import { useGetOrganizationsQuery } from "@/services/organization.service";
import { useAddObjectMutation } from "@/services/object.service";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
interface AddObjectDrawProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
const schema = yup.object().shape({
  Organization_Code: yup.string().required("Mã công ty là bắt buộc"),
  Project_Code: yup.string().required("Mã dự án là bắt buộc"),
  Code: yup.string().required("Mã đối tượng là bắt buộc"),
  Name: yup.string().required("Tên đối tượng là bắt buộc"),
  Latitude: yup
    .number()
    .typeError("Vĩ độ phải là số")
    .required("Vĩ độ là bắt buộc"),
  Longitude: yup
    .number()
    .typeError("Kinh độ phải là số")
    .required("Kinh độ là bắt buộc"),
  Details_Value: yup.object().shape({
    Address: yup.string().required("Địa chỉ là bắt buộc"),
    Installation_Date: yup.string().nullable(),
    Last_Maintenance_Date: yup.string().nullable(),
    Connection_Type: yup.string().nullable(),
    Power_Supply: yup.string().nullable(),
  }),
});
export default function AddObjectDraw({
  open,
  onClose,
  onSuccess,
}: AddObjectDrawProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ObjectFormValue>({
    resolver: yupResolver(schema)
  });

  const { data: listOrgs } = useGetOrganizationsQuery({});
  const org = listOrgs?.Data;
  const [addObject, { isLoading }] = useAddObjectMutation();
  const [selectedProjectCode, setSelectedProjectCode] = useState<string>("");
  const [, setSelectedOrganizationCode] = useState<string>("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [latitude, setLatitude] = useState<number>(21.028511);
  const [longitude, setLongitude] = useState<number>(105.804817);

  const handleOrganizationChange = (organizationCode: string) => {
    setSelectedOrganizationCode(organizationCode);
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

    return latitude && longitude && !isNaN(latitude) && !isNaN(longitude) ? (
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
     
      data.Status = 2;
      data.Details_Value.Note = "Trạm mới chưa hoạt động, không có kết nối"
      await addObject(data).unwrap();
      toast.success("Lưu thành công!");
      reset();
      onClose();
      if (onSuccess) onSuccess();
    } catch {
      toast.error("Có lỗi khi lưu!");
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
            Thêm đối tượng
          </DrawerTitle>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 overflow-auto scrollbar-hide px-2 "
        >
          <div className="grid gap-2">
            <Label htmlFor="Organization_Code">Mã công ty</Label>
            <select
              id="Organization_Code"
              {...register("Organization_Code")}
              onChange={(e) => {
                handleOrganizationChange(e.target.value);
              }}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
      ring-offset-background placeholder:text-muted-foreground focus:outline-none
      focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
          <div className="grid gap-2">
            <Label htmlFor="Project_Code">Mã dự án</Label>
            <select
              id="Project_Code"
              {...register("Project_Code")}
              onChange={(e) => {
                setSelectedProjectCode(e.target.value);
              }}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
      ring-offset-background placeholder:text-muted-foreground focus:outline-none
      focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
            <div className="grid gap-2">
              <Label htmlFor="Code">Mã đối tượng</Label>
              <Input
                id="Code"
                {...register("Code")}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
        ring-offset-background placeholder:text-muted-foreground focus:outline-none
        focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Label htmlFor="Name">Tên đối tượng</Label>
              <Input
                id="Name"
                {...register("Name")}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
        ring-offset-background placeholder:text-muted-foreground focus:outline-none
        focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Label htmlFor="Address">Địa chỉ</Label>
              <Input
                id="Address"
                {...register("Details_Value.Address" as const)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
        ring-offset-background placeholder:text-muted-foreground focus:outline-none
        focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div className="flex justify-between items-center w-full gap-4">
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
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
        ring-offset-background placeholder:text-muted-foreground focus:outline-none
        focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                  />
                </div>
                <div className="w-full">
                  <Label htmlFor="Longitude">Kinh độ</Label>
                  <Input
                    id="Longitude"
                    {...register("Longitude")}
                    value={longitude}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value)) setLongitude(value);
                    }}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
        ring-offset-background placeholder:text-muted-foreground focus:outline-none
        focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <MapContainer
                  center={[latitude, longitude]}
                  zoom={13}
                  style={{ height: "250px", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationMarker />
                  <MapController />
                </MapContainer>
              </div>
              <div className="flex justify-between items-center w-full gap-4">
                <div className="w-full">
                  <Label htmlFor="Installation_Date">Ngày lắp đặt</Label>
                  <Input
                    type="date"
                    id="Installation_Date"
                    {...register("Details_Value.Installation_Date" as const)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
        ring-offset-background placeholder:text-muted-foreground focus:outline-none
        focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                  />
                </div>
                <div className="w-full">
                  <Label htmlFor="Last_Maintenance_Date">Ngày bảo trì</Label>
                  <Input
                    type="date"
                    id="Last_Maintenance_Date"
                    {...register(
                      "Details_Value.Last_Maintenance_Date" as const
                    )}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
        ring-offset-background placeholder:text-muted-foreground focus:outline-none
        focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center w-full gap-4">
                <div className="w-full">
                  <Label htmlFor="Installation_Date">Kết nối</Label>
                  <select
                    id="Connection_Type"
                    {...register("Details_Value.Connection_Type" as const)}
                    className="w-full rounded-md border-none border-gray-600  px-3 py-2 text-sm shadow-sm **:cursor-pointer"
                  >
                    <option value="">Chọn loại kết nối</option>
                    <option value="4G">4G</option>
                    <option value="WIFI">WIFI</option>
                    <option value="LAN">LAN</option>
                    <option value="WAN">WAN</option>
                    <option value="LORA">LORA</option>
                  </select>
                </div>
                <div className="w-full">
                  <Label htmlFor="Power_Supply">Nguồn cấp (V)</Label>
                  <select
                    id="Power_Supply"
                    {...register("Details_Value.Power_Supply" as const)}
                    className="w-full rounded-md border-none border-gray-600  px-3 py-2 text-sm shadow-sm **:cursor-pointer"
                  >
                    <option value="">Chọn nguồn cấp</option>
                    <option value="5">5V</option>
                    <option value="12">12V</option>
                    <option value="24">24V</option>
                    <option value="220">220V</option>
                    <option value="Pin">Pin</option>
                    <option value="Năng lượng mặt trời">Năng lượng mặt trời</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          <DrawerFooter className="flex justify-end gap-2 flex-row p-0 sticky bottom-0 bg-white pt-4 mt-4 z-10000 ">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setLatitude(21.028511);
                setLongitude(105.804817);
                setSelectedProjectCode("");
                setFilteredProjects([]);
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
      </DrawerContent>
    </Drawer>
  );
}
