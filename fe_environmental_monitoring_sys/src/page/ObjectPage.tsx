import AddObjectDraw from "@/components/objects/AddObjectDraw";
import MapDraw from "@/components/objects/MapDraw";
import ObjectTable from "@/components/objects/ObjectTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetObjectQuery } from "@/services/object.service";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function ObjectPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setIsOpen] = useState(false);
  const [isDrawOpen, setIsDrawOpen] = useState(false);

  const [filters, setFilters] = useState({
    Code: searchParams.get("Code") || "",
    Name: searchParams.get("Name") || "",
    Organization_Code: searchParams.get("Organization_Code") || "",
    Project_Code: searchParams.get("Project_Code") || "",
    Status: searchParams.get("Status") || "",
    Address: searchParams.get("Address") || "",
    Connection_Type: searchParams.get("Connection_Type") || "",
    Installation_Date: searchParams.get("Installation_Date") || "",
    Last_Maintenance_Date: searchParams.get("Last_Maintenance_Date") || "",
  });
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 20;

  const { data, isFetching, refetch } = useGetObjectQuery(
    { ...filters, page, pageSize },
    { refetchOnMountOrArgChange: true }
  );
  const objectData = data?.Data.data || [];
  const totalRecords = data?.Data.total || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);
  useEffect(() => {
    setFilters({
      Code: searchParams.get("Code") || "",
      Name: searchParams.get("Name") || "",
      Organization_Code: searchParams.get("Organization_Code") || "",
      Project_Code: searchParams.get("Project_Code") || "",
      Connection_Type: searchParams.get("Connection_Type") || "",
      Status: searchParams.get("Status") || "",
      Address: searchParams.get("Address") || "",
      Installation_Date: searchParams.get("Installation_Date") || "",
      Last_Maintenance_Date: searchParams.get("Last_Maintenance_Date") || "",
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
  const handleDateChange = (key: string, date: Date | undefined) => {
    const value = date ? format(date, "yyyy-MM-dd") : "";
    handleFilterChange(key, value);
  };
  const clearFilters = () => {
    setFilters({
      Code: "",
      Name: "",
      Organization_Code: "",
      Project_Code: "",
      Status: "",
      Address: "",
      Connection_Type: "",
      Installation_Date: "",
      Last_Maintenance_Date: "",
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

  const parseDate = (dateString: string) => {
    return dateString ? new Date(dateString) : undefined;
  };
  return (
    <div className="max-w-8xl mx-auto p-6 space-y-4">
      <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="space-y-4 ">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Code
              </label>
              <Input
                type="text"
                value={filters.Code}
                onChange={(e) => handleFilterChange("Code", e.target.value)}
                placeholder="Nhập Code"
                className="w-full border-none bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Tên đối tượng
              </label>
              <Input
                type="text"
                value={filters.Name}
                onChange={(e) => handleFilterChange("Name", e.target.value)}
                placeholder="Nhập tên đối tượng"
                className="w-ful border-none bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Mã công ty
              </label>
              <Input
                type="text"
                value={filters.Organization_Code}
                onChange={(e) =>
                  handleFilterChange("Organization_Code", e.target.value)
                }
                placeholder="Nhập mã công ty"
                className="w-full border-none bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Mã dự án
              </label>
              <Input
                type="text"
                value={filters.Project_Code}
                onChange={(e) =>
                  handleFilterChange("Project_Code", e.target.value)
                }
                placeholder="Nhập mã dự án"
                className="w-ful border-none bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Trạng thái
              </label>
              <select
                value={filters.Status}
                onChange={(e) => handleFilterChange("Status", e.target.value)}
                className="w-full rounded-md border-gray-300  bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-gray-50 focus:ring-2 focus:ring-gray-50 cursor-pointer"
              >
                <option value="">Tất cả </option>
                <option value="1">Hoạt động</option>
                <option value="2">Không hoạt động</option>
                <option value="3">Bảo trì</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Loại kết nối
              </label>
              <select
                value={filters.Connection_Type}
                onChange={(e) =>
                  handleFilterChange("Connection_Type", e.target.value)
                }
                className="w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-gray-50 focus:ring-2 focus:ring-gray-50 cursor-pointer"
              >
                <option value="">Tất cả </option>
                <option value="4G">4G</option>
                <option value="WIFI">WIFI</option>
                <option value="LORA">LORA</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Ngày cài đặt
              </label>
              <Input
                type="date"
                value={filters.Installation_Date}
                onChange={(e) =>
                  handleDateChange(
                    "Installation_Date",
                    parseDate(e.target.value)
                  )
                }
                className="w-ful border-none bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Ngày bảo trì
              </label>
              <Input
                type="date"
                value={filters.Last_Maintenance_Date}
                onChange={(e) =>
                  handleDateChange(
                    "Last_Maintenance_Date",
                    parseDate(e.target.value)
                  )
                }
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
              Thêm đối tượng
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
      <ObjectTable
        objects={objectData}
        isFetching={isFetching}
        currentPage={page}
        pageSize={pageSize}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      ></ObjectTable>
      <AddObjectDraw
        open={open}
        onClose={() => setIsOpen(false)}
        onSuccess={() => refetch()}
      />
      <MapDraw
        data={objectData}
        open={isDrawOpen}
        onClose={() => setIsDrawOpen(false)}
      />
    </div>
  );
}
