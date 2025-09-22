import LogTable from "@/components/logs/LogTable";
import { useGetLogsQuery } from "@/services/log.service";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";

export default function LogsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Lấy các bộ lọc từ URL
  const [filters, setFilters] = useState({
    LogTypeId: searchParams.get("LogTypeId") || "",
    Method: searchParams.get("Method") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  });

  // Lấy thông tin phân trang từ URL
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 20;

  // Gọi API để lấy dữ liệu log
  const { data, isFetching } = useGetLogsQuery(
    { ...filters, page, pageSize },
    { refetchOnMountOrArgChange: true }
  );

  const logData = data?.Data.items || [];
  const totalRecords = data?.Data.total || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

  // Cập nhật bộ lọc khi URL thay đổi
  useEffect(() => {
    setFilters({
      LogTypeId: searchParams.get("LogTypeId") || "",
      Method: searchParams.get("Method") || "",
      startDate: searchParams.get("startDate") || "",
      endDate: searchParams.get("endDate") || "",
    });
  }, [searchParams]);

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set(key, value);
    } else {
      newSearchParams.delete(key);
    }
    newSearchParams.set("page", "1"); // Reset về trang đầu
    setSearchParams(newSearchParams);
  };

  const handleDateChange = (key: string, date: Date | undefined) => {
    const value = date ? format(date, "yyyy-MM-dd") : "";
    handleFilterChange(key, value);
  };

  const clearFilters = () => {
    setFilters({
      LogTypeId: "",
      Method: "",
      startDate: "",
      endDate: "",
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
              Loại log
            </label>
            <select
              value={filters.LogTypeId}
              onChange={(e) => handleFilterChange("LogTypeId", e.target.value)}
              className="w-full rounded-xl border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-gray-50 focus:ring-2 focus:ring-gray-50 cursor-pointer"
            >
              <option value="">Tất cả loại log</option>
              <option value="1">Lỗi Hệ Thống</option>
              <option value="2">Lỗi Người Dùng Nhập Liệu</option>
              <option value="3">Lỗi Thiết Bị</option>
              <option value="4">Xử Lý Thành Công</option>
              <option value="5">REQUEST_TO_APP</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Method
            </label>
            <input
              type="text"
              value={filters.Method}
              onChange={(e) => handleFilterChange("Method", e.target.value)}
              placeholder="Nhập Method"
              className="w-full rounded-xl border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                handleDateChange("startDate", parseDate(e.target.value))
              }
              className="w-full rounded-xl border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            />
          </div>


          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Ngày kết thúc
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                handleDateChange("endDate", parseDate(e.target.value))
              }
              className="w-full rounded-xl border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 rounded-xl bg-green-700 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-green-600 cursor-pointer"
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
          </button>
        </div>
      </div>
      </div>

      <LogTable
        logs={logData}
        isFetching={isFetching}
        currentPage={page}
        pageSize={pageSize}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
