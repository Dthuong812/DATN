import type { Location } from "@/types/types";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
  } from "../ui/sheet";
  import "leaflet/dist/leaflet.css";

  interface DrawerDetailLocationProps {
    open: boolean;
    onClose: () => void;
    location: Location | null;
  }
  
  export function DrawerDetailLocation({
    open,
    onClose,
    location,
  }: DrawerDetailLocationProps) {
    if (!location) return null;
    return (
      <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
        <SheetContent
          side="right"
          className="w-full md:min-w-[700px] h-full rounded-none mt-[60px]"
        >
          <SheetHeader className="flex flex-row justify-between items-start">
            <div>
              <SheetTitle className="text-xl font-bold">{location.Name}</SheetTitle>
            </div>
          </SheetHeader>
  
          <div className="h-56 rounded-md overflow-hidden mx-4 mt-[-20px]">
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  