import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { Label } from "../ui/label";
import type { DeviceFormValue, DeviceType, Object } from "@/types/types";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

interface Sensor {
  code: string;
  name: string;
  unit: Record<string, string>;
  newUnitKey?: string;
  newUnitValue?: string;
}
import { toast } from "sonner";
import { useGetObjectQuery } from "@/services/object.service";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { useAddDeviceMutation } from "@/services/device.service";
import { useGetDeviceTypesQuery } from "@/services/devicetype.service";
import { Plus } from "lucide-react";

interface AddDeviceDrawProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const schema = yup.object().shape({
  Name: yup.string().required("Tên thiết bị là bắt buộc"),
  Code: yup.string().required("Mã thiết bị là bắt buộc"),
  DeviceType_Code: yup.string().required("Mã loại thiết bị là bắt buộc"),
  Object_Code: yup.string().required("Mã đối tượng là bắt buộc"),
  Series: yup.string().required("Series là bắt buộc"),
});

export default function AddDeviceDraw({
  open,
  onClose,
  onSuccess,
}: AddDeviceDrawProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<DeviceFormValue>({
    defaultValues: {
      Code: "",
      Name: "",
      DeviceType_Code: "",
      Object_Code: "",
      Series: "",
      Icon_Id: 0,
      Latitude: 21.028511,
      Longitude: 105.804817,
      Details_Data: { sensors: [] },
    },
    resolver: yupResolver(schema),
  });

  const { data: listType } = useGetDeviceTypesQuery({});
  const { data: listObject } = useGetObjectQuery({});
  const [addDevice, { isLoading }] = useAddDeviceMutation();

  const [sensors, setSensors] = useState<Sensor[]>([]);

  const selectedObjectCode = watch("Object_Code");
  const latitude = watch("Latitude");
  const longitude = watch("Longitude");

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
    setSensors([...sensors, { code: "", name: "", unit: {} }]);
  };

  const removeSensor = (index: number) => {
    setSensors(sensors.filter((_, i) => i !== index));
  };
  const objectOptions = listObject?.Data?.data?.map((p: Object) => ({
    value: p.Code,
    label: p.Name,
  })) || [];
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
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updated = [...sensors];
    updated[index].unit = { ...updated[index].unit, [name]: value };
    setSensors(updated);
  };

  const onSubmit = async (data: DeviceFormValue) => {
    try {
      const payload = {
        ...data,
        Details_Data: { sensors },
      };

      await addDevice(payload).unwrap();
      toast.success("Lưu thành công!");
      reset();
      setSensors([]);
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
            Thêm thiết bị
          </DrawerTitle>
        </DrawerHeader>

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
              className="text-sm text-black rounded-md border border-gray-50"
            />
            {errors.Object_Code && (
              <p className="text-sm text-red-600">
                {errors.Object_Code.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="Code">Mã thiết bị</Label>
            <Input id="Code" {...register("Code")} />
            {errors.Code && (
              <p className="text-sm text-red-600">{errors.Code.message}</p>
            )}

            <Label htmlFor="Name">Tên thiết bị</Label>
            <Input id="Name" {...register("Name")} />
            {errors.Name && (
              <p className="text-sm text-red-600">{errors.Name.message}</p>
            )}

            <Label htmlFor="Series">Series</Label>
            <Input id="Series" {...register("Series")} />
            {errors.Series && (
              <p className="text-sm text-red-600">{errors.Series.message}</p>
            )}
          </div>

          <div className="mt-1">
            <Label className="mb-2">Vị trí trên bản đồ</Label>
            <MapContainer
              center={[latitude || 21.028511, longitude || 105.804817]}
              zoom={13}
              style={{ height: "250px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <Marker
                position={[latitude || 21.028511, longitude || 105.804817]}
                icon={createCustomIcon}
              />
              <MapUpdater
                latitude={latitude || 21.028511}
                longitude={longitude || 105.804817}
              />
            </MapContainer>
          </div>

          <div className="space-y-4 p-4 border border-gray-200 rounded-md">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-900">
                Thông Tin Cảm Biến
              </h3>
              <Button type="button" onClick={addSensor}>
                <Plus />
                Thêm Cảm Biến
              </Button>
            </div>

            {sensors.map((sensor, index) => (
              <div
                key={index}
                className="space-y-2 p-4 border rounded-md bg-white relative"
              >
                <button
                  type="button"
                  onClick={() => removeSensor(index)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                >
                  &times;
                </button>

                <Label>Mã Cảm Biến</Label>
                <Input
                  type="text"
                  name="code"
                  value={sensor.code}
                  onChange={(e) => handleSensorChange(index, e)}
                />
                <Label>Tên Cảm Biến</Label>
                <Input
                  type="text"
                  name="name"
                  value={sensor.name}
                  onChange={(e) => handleSensorChange(index, e)}
                />

                <div className="mt-2 space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Đơn Vị</h4>

                  {Object.entries(sensor.unit).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 w-28">{key}</span>
                      <Input
                        type="text"
                        name={key}
                        value={value || ""}
                        onChange={(e) => handleUnitChange(index, e)}
                        className="flex-1 text-xs"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const updated = [...sensors];
                          const newUnit = { ...updated[index].unit };
                          delete newUnit[key];
                          updated[index].unit = newUnit;
                          setSensors(updated);
                        }}
                      >
                        Xóa
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Tên đơn vị (vd: temperature)"
                      value={sensor.newUnitKey || ""}
                      onChange={(e) => {
                        const updated = [...sensors];
                        updated[index].newUnitKey = e.target.value;
                        setSensors(updated);
                      }}
                      className="flex-1 text-xs"
                    />
                    <Input
                      type="text"
                      placeholder="Giá trị (vd: °C)"
                      value={sensor.newUnitValue || ""}
                      onChange={(e) => {
                        const updated = [...sensors];
                        updated[index].newUnitValue = e.target.value;
                        setSensors(updated);
                      }}
                      className="flex-1 text-xs"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        if (!sensor.newUnitKey || !sensor.newUnitValue) return;
                        const updated = [...sensors];
                        updated[index].unit = {
                          ...updated[index].unit,
                          [sensor.newUnitKey]: sensor.newUnitValue,
                        };
                        delete updated[index].newUnitKey;
                        delete updated[index].newUnitValue;
                        setSensors(updated);
                      }}
                    >
                      <Plus />
                      Thêm
                    </Button>
                  </div>
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
              {isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
