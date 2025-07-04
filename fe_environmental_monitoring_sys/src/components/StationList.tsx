export default function StationList() {
    const stations = [
      { name: "Trạm Trung tâm Hà Nội", location: "Hoàn Kiếm, Hà Nội", status: "Hoạt động" },
      { name: "Trạm Cầu Giấy", location: "Cầu Giấy, Hà Nội", status: "Hoạt động" },
      { name: "Trạm Trung tâm Hà Nội", location: "Hoàn Kiếm, Hà Nội", status: "Hoạt động" },
      { name: "Trạm Thanh Xuân", location: "Thanh Xuân, Hà Nội", status: "Bảo trì" },
      { name: "Trạm Thanh Xuân", location: "Thanh Xuân, Hà Nội", status: "Bảo trì" },
    ];
  
    return (
      <div className="space-y-4 border rounded-xl p-4 bg-white shadow">
        <h2 className="font-semibold flex items-center gap-2 text-lg border-b pb-2">
          📍 Chọn trạm giám sát
        </h2>
        <div className="space-y-2 overflow-auto scrollbar-hide max-h-[310px]  pr-1">
          {stations.map((station, i) => (
            <div
              key={i}
              className={`border p-3 rounded-xl flex justify-between items-center cursor-pointer
              ${station.status === "Bảo trì" ? "opacity-50" : "border-green-500 bg-green-100"} hover:shadow`}
            >
              <div>
                <div className="font-semibold">{station.name}</div>
                <div className="text-sm text-muted-foreground">{station.location}</div>
              </div>
              <span
                className={`px-3 py-1 text-xs rounded-md font-medium ${
                  station.status === "Hoạt động"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {station.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  