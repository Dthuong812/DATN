import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
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
import {
  useGetDeviceByIdQuery,
  useUpdateDeviceMutation,
} from "@/services/device.service";
import { useGetDeviceTypesQuery } from "@/services/devicetype.service";
import { useGetObjectQuery } from "@/services/object.service";
import type { DeviceFormValue, DeviceType, Object } from "@/types/types";
import { toast } from "sonner";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Plus } from "lucide-react";
import Select from "react-select";

const schema = yup.object().shape({
  Name: yup.string().required("Tên thiết bị là bắt buộc"),
  Code: yup.string().required("Mã thiết bị là bắt buộc"),
  DeviceType_Code: yup.string().required("Mã loại thiết bị là bắt buộc"),
  Object_Code: yup.string().required("Mã đối tượng là bắt buộc"),
  Series: yup.string().required("Series là bắt buộc"),
});

const createCustomIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapUpdater({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (latitude && longitude) {
      map.setView([latitude, longitude], map.getZoom());
    }
  }, [latitude, longitude, map]);
  return null;
}

interface Unit {
  key: string;
  value: string;
}

interface Sensor {
  code: string;
  name: string;
  units: Unit[];
}

interface UpdateDeviceDrawProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  deviceId: string;
}

export default function UpdateDeviceDraw({
  open,
  onClose,
  onSuccess,
  deviceId,
}: UpdateDeviceDrawProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<DeviceFormValue>({
    resolver: yupResolver(schema),
  });

  const { data: listType } = useGetDeviceTypesQuery({});
  const { data: listObject } = useGetObjectQuery({});
  const { data: deviceDetail, isFetching } = useGetDeviceByIdQuery(deviceId, {
    skip: !deviceId || !open,
  });
  const [updateDevice, { isLoading }] = useUpdateDeviceMutation();

  const [sensors, setSensors] = useState<Sensor[]>([]);

  const selectedObjectCode = watch("Object_Code");
  const latitude = watch("Latitude") || 21.028511;
  const longitude = watch("Longitude") || 105.804817;
  const objectOptions =
    listObject?.Data?.data?.map((p: Object) => ({
      value: p.Code,
      label: p.Name,
    })) || [];
  useEffect(() => {
    if (deviceDetail?.Data) {
      reset({ ...deviceDetail.Data });

      const sensorsFromApi =
        deviceDetail.Data?.Details_Data?.sensors?.map((s: any) => ({
          code: s.code,
          name: s.name,
          units: Object.entries(s.unit || {}).map(([k, v]) => ({
            key: k,
            value: v as string,
          })),
        })) || [];

      setSensors(sensorsFromApi);
    }
  }, [deviceDetail, reset]);

  useEffect(() => {
    if (selectedObjectCode && listObject?.Data?.data) {
      const selectedObject = listObject.Data.data.find(
        (obj: Object) => obj.Code === selectedObjectCode
      );
      if (selectedObject) {
        setValue("Latitude", selectedObject.Latitude || 0);
        setValue("Longitude", selectedObject.Longitude || 0);
      }
    }
  }, [selectedObjectCode, listObject, setValue]);

  const addSensor = () => {
    setSensors([...sensors, { code: "", name: "", units: [] }]);
  };

  const removeSensor = (index: number) => {
    setSensors(sensors.filter((_, i) => i !== index));
  };

  const handleSensorChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updated = [...sensors];
    updated[index] = { ...updated[index], [name]: value };
    setSensors(updated);
  };

  const handleUnitChange = (
    sensorIndex: number,
    unitIndex: number,
    field: "key" | "value",
    value: string
  ) => {
    const updated = [...sensors];
    updated[sensorIndex].units[unitIndex][field] = value;
    setSensors(updated);
  };

  const addUnit = (sensorIndex: number) => {
    const updated = [...sensors];
    updated[sensorIndex].units.push({ key: "", value: "" });
    setSensors(updated);
  };

  const removeUnit = (sensorIndex: number, unitIndex: number) => {
    const updated = [...sensors];
    updated[sensorIndex].units.splice(unitIndex, 1);
    setSensors(updated);
  };

  const onSubmit = async (data: DeviceFormValue) => {
    try {
      const { CreatedBy, CreatedAt, UpdatedBy, DeletedAt, ...filteredData } =
        data;
      const sensorsPayload = sensors.map((s) => ({
        code: s.code,
        name: s.name,
        unit: s.units.reduce(
          (acc, u) => ({ ...acc, [u.key]: u.value }),
          {} as Record<string, string>
        ),
      }));

      await updateDevice({
        id: deviceId,
        ...filteredData,
        Details_Data: { sensors: sensorsPayload },
      }).unwrap();

      toast.success("Cập nhật thành công!");
      reset();
      setSensors([]);
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
            Cập nhật thiết bị
          </DrawerTitle>
        </DrawerHeader>

        {isFetching ? (
          <p className="text-center">Đang tải...</p>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 overflow-auto scrollbar-hide px-2 "
          >
            <div className="grid gap-2">
              <Label htmlFor="DeviceType_Code">Mã loại thiết bị</Label>
              <select
                id="DeviceType_Code"
                {...register("DeviceType_Code")}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">-- Chọn mã loại thiết bị --</option>
                {listType?.Data?.map((p: DeviceType) => (
                  <option key={p.Code} value={p.Code}>
                    {p.Name}
                  </option>
                ))}
              </select>
              {errors.DeviceType_Code && (
                <p className="text-sm text-red-600">
                  {errors.DeviceType_Code.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="Object_Code">Mã đối tượng</Label>
              <Select
                className="w-full !rounded-md !border-none bg-background text-sm"
                id="Object_Code"
                options={objectOptions}
                onChange={(selectedOption) => {
                  setValue("Object_Code", selectedOption?.value || "");
                }}
                value={
                  objectOptions.find(
                    (option) => option.value === watch("Object_Code")
                  ) || null
                }
                placeholder="-- Chọn mã đối tượng --"
                classNamePrefix="react-select"
                isClearable
              />
              {errors.Object_Code && (
                <p className="text-sm text-red-600">
                  {errors.Object_Code.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="Code">Mã thiết bị</Label>
              <Input id="Code" {...register("Code")} disabled />
              {errors.Code && (
                <p className="text-sm text-red-600">{errors.Code.message}</p>
              )}

              <Label htmlFor="Name">Tên thiết bị</Label>
              <Input id="Name" {...register("Name")} />

              <Label htmlFor="Series">Series</Label>
              <Input id="Series" {...register("Series")} />
            </div>

            <div className="mt-1">
              <Label className="mb-2">Vị trí trên bản đồ</Label>
              <MapContainer
                center={[latitude, longitude]}
                zoom={13}
                style={{ height: "250px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Marker
                  position={[latitude, longitude]}
                  icon={createCustomIcon}
                />
                <MapUpdater latitude={latitude} longitude={longitude} />
              </MapContainer>
            </div>

            <div className="space-y-4 p-4 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">
                  Thông Tin Cảm Biến
                </h3>
                <Button type="button" onClick={addSensor}>
                  <Plus /> Thêm Cảm Biến
                </Button>
              </div>

              {sensors.map((sensor, sIndex) => (
                <div
                  key={sIndex}
                  className="space-y-2 p-4 border rounded-md bg-white relative"
                >
                  <button
                    type="button"
                    onClick={() => removeSensor(sIndex)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    &times;
                  </button>

                  <Label>Mã Cảm Biến</Label>
                  <Input
                    type="text"
                    name="code"
                    value={sensor.code}
                    onChange={(e) => handleSensorChange(sIndex, e)}
                  />

                  <Label>Tên Cảm Biến</Label>
                  <Input
                    type="text"
                    name="name"
                    value={sensor.name}
                    onChange={(e) => handleSensorChange(sIndex, e)}
                  />

                  <div className="mt-2 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      Đơn Vị
                    </h4>
                    {sensor.units.map((unit, uIndex) => (
                      <div key={uIndex} className="flex items-center gap-2">
                        <Input
                          type="text"
                          value={unit.key}
                          onChange={(e) =>
                            handleUnitChange(
                              sIndex,
                              uIndex,
                              "key",
                              e.target.value
                            )
                          }
                          className="w-28 text-xs"
                          placeholder="Tên đơn vị"
                        />
                        <Input
                          type="text"
                          value={unit.value}
                          onChange={(e) =>
                            handleUnitChange(
                              sIndex,
                              uIndex,
                              "value",
                              e.target.value
                            )
                          }
                          className="flex-1 text-xs"
                          placeholder="Giá trị"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeUnit(sIndex, uIndex)}
                        >
                          Xóa
                        </Button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addUnit(sIndex)}
                    >
                      <Plus /> Thêm đơn vị
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <DrawerFooter className="flex justify-end gap-2 flex-row p-0 sticky bottom-0 bg-white pt-4 mt-4">
              <Button
                className="cursor-pointer"
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setSensors([]);
                  onClose();
                }}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-800 hover:bg-green-700 cursor-pointer"
              >
                {isLoading ? "Đang lưu..." : "Cập nhật"}
              </Button>
            </DrawerFooter>
          </form>
        )}
      </DrawerContent>
    </Drawer>
  );
}
