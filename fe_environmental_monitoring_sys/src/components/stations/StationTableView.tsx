import { useGetStationsQuery } from "@/services/stations.service";
import { Button } from "@/components/ui/button";
import { Pencil, Map, Plus, Upload } from "lucide-react";
import type { Station } from "@/types/types";
import { format } from "date-fns";
import Pagination from "../Pagination";
import { useState } from "react";
import { AddStationModal } from "./AddStationModal";
import { DeleteStationButton } from "./DeleteStationButton";
import { UpdateStationModal } from "./UpdateStationModal";
import { ImportStationModal } from "./ImportStationModal";
import { DrawerDetailStation } from "./DrawerDetailStation";


export default function StationTableView({
  setViewMode,
}: {
  setViewMode: (mode: "map" | "table") => void;
}) {
  const { data, isFetching, refetch } = useGetStationsQuery({});
  const stations = data?.Data ?? [];
  const [open, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStationId, setSelectedStationId] = useState<number | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const handleEdit = (id: number) => {
    setSelectedStationId(id);
    setModalOpen(true);
  };
  const pageSize = 7;
  const totalPages = Math.ceil(stations.length / pageSize);
  const paginatedStations = stations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const handleRowClick = (station: Station) => {
    setSelectedStation(station);
    setDetailDrawerOpen(true);
  };
  if (isFetching) return <p className="text-center p-4">Đang tải dữ liệu...</p>;

  return (
    <div className="p-6 h-full w-full ">
      <div className="flex justify-end items-center mb-4 flex-wrap gap-2">
        <div className="flex gap-2 flex-wrap items-center justify-end">
          <Button
            variant="outline"
            onClick={() => setViewMode("map")}
            className="flex items-center gap-1 cursor-pointer"
          >
            <Map size={16} /> Xem bản đồ
          </Button>
          <Button
            variant="secondary"
            onClick={() => setOpen(true)}
            className="flex items-center gap-1 cursor-pointer hover:bg-gray-200"
          >
            <Upload size={16} /> Import
          </Button>

          <ImportStationModal open={isOpen} onClose={() => setOpen(false)} />
          <Button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus size={16} /> Thêm trạm
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full text-sm text-left divide-y divide-gray-200">
          <thead className=" text-gray-900 uppercase text-xs font-bold">
            <tr>
              {[
                "Tên trạm",
                "Địa chỉ",
                "Khu vực",
                "Kinh độ",
                "Vĩ độ",
                "Trạng thái",
                "Người tạo",
                "Ngày tạo",
                "Người sửa",
                "Ngày sửa",
                "Hành động",
              ].map((header) => (
                <th
                  key={header}
                  className="px-2 py-3 text-nowrap font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedStations.map((station: Station) => (
              <tr
                key={station.Id}
                className="hover:bg-gray-50 transition duration-200 cursor-pointer"
                
              >
                <td className="px-2 py-1" onClick={() => handleRowClick(station)}>{station.Name}</td>
                <td className="px-2 py-1 max-w-[140px] whitespace-normal break-words">
                  {station.Address}
                </td>
                <td className="px-2 py-1">{station.LocationId}</td>
                <td className="px-2 py-1">{station.Lat}</td>
                <td className="px-2 py-1">{station.Lng}</td>
                <td className="px-2 py-1">
                  <div className="flex items-center gap-1.5 justify-center ">
                    <span
                      className={`h-3 w-3 rounded-full ${
                        station.Status === 1 ? "bg-green-500" : "bg-gray-500"
                      }`}
                    ></span>
                  </div>
                </td>

                <td className="px-2 py-1">{station.CreatedBy}</td>
                <td className="px-2 py-1">
                  {station.CreatedAt
                    ? format(new Date(station.CreatedAt), "HH:mm dd/MM/yyyy ")
                    : ""}
                </td>
                <td className="px-2 py-1">{station.UpdatedBy}</td>
                <td className="px-2 py-1">
                  {station.UpdatedAt
                    ? format(new Date(station.UpdatedAt), "HH:mm dd/MM/yyyy ")
                    : ""}
                </td>
                <td className="px-2 py-1 text-center">
                  <div className="flex justify-center flex-wrap gap-1">
                    <Button
                      className="cursor-pointer"
                      size="icon"
                      variant="outline"
                      onClick={() => handleEdit(station.Id)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <DeleteStationButton id={station.Id} refetch={refetch} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
      <AddStationModal
        open={open}
        onClose={() => setIsOpen(false)}
        onSuccess={() => refetch()}
      />

      <UpdateStationModal
        stationId={selectedStationId}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      <DrawerDetailStation
        open={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
        station={selectedStation}
      />
    </div>
  );
}
