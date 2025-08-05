import { Button } from "@/components/ui/button";
import { Pencil,Plus, Upload } from "lucide-react";
import type { Location} from "@/types/types";
import { format } from "date-fns";
import Pagination from "../Pagination";
import { useEffect, useState } from "react";
import { useGetLocationsQuery } from "@/services/location.service";
import { DeleteLocationButton } from "./DeleteLocationModal";
import { AddLocationModal } from "./AddLocationModal";
import { UpdateLocationModal } from "./UpdateLocationModal";
import { DrawerDetailLocation } from "./DrawerDetailLocaton";
import { ImportLocationModal } from "./ImportLocationModal";


export default function LocationTableView() {
  const { data, isFetching, refetch } = useGetLocationsQuery({});
  const locations = data?.Data ?? [];
  const [open, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const handleEdit = (id: number) => {
    setSelectedLocationId(id);
    setModalOpen(true);
  };
  useEffect(() => {
    refetch(); 
  }, [refetch]);
  const pageSize = 10;
  const totalPages = Math.ceil(locations.length / pageSize);
  const paginatedLocations = locations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const handleRowClick = (location: Location) => {
    setSelectedLocation(location);
    setDetailDrawerOpen(true);
  };
  if (isFetching) return <p className="text-center p-4">Đang tải dữ liệu...</p>;

  return (
    <div className="p-6 h-full w-full ">
      <div className="flex justify-end items-center mb-4 flex-wrap gap-2">
        <div className="flex gap-4 flex-wrap items-center justify-end">
          <Button
            variant="secondary"
            onClick={() => setOpen(true)}
            className="flex items-center gap-1 cursor-pointer hover:bg-gray-200"
          >
            <Upload size={16} /> Import
          </Button>

          <ImportLocationModal open={isOpen} onClose={() => setOpen(false)}  onSuccess={refetch}/>
          <Button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus size={16} /> Thêm khu vực
          </Button>
        </div>
      </div>

      <div className="overflow-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full text-sm text-left divide-y divide-gray-200">
          <thead className=" text-gray-900 uppercase text-xs font-bold">
            <tr>
              {[
                "Tên khu vực",
                "Số trạm",
                "Ngày tạo",
                "Hành động",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 text-nowrap font-semibold "
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedLocations.map((location: Location) => (
              <tr
                key={location.Id}
                className="hover:bg-gray-50 transition duration-200 cursor-pointer"
                
              >
                <td className="px-4 py-1" onClick={() => handleRowClick(location)}>{location.Name}</td>
                <td className="px-8 py-1 ">{location.TotalStations}</td>
                
                <td className="px-4 py-1">
                  {location.CreatedAt
                    ? format(new Date(location.CreatedAt), "HH:mm dd/MM/yyyy ")
                    : ""}
                </td>
                <td className="px-4 py-1 text-center">
                  <div className="flex  flex-wrap gap-1">
                    <Button
                      className="cursor-pointer"
                      size="icon"
                      variant="outline"
                      onClick={() => handleEdit(location.Id)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <DeleteLocationButton id={location.Id} refetch={refetch} />
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
      <AddLocationModal
        open={open}
        onClose={() => setIsOpen(false)}
        onSuccess={() => refetch()}
      />

      <UpdateLocationModal
        locationId={selectedLocationId}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          refetch();
          setModalOpen(false);
        }
        }
      />
      <DrawerDetailLocation
        open={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
        location={selectedLocation}
      />
    </div>
  );
}
