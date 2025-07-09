import LogTable from "@/components/LogTable";

const dummyLogs = [
  { id: 1, timestamp: "2025-07-03 19:00", user: "admin", action: "Đăng nhập hệ thống" },
  { id: 2, timestamp: "2025-07-03 19:10", user: "admin", action: "Thêm thiết bị mới" },
  { id: 3, timestamp: "2025-07-03 19:15", user: "user01", action: "Xem nhật ký hệ thống" },
];

export default function LogsPage() {
  return (
    <div className="max-w-8xl mx-auto p-6">
      <LogTable logs={dummyLogs} />
    </div>
  );
}
