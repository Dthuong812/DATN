import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
  } from "@/components/ui/sheet";
  
  interface Props {
    open: boolean;
    onClose: () => void;
  }
  
  export default function DrawerDetailStation({ open, onClose }: Props) {
    return (
      <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="right" className="w-full md:min-w-[700px] h-full rounded-none mt-[60px]">
          <SheetHeader>
            <SheetTitle>Thông tin chi tiết</SheetTitle>
          </SheetHeader>
          <div className="space-y-2 text-sm mt-4">
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  