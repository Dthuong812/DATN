import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Station } from "@/types/types";
import Pagination from "../Pagination";
import { useState } from "react";

interface TableDetailStationProps {
  stations: Station[];
  onStationClick?: (lat: number, lng: number) => void;
}
export default function TableDetailStation({
  stations,
  onStationClick,
}: TableDetailStationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(stations.length / pageSize);
  const paginatedStation = stations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-full">
      <div className="w-full border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">STT</TableHead>
              <TableHead>Tên Trạm</TableHead>
              <TableHead>Địa Chỉ</TableHead>
              <TableHead>Vĩ Độ</TableHead>
              <TableHead>Kinh Độ</TableHead>
              <TableHead>Trạng Thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStation.map((station, index) => (
              <TableRow key={station.Id} className="odd:bg-muted/50">
                <TableCell className="pl-4">
                  {(currentPage - 1) * pageSize + index + 1}
                </TableCell>
                <TableCell
                  className="font-medium cursor-pointer "
                  onClick={() => onStationClick?.(station.Lat, station.Lng)}
                >
                  {station.Name}
                </TableCell>

                <TableCell>{station.Address}</TableCell>
                <TableCell>{station.Lat}</TableCell>
                <TableCell>{station.Lng}</TableCell>
                <TableCell>{station.Status ? "Hoạt động" : ""}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
