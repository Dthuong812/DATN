import LocationTableView from "@/components/locations/LocationTableView";
import { Card } from "@/components/ui/card";

export default function LocationPage() {
  return (
    <div className="max-w-8xl mx-auto h-full overflow-auto scrollbar-hide z-0">
      <Card className="p-0 h-full overflow-hidden rounded-none">
        <LocationTableView />
      </Card>
    </div>
  );
}
