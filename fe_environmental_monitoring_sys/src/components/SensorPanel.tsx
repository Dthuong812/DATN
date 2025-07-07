import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";

interface Station {
  id: string;
  name: string;
}

interface SensorData {
  id: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  stationId: string;
}
const ITEMS_PER_PAGE = 17;
const stations: Station[] = [
  { id: "station1", name: "Trạm Thanh Xuân" },
  { id: "station2", name: "Trạm Hai Bà Trưng" },
  { id: "station3", name: "Trạm Cầu Giấy" },
];

const sensorData: SensorData[] = [
  {
    id: "1",
    timestamp: "2025-07-07 10:00:00",
    temperature: 30,
    humidity: 70,
    stationId: "station1",
  },
  {
    id: "2",
    timestamp: "2025-07-07 10:05:00",
    temperature: 31,
    humidity: 68,
    stationId: "station1",
  },
  {
    id: "3",
    timestamp: "2025-07-07 10:10:00",
    temperature: 29,
    humidity: 71,
    stationId: "station2",
  },
  {
    id: "4",
    timestamp: "2025-07-07 10:00:00",
    temperature: 30,
    humidity: 70,
    stationId: "station1",
  },
  {
    id: "5",
    timestamp: "2025-07-07 10:05:00",
    temperature: 31,
    humidity: 68,
    stationId: "station1",
  },
  {
    id: "6",
    timestamp: "2025-07-07 10:10:00",
    temperature: 29,
    humidity: 71,
    stationId: "station2",
  },
  {
    id: "7",
    timestamp: "2025-07-07 10:00:00",
    temperature: 30,
    humidity: 70,
    stationId: "station1",
  },
  {
    id: "8",
    timestamp: "2025-07-07 10:05:00",
    temperature: 31,
    humidity: 68,
    stationId: "station1",
  },
  {
    id: "9",
    timestamp: "2025-07-07 10:10:00",
    temperature: 29,
    humidity: 71,
    stationId: "station2",
  },
  {
    id: "10",
    timestamp: "2025-07-07 10:00:00",
    temperature: 30,
    humidity: 70,
    stationId: "station1",
  },
  {
    id: "11",
    timestamp: "2025-07-07 10:05:00",
    temperature: 31,
    humidity: 68,
    stationId: "station1",
  },
  {
    id: "12",
    timestamp: "2025-07-07 10:10:00",
    temperature: 29,
    humidity: 71,
    stationId: "station2",
  },
  {
    id: "13",
    timestamp: "2025-07-07 10:00:00",
    temperature: 30,
    humidity: 70,
    stationId: "station1",
  },
  {
    id: "14",
    timestamp: "2025-07-07 10:05:00",
    temperature: 31,
    humidity: 68,
    stationId: "station1",
  },
  {
    id: "15",
    timestamp: "2025-07-07 10:10:00",
    temperature: 29,
    humidity: 71,
    stationId: "station2",
  },
  {
    id: "16",
    timestamp: "2025-07-07 10:00:00",
    temperature: 30,
    humidity: 70,
    stationId: "station1",
  },
  {
    id: "17",
    timestamp: "2025-07-07 10:05:00",
    temperature: 31,
    humidity: 68,
    stationId: "station1",
  },
  {
    id: "18",
    timestamp: "2025-07-07 10:10:00",
    temperature: 29,
    humidity: 71,
    stationId: "station2",
  },
  {
    id: "19",
    timestamp: "2025-07-07 10:00:00",
    temperature: 30,
    humidity: 70,
    stationId: "station1",
  },
  {
    id: "20",
    timestamp: "2025-07-07 10:05:00",
    temperature: 31,
    humidity: 68,
    stationId: "station1",
  },
  {
    id: "21",
    timestamp: "2025-07-07 10:10:00",
    temperature: 29,
    humidity: 71,
    stationId: "station2",
  },
  {
    id: "22",
    timestamp: "2025-07-07 10:00:00",
    temperature: 30,
    humidity: 70,
    stationId: "station1",
  },
  {
    id: "23",
    timestamp: "2025-07-07 10:05:00",
    temperature: 31,
    humidity: 68,
    stationId: "station1",
  },
  {
    id: "24",
    timestamp: "2025-07-07 10:10:00",
    temperature: 29,
    humidity: 71,
    stationId: "station2",
  },
  {
    id: "25",
    timestamp: "2025-07-07 10:10:00",
    temperature: 29,
    humidity: 71,
    stationId: "station2",
  },
  {
    id: "26",
    timestamp: "2025-07-07 10:00:00",
    temperature: 30,
    humidity: 70,
    stationId: "station1",
  },
  {
    id: "27",
    timestamp: "2025-07-07 10:05:00",
    temperature: 31,
    humidity: 68,
    stationId: "station1",
  },
  {
    id: "28",
    timestamp: "2025-07-07 10:10:00",
    temperature: 29,
    humidity: 71,
    stationId: "station2",
  },
  {
    id: "29",
    timestamp: "2025-07-07 10:00:00",
    temperature: 30,
    humidity: 70,
    stationId: "station1",
  },
  {
    id: "30",
    timestamp: "2025-07-07 10:05:00",
    temperature: 31,
    humidity: 68,
    stationId: "station1",
  },
  {
    id: "31",
    timestamp: "2025-07-07 10:10:00",
    temperature: 29,
    humidity: 71,
    stationId: "station2",
  },
  {
    id: "32",
    timestamp: "2025-07-07 10:00:00",
    temperature: 30,
    humidity: 70,
    stationId: "station1",
  },
  {
    id: "33",
    timestamp: "2025-07-07 10:05:00",
    temperature: 31,
    humidity: 68,
    stationId: "station1",
  },
  {
    id: "34",
    timestamp: "2025-07-07 10:10:00",
    temperature: 29,
    humidity: 71,
    stationId: "station2",
  },
  
  {
    id: "35",
    timestamp: "2025-07-07 10:10:00",
    temperature: 29,
    humidity: 71,
    stationId: "station2",
  },
  {
    id: "36",
    timestamp: "2025-07-07 10:00:00",
    temperature: 30,
    humidity: 70,
    stationId: "station1",
  },
  {
    id: "37",
    timestamp: "2025-07-07 10:05:00",
    temperature: 31,
    humidity: 68,
    stationId: "station1",
  },
  {
    id: "38",
    timestamp: "2025-07-07 10:10:00",
    temperature: 29,
    humidity: 71,
    stationId: "station2",
  },
  {
    id: "39",
    timestamp: "2025-07-07 10:00:00",
    temperature: 30,
    humidity: 70,
    stationId: "station1",
  },
  {
    id: "40",
    timestamp: "2025-07-07 10:05:00",
    temperature: 31,
    humidity: 68,
    stationId: "station1",
  },
  {
    id: "41",
    timestamp: "2025-07-07 10:10:00",
    temperature: 29,
    humidity: 71,
    stationId: "station2",
  },
  {
    id: "42",
    timestamp: "2025-07-07 10:00:00",
    temperature: 30,
    humidity: 70,
    stationId: "station1",
  },
  {
    id: "43",
    timestamp: "2025-07-07 10:05:00",
    temperature: 31,
    humidity: 68,
    stationId: "station1",
  },
  {
    id: "44",
    timestamp: "2025-07-07 10:10:00",
    temperature: 29,
    humidity: 71,
    stationId: "station2",
  },
  {
    id: "45",
    timestamp: "2025-07-07 10:05:00",
    temperature: 31,
    humidity: 68,
    stationId: "station1",
  },
  {
    id: "46",
    timestamp: "2025-07-07 10:10:00",
    temperature: 29,
    humidity: 71,
    stationId: "station2",
  },
  {
    id: "47",
    timestamp: "2025-07-07 10:00:00",
    temperature: 30,
    humidity: 70,
    stationId: "station1",
  },
  {
    id: "48",
    timestamp: "2025-07-07 10:05:00",
    temperature: 31,
    humidity: 68,
    stationId: "station1",
  },
  {
    id: "49",
    timestamp: "2025-07-07 10:10:00",
    temperature: 29,
    humidity: 71,
    stationId: "station2",
  },
  {
    id: "50",
    timestamp: "2025-07-07 10:10:00",
    temperature: 29,
    humidity: 71,
    stationId: "station2",
  },
  {
    id: "51",
    timestamp: "2025-07-07 10:10:00",
    temperature: 29,
    humidity: 71,
    stationId: "station2",
  },
];

