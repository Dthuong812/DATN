import type { Function, ProjectFormValue } from "@/types/types";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
} from "@/services/project.service";
import { useGetFunctionsQuery } from "@/services/function.service";
import { useEffect} from "react";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { Controller, useForm } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";

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
  const {
    handleSubmit,
    control,
    setValue,
    register,
    reset
  } = useForm<ProjectFormValue>();

  const { data: projectList, isSuccess } = useGetProjectByIdQuery(projectId!, {
    skip: !projectId,
  });
  const projectData = projectList?.Data;

  const { data: functionsList } = useGetFunctionsQuery({});
  const allFunctions = functionsList?.Data || [];

  const [updateProject, { isLoading }] = useUpdateProjectMutation();

  useEffect(() => {
    if (isSuccess && projectData) {
      reset({
        Code: projectData.Code,
        Name: projectData.Name,
        Description: projectData.Description,
      });
      setValue(
        "Functions",
        projectData.Functions?.map((f: Function) => ({ Id: f.Id })) || []
      );
    }
  }, [projectData, isSuccess, setValue, reset]);


  const handleSubmitForm = async (data: ProjectFormValue) => {
    try {
      const payload = {
        Code: data.Code,
        Name: data.Name,
        Description: data.Description,
        Functions: data.Functions?.map((f: Function) => ({ Id: f.Id })),
      };
      await updateProject({ id: projectId, ...payload }).unwrap();
      toast.success("Cập nhật thành công");
      onClose();
      onSuccess?.();
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] mt-10">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa dự án</DialogTitle>
        </DialogHeader>
        <div className="flex gap-4 w-full">
          <div className="grid gap-4 w-full ">
            <div className="grid gap-2">
              <Label htmlFor="Code">Mã dự án</Label>
              <Input
                  id="Code"
                  placeholder="Mã vai trò"
                  {...register("Code", {
                    required: "Mã code không được bỏ trống",
                  })}
                />
            </div>
          </div>
          <div className="grid gap-4 w-full ">
            <div className="grid gap-2">
              <Label htmlFor="Name">Tên dự án</Label>
              <Input
                  id="Name"
                  placeholder="Tên dự án"
                  {...register("Name", {
                    required: "Tên dự án không được bỏ trống",
                  })}
                />
            </div>
          </div>
        </div>

        <div className="grid gap-4 ">
          <div className="grid gap-2">
            <Label htmlFor="Description">Mô tả</Label>
            <Textarea
                id="Description"
                placeholder="Mô tả"
                {...register("Description", {
                  required: "Mô tả không được bỏ trống",
                })}
              />
          </div>
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
                  {allFunctions.length === 0 && (
                    <div className="col-span-3 text-sm text-muted-foreground">
                      Chưa có chức năng
                    </div>
                  )}

                  {allFunctions.map((f: Function) => {
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
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit(handleSubmitForm)}
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
