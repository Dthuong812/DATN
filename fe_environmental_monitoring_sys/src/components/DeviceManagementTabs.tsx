import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SensorDeviceTable from "./SensorDeviceTable";
import DeviceTypeTable from "./DeviceTypeTable";

export default function DeviceManagementTabs() {
  return (
    <Tabs defaultValue="device-types" className="w-full">
      <TabsList className="w-full p-0 justify-start border-b rounded-none bg-gray-50">
        <TabsTrigger
          value="device-types"
          className="text-md font-medium rounded-none  h-full data-[state=active]:shadow-none border border-transparent border-b-border data-[state=active]:border-border data-[state=active]:border-b-background -mb-[2px] rounded-t data-[state=active]:text-green-600"
        >
          Loại thiết bị
        </TabsTrigger>
        <TabsTrigger
          value="devices"
          className="text-md font-medium rounded-none  h-full data-[state=active]:shadow-none border border-transparent border-b-border data-[state=active]:border-border data-[state=active]:border-b-background -mb-[2px] rounded-t data-[state=active]:text-green-600"
        >
          Thiết bị
        </TabsTrigger>
      </TabsList>

      <TabsContent value="device-types">
        <DeviceTypeTable
          deviceTypes={[
            {
              id: 1,
              name: "Cảm biến nhiệt độ",
              description: "Đo nhiệt độ môi trường",
            },
            {
              id: 2,
              name: "Cảm biến ánh sáng",
              description: "Đo cường độ ánh sáng",
            },
            {
              id: 3,
              name: "Cảm biến mưa",
              description: "Nhận diện có mưa hay không",
            },
            {
              id: 4,
              name: "Thiết bị IoT",
              description: "Truyền dữ liệu từ cảm biến",
            },
            {
              id: 5,
              name: "Cảm biến độ ẩm",
              description: "Đo độ ẩm không khí",
            },
            {
              id: 6,
              name: "Thiết bị Gateway",
              description: "Truyền tín hiệu về máy chủ",
            },
          ]}
        />
      </TabsContent>

      <TabsContent value="devices">
        <SensorDeviceTable
          devices={[
            { id: 1, name: "DHT22", type: "Nhiệt độ", location: "Trạm A" },
            { id: 2, name: "BH1750", type: "Ánh sáng", location: "Trạm B" },
            { id: 3, name: "DHT22", type: "Nhiệt độ", location: "Trạm A" },
            { id: 4, name: "BH1750", type: "Ánh sáng", location: "Trạm B" },
            { id: 5, name: "DHT22", type: "Nhiệt độ", location: "Trạm A" },
            { id: 6, name: "BH1750", type: "Ánh sáng", location: "Trạm B" },
            { id: 7, name: "DHT22", type: "Nhiệt độ", location: "Trạm A" },
            { id: 8, name: "BH1750", type: "Ánh sáng", location: "Trạm B" },
            { id: 9, name: "DHT22", type: "Nhiệt độ", location: "Trạm A" },
            { id: 10, name: "BH1750", type: "Ánh sáng", location: "Trạm B" },
            { id: 11, name: "DHT22", type: "Nhiệt độ", location: "Trạm A" },
            { id: 12, name: "BH1750", type: "Ánh sáng", location: "Trạm B" },
            { id: 13, name: "DHT22", type: "Nhiệt độ", location: "Trạm A" },
            { id: 14, name: "BH1750", type: "Ánh sáng", location: "Trạm B" },
            { id: 15, name: "DHT22", type: "Nhiệt độ", location: "Trạm A" },
            { id: 16, name: "BH1750", type: "Ánh sáng", location: "Trạm B" },
            { id: 17, name: "DHT22", type: "Nhiệt độ", location: "Trạm A" },
            { id: 18, name: "BH1750", type: "Ánh sáng", location: "Trạm B" },
          ]}
        />
      </TabsContent>
    </Tabs>
  );
}