export default function SensorPanel() {
  const [selectedStationId, setSelectedStationId] =
    useState<string>("station1");
  const [search] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredStations = stations.filter((station) =>
    station.name.toLowerCase().includes(search.toLowerCase())
  );

  const currentSensorData = sensorData.filter(
    (data) => data.stationId === selectedStationId
  );

  // Reset page về 1 khi đổi trạm
  const handleStationChange = (value: string) => {
    setSelectedStationId(value);
    setCurrentPage(1);
  };

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = currentSensorData.slice(
    startIdx,
    startIdx + ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(currentSensorData.length / ITEMS_PER_PAGE);

  return (
    <Card className="border shadow rounded-xl h-full md:min-h-[61px] bg-white">
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Chọn trạm
            </label>
            <Select
              value={selectedStationId}
              onValueChange={handleStationChange}
            >
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Chọn trạm" />
              </SelectTrigger>
              <SelectContent>
                {filteredStations.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-auto rounded-lg border shadow-sm p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thời gian</TableHead>
                <TableHead>Nhiệt độ (°C)</TableHead>
                <TableHead>Độ ẩm (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((data) => (
                <TableRow key={data.id}>
                  <TableCell>{data.timestamp}</TableCell>
                  <TableCell>{data.temperature}</TableCell>
                  <TableCell>{data.humidity}</TableCell>
                </TableRow>
              ))}
              {paginatedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    Không có dữ liệu cho trạm này
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              ← Trang trước
            </Button>
            <span className="text-sm text-gray-600">
              Trang {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Trang sau →
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
