import { AlertTriangle, CheckCircle } from "lucide-react";

const environmentData = [
  {
    title: "Nhiệt độ",
    value: "30.9",
    unit: "°C",
    status: "Bình thường",
    warning: false,
  },
  {
    title: "Độ ẩm",
    value: "64.1",
    unit: "%",
    status: "Bình thường",
    warning: false,
  },
  {
    title: "Bụi mịn PM2.5",
    value: "75.8",
    unit: "µg/m³",
    status: "Cảnh báo",
    warning: true,
    threshold: "Ngưỡng cảnh báo: 75 µg/m³",
  },
  {
    title: "Chất lượng không khí",
    value: "123.2",
    unit: "",
    status: "Cảnh báo",
    warning: true,
    threshold: "Ngưỡng cảnh báo: 100",
  },
  {
    title: "Độ ồn",
    value: "70.0",
    unit: "dB",
    status: "Bình thường",
    warning: false,
  },
];

export default function EnvironmentOverview() {
  return (
    <div className="p-4 bg-white rounded-xl shadow flex flex-col gap-4 ">
      <h2 className="text-lg font-semibold ">📈 Chỉ số môi trường tổng quan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {environmentData.map((item, index) => (
          <div
            key={index}
            className={`rounded-xl p-4 border ${
              item.warning
                ? "bg-orange-50 border-orange-200"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-600">{item.title}</span>
              <span
                className={`text-sm px-2 py-1 rounded-full flex items-center gap-1 ${
                  item.warning
                    ? "bg-orange-100 text-orange-700 border border-orange-300"
                    : "bg-green-100 text-green-700 border border-green-300"
                }`}
              >
                {item.warning ? (
                  <>
                    <AlertTriangle size={14} /> {item.status}
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} /> {item.status}
                  </>
                )}
              </span>
            </div>
            <div className="text-2xl font-bold text-black">
              {item.value}
              <span className="text-base font-normal text-gray-600 ml-1">
                {item.unit}
              </span>
            </div>
            {item.threshold && (
              <p className="text-sm text-gray-500 mt-1">{item.threshold}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
