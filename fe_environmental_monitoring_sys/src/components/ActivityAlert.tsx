import { Card, CardContent} from "@/components/ui/card";

interface AlertItem {
  title: string;
  description: string;
  level: "warning" | "danger";
}

interface AlertCardProps {
  alerts: AlertItem[];
}

export default function AlertCard({ alerts }: AlertCardProps) {
  return (
    <Card className="w-full rounded-2xl shadow-md border bg-orange-100 border-orange-300 py-4 gap-2">
    <h1 className="flex items-center text-yellow-500 gap-2 text-lg font-semibold m-0 px-5"> Cảnh báo hoạt động ({alerts.length})</h1>
      <CardContent className="space-y-4 px-4">
        {alerts.map((alert, index) => (
          <div key={index} className="border rounded-xl p-4 bg-muted flex items-center justify-between">
           <div className="">
           <div className="font-semibold text-base mb-1">{alert.title}</div>
            <div className="text-sm text-muted-foreground mb-2">
              {alert.description}
            </div>
           </div>
            <span
              className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                alert.level === "danger"
                  ? "bg-red-100 text-red-700"
                  : "bg-orange-100 text-yellow-700"
              }`}
            >
              {alert.level === "danger" ? "Nguy hiểm" : "Cảnh báo"}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
