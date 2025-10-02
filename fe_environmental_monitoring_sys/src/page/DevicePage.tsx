import AddDeviceDraw from "@/components/devices/AddDeviceDraw";
import DeviceTable from "@/components/devices/DeviceTable";
import MapDraw from "@/components/devices/MapDraw";
import DeviceTypeTable from "@/components/devicetype/DeviceTypeTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetDevicesQuery } from "@/services/device.service";
import { useGetDeviceTypesQuery } from "@/services/devicetype.service";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function DevicePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setIsOpen] = useState(false);
  const [isDrawOpen, setIsDrawOpen] = useState(false);

  const [filters, setFilters] = useState({
    Code: searchParams.get("Code") || "",
    Name: searchParams.get("Name") || "",
    DeviceType_Code: searchParams.get("DeviceType_Code") || "",
    Object_Code: searchParams.get("Object_Code") || "",
    Series: searchParams.get("Series") || "",
  });
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 20;
  const { data, isFetching:isDevicesFetching ,refetch} = useGetDevicesQuery(
    {
      ...filters,
      page,
      pageSize,
    },
    { refetchOnMountOrArgChange: true }
  );
  const devices = data?.Data?.data || [];
  const totalRecords = data?.Data?.total || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const { data: deviceType, isFetching: isDeviceTypesFetching } = useGetDeviceTypesQuery({});
  const typeData = deviceType?.Data || [];
  useEffect(() => {
    setFilters({
      Code: searchParams.get("Code") || "",
      Name: searchParams.get("Name") || "",
      DeviceType_Code: searchParams.get("DeviceType_Code") || "",
      Object_Code: searchParams.get("Object_Code") || "",
      Series: searchParams.get("Series") || "",
    });
  }, [searchParams]);
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set(key, value);
    } else {
      newSearchParams.delete(key);
    }
    newSearchParams.set("page", "1");
    setSearchParams(newSearchParams);
  };
  const clearFilters = () => {
    setFilters({
      Code: "",
      Name: "",
      DeviceType_Code: "",
      Object_Code: "",
      Series: "",
    });
    setSearchParams({ page: "1", pageSize: pageSize.toString() });
  };
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", newPage.toString());
    setSearchParams(newSearchParams);
  };
  const handlePageSizeChange = (newSize: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("pageSize", newSize);
    newSearchParams.set("page", "1");
    setSearchParams(newSearchParams);
  };
  return (
    <div className="max-w-8xl px-6 pt-8 pb-6 mx-auto h-full overflow-auto scrollbar-hide">
      <Tabs defaultValue="devices" className="w-full">
        <TabsList className="w-full p-0 justify-start border-b rounded-none bg-gray-50">
          <TabsTrigger
            value="devices"
            className="text-md font-medium rounded-none  h-full data-[state=active]:shadow-none border border-transparent border-b-border data-[state=active]:border-border data-[state=active]:border-b-background -mb-[2px] rounded-t data-[state=active]:text-green-600"
          >
            Thiết bị
          </TabsTrigger>
          <TabsTrigger
            value="device-types"
            className="text-md font-medium rounded-none  h-full data-[state=active]:shadow-none border border-transparent border-b-border data-[state=active]:border-border data-[state=active]:border-b-background -mb-[2px] rounded-t data-[state=active]:text-green-600"
          >
            Loại thiết bị
          </TabsTrigger>
        </TabsList>

        <TabsContent value="device-types">
        <DeviceTypeTable
            deviceType={typeData}
            isFetching={isDeviceTypesFetching}
        />
      </TabsContent>

        <TabsContent value="devices">
          <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
            <div className="space-y-4 ">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
                <div>
                  <Label className="mb-1 block text-sm font-medium text-gray-600">
                    Mã thiết bị
                  </Label>
                  <Input
                    type="text"
                    value={filters.Code}
                    onChange={(e) => handleFilterChange("Code", e.target.value)}
                    placeholder="Nhập Code"
                    className="w-full border-none bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
                <div>
                  <Label className="mb-1 block text-sm font-medium text-gray-600">
                    Tên thiết bị
                  </Label>
                  <Input
                    type="text"
                    value={filters.Name}
                    onChange={(e) => handleFilterChange("Name", e.target.value)}
                    placeholder="Nhập tên thiết bị"
                    className="w-ful border-none bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
                <div>
                  <Label className="mb-1 block text-sm font-medium text-gray-600">
                    Mã loại thiết bị
                  </Label>
                  <Input
                    type="text"
                    value={filters.DeviceType_Code}
                    onChange={(e) =>
                      handleFilterChange("DeviceType_Code", e.target.value)
                    }
                    placeholder="Nhập mã loại thiết bị"
                    className="w-full border-none bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
                <div>
                  <Label className="mb-1 block text-sm font-medium text-gray-600">
                    Mã đối tượng
                  </Label>
                  <Input
                    type="text"
                    value={filters.Object_Code}
                    onChange={(e) =>
                      handleFilterChange("Object_Code", e.target.value)
                    }
                    placeholder="Nhập mã đối tượng"
                    className="w-ful border-none bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
                <div>
                  <Label className="mb-1 block text-sm font-medium text-gray-600">
                    Series
                  </Label>
                  <Input
                    type="text"
                    value={filters.Series}
                    onChange={(e) =>
                      handleFilterChange("Series", e.target.value)
                    }
                    placeholder="Nhập mã series"
                    className="w-ful border-none bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button
                  className="bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                  onClick={() => setIsDrawOpen(true)}
                >
                  Xem bản đồ
                </Button>
                <Button
                  className="bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                  onClick={() => setIsOpen(true)}
                >
                  Thêm thiết bị
                </Button>
                <Button
                  onClick={clearFilters}
                  className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Xóa bộ lọc
                </Button>
              </div>
            </div>
          </div>
          <DeviceTable
            devices={devices}
            isFetching={isDevicesFetching}
            currentPage={page}
            pageSize={pageSize}
            totalPages={totalPages}
            totalRecords={totalRecords}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </TabsContent>
      </Tabs>
      <AddDeviceDraw
        open={open}
        onClose={() => setIsOpen(false)}
        onSuccess={() => refetch()}
      />
      <MapDraw
        data={devices}
        open={isDrawOpen}
        onClose={() => setIsDrawOpen(false)}
      />
    </div>
  );
}
