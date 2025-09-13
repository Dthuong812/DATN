import type { Project } from "@/types/types";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
} from "@/services/project.service";
import { useEffect, useState } from "react";
import { toast } from "sonner";
interface UpdateProjectModalProps {
  projectId: number | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}
export default function UpdateProjectModal({
  projectId,
  open,
  onClose,
  onSuccess,
}: UpdateProjectModalProps) {
    const [formData, setFormData] = useState<Partial<Project>>({});
  const { data: projectList, isSuccess } = useGetProjectByIdQuery(projectId!, {
    skip: !projectId,
  });
  const projectData = projectList?.Data;
  const [updateProject, { isLoading }] = useUpdateProjectMutation();

  useEffect(() => {
    if (isSuccess && projectData) {
      setFormData({
        ...projectData,
      });
    }
  }, [projectData, isSuccess, onSuccess]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async () => {
    try {
      await updateProject({ id: projectId, ...formData }).unwrap();
      toast.success("Cập nhật thành công");
      onClose();
      onSuccess?.();
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] mt-10">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa dự án</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 ">
          <div className="grid gap-2">
            <Label htmlFor="Code">Mã dự án</Label>
            <Input
              id="Code"
              name="Code"
              value={formData.Code || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid gap-4 ">
          <div className="grid gap-2">
            <Label htmlFor="Name">Tên dự án</Label>
            <Input
              id="Name"
              name="Name"
              value={formData.Name || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid gap-4 ">
          <div className="grid gap-2">
            <Label htmlFor="Description">Mô tả</Label>
            <Input
              id="Description"
              name="Description"
              value={formData.Description || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2  ">
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-green-800 hover:bg-green-700 cursor-pointer"
          >
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
