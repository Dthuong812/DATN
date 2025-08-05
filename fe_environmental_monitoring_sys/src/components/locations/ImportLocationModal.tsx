import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useImportLocationsMutation } from "@/services/location.service";

interface ImportLocationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ImportLocationModal({
  open,
  onClose,
  onSuccess,
}: ImportLocationModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importLocations, { isLoading }] = useImportLocationsMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.warning("Vui lòng chọn file để import.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await importLocations(formData).unwrap();
      toast.success("Import thành công!");
      setFile(null);
      onClose();
      onSuccess?.();
    } catch  {
      toast.error("Import thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import danh sách khu vực</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="file"
            accept=".csv, .xlsx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="bg-green-800 hover:bg-green-700 cursor-pointer">
              {isLoading ? "Đang gửi..." : "Import"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
