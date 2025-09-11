import { useForm } from "react-hook-form";
import type { ProjectFormValue } from "@/types/types";
import { useAddProjectMutation } from "@/services/project.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface AddProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddProjectModal({
  open,
  onClose,
  onSuccess,
}: AddProjectModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormValue>();

  const [addProject, { isLoading }] = useAddProjectMutation();

  const onSubmit = async (data: ProjectFormValue) => {
    try {
      await addProject(data).unwrap();
      toast.success("Lưu thành công!");
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to add project:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] mt-10">
        <DialogHeader>
          <DialogTitle>Thêm dự án</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="Code">Mã dự án</Label>
            <Input
              id="Code"
              placeholder="Mã dự án"
              {...register("Code", {
                required: "Mã code không được bỏ trống",
              })}
            />
            {errors.Code && (
              <p className="text-sm text-red-600">{errors.Code.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="Name">Tên dự án</Label>
            <Input
              id="Name"
              placeholder="Tên dự án"
              {...register("Name", {
                required: "Tên dự án không được bỏ trống",
              })}
            />
            {errors.Name && (
              <p className="text-sm text-red-600">{errors.Name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="Description">Mô tả</Label>
            <Input
              id="Description"
              placeholder="Mô tả"
              {...register("Description", {
                required: "Mô tả không được bỏ trống",
              })}
            />
            {errors.Description && (
              <p className="text-sm text-red-600">
                {errors.Description.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-green-800 hover:bg-green-700 cursor-pointer"
            >
              {isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
