import { Controller, useForm } from "react-hook-form";
import type { Function, ProjectFormValue } from "@/types/types";
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
import { Textarea } from "../ui/textarea";
import { useGetFunctionsQuery } from "@/services/function.service";
import { Checkbox } from "../ui/checkbox";

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
    control,
  } = useForm<ProjectFormValue>();

  const [addProject, { isLoading }] = useAddProjectMutation();
  const { data: functionsList } = useGetFunctionsQuery({});
  const functions = functionsList?.Data || [];

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
      <DialogContent className="sm:max-w-[800px] mt-10">
        <DialogHeader>
          <DialogTitle>Thêm dự án</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4 w-full">
            <div className="grid gap-2 w-full">
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

            <div className="grid gap-2 w-full">
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
          </div>

          <div className="grid gap-2">
            <Label htmlFor="Description">Mô tả</Label>
            <Textarea
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
          <div>
            <Label>Chọn chức năng cho dự án</Label>
            <Controller
              control={control}
              name="Functions"
              render={({ field }) => {
                const value: { Id: number }[] = field.value ?? [];

                const toggle = (f: Function, checked: boolean) => {
                  if (checked) {
                    field.onChange([...value, { Id: f.Id }]);
                  } else {
                    field.onChange(value.filter((x) => x.Id !== f.Id));
                  }
                };

                return (
                  <div className="grid grid-cols-4 gap-4 max-h-80 overflow-auto pt-2 scrollbar-hide ">
                    {functions.length === 0 && (
                      <div className="col-span-3 text-sm text-muted-foreground">
                        Chưa có chức năng
                      </div>
                    )}

                    {functions.map((f: Function) => {
                      const checked = value.some((x) => x.Id === f.Id);
                      return (
                        <label
                          key={f.Id}
                          className="flex items-start gap-3 p-2 rounded-md border border-input hover:shadow-sm"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(v) => toggle(f, Boolean(v))}
                            className="mt-1"
                            aria-label={`Chọn chức năng ${f.Code}`}
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium leading-tight">
                              {f.Code}
                            </span>
                            <span className="text-xs text-muted-foreground -mt-0.5">
                              {f.Name}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                );
              }}
            />
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
