import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useGetObjectQuery } from "@/services/object.service";
import { Button } from "@/components/ui/button";
import {
    useLazyGetBaoCaoViewQuery,
    useLazyGetBaoCaoSummaryQuery,
  //   useGetBaoCaoPDFQuery,
  //   useGetBaoCaoSummaryPDFQuery,
} from "@/services/baocao.service";
import type { Object } from "@/types/types";
import TableReport from "@/components/report/TableReport";
import { apiURL } from "@/store/AxiosCustom";

export default function ReportPage() {
  const [reportType, setReportType] = useState("summary");
  const [filters, setFilters] = useState({
    objectCode: "",
    startTime: "",
    endTime: "",
  });

  const { data: objectData } = useGetObjectQuery({});
  const [getBaoCaoView, { data: baoCaoView }] = useLazyGetBaoCaoViewQuery();
  const [getBaoCaoSummary, { data: baoCaoSummary }] =
    useLazyGetBaoCaoSummaryQuery();

  const handleViewReport = () => {
    if (reportType === "view") {
      getBaoCaoView({
        startTime: filters.startTime,
        endTime: filters.endTime,
      });
    } else {
      getBaoCaoSummary({
        objectCode: filters.objectCode,
        startTime: filters.startTime,
        endTime: filters.endTime,
      });
    }
  };
  const handleExportReport = () => {
    if (!filters.startTime || !filters.endTime) {
      alert("Vui lòng chọn khoảng thời gian!");
      return;
    }
    if (reportType === "summary" && !filters.objectCode) {
      alert("Vui lòng chọn trạm để xuất báo cáo!");
      return;
    }
  
    const base = apiURL.defaults.baseURL;
    let url = "";
  
    if (reportType === "summary") {
      url = `${base}baocao/export?objectCode=${filters.objectCode}&from=${filters.startTime}&to=${filters.endTime}`;
    } else {
      url = `${base}baocao/vuot-nguong?from=${filters.startTime}&to=${filters.endTime}`;
    }

    const token = localStorage.getItem("token");
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi tải file PDF");
        return res.blob();
      })
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download =
          reportType === "summary"
            ? "baocao_tongquan.pdf"
            : "baocao_vuotnguong.pdf";
        link.click();
        URL.revokeObjectURL(link.href);
      })
      .catch((err) => {
        console.error(err);
        alert("Không thể tải file PDF");
      });
  };
  return (
    <div className="max-w-8xl mx-auto py-8 flex flex-row h-screen">
      <div className="w-1/5 p-8 rounded-lg shadow-md mr-4 flex flex-col gap-4 mt-[-30px]">
        <div className="flex flex-col gap-2 ">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Loại báo cáo
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-gray-50 focus:ring-2 focus:ring-gray-50 cursor-pointer"
          >
            <option value="summary">Báo cáo tổng quan từng trạm</option>
            <option value="view">Báo cáo vượt ngưỡng</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Từ ngày
          </label>
          <Input
            type="datetime-local"
            value={filters.startTime}
            onChange={(e) =>
              setFilters((p) => ({ ...p, startTime: e.target.value }))
            }
            className="w-full border-none bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Đến ngày
          </label>
          <Input
            type="datetime-local"
            value={filters.endTime}
            onChange={(e) =>
              setFilters((p) => ({ ...p, endTime: e.target.value }))
            }
            className="w-full border-none bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          />
        </div>

        {reportType === "summary" && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Chọn trạm
            </label>
            <select
              value={filters.objectCode}
              onChange={(e) =>
                setFilters((p) => ({ ...p, objectCode: e.target.value }))
              }
              className="w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-gray-50 focus:ring-2 focus:ring-gray-50 cursor-pointer"
            >
              <option value="">Chọn trạm</option>
              {objectData?.Data?.data.map((obj: Object) => (
                <option key={obj.Code} value={obj.Code}>
                  {obj.Name} ({obj.Code})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleViewReport}
          >
            Xem báo cáo
          </Button>
          <Button className="bg-green-700 text-white" onClick={handleExportReport}>Xuất PDF</Button>
        </div>
      </div>
      <TableReport
        data={reportType === "view" ? baoCaoView?.results : baoCaoSummary}
      />
    </div>
  );
}
