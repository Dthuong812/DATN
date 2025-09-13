import type {
  Local,
  Organization,
  OrganizationFormValue,
  Project,
} from "@/types/types";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect } from "react";
import {
  useGetOrganizationByIdQuery,
  useGetOrganizationsQuery,
  useUpdateOrganizationMutation,
} from "@/services/organization.service";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { useGetProjectsQuery } from "@/services/project.service";
import { useGetLocalsQuery } from "@/services/local.service";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";

interface UpdateOrganizationDrawProps {
  organizationId: number | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function UpdateOrganizationDraw({
  organizationId,
  open,
  onClose,
  onSuccess,
}: UpdateOrganizationDrawProps) {
  const {
    register,
    formState: { errors },
    control,
    reset,
    handleSubmit,
  } = useForm<OrganizationFormValue>();

  const { data: organizationData, isSuccess } = useGetOrganizationByIdQuery(
    organizationId!,
    { skip: !organizationId }
  );

  const { data: listOrgs } = useGetOrganizationsQuery({});
  const org = listOrgs?.Data;

  const { data: listProject } = useGetProjectsQuery({});
  const projects = listProject?.Data;

  const { data: listLocal } = useGetLocalsQuery({});
  const local = listLocal?.Data;

  const [updateOrg, { isLoading }] = useUpdateOrganizationMutation();

  useEffect(() => {
    if (isSuccess && organizationData?.Data) {
      reset({
        ...organizationData.Data,
        Project:
          organizationData.Data.Project?.map((p: Project) => ({
            Id: p.Id,
          })) ?? [],
      });
    }
  }, [organizationData, isSuccess, reset]);

  const onSubmit = async (data: OrganizationFormValue) => {
    try {
      const payload = {
        Local_Id: data.Local_Id,
        Parent_Id: data.Parent_Id,
        Code: data.Code,
        Name: data.Name,
        Phone: data.Phone,
        Email: data.Email,
        Project: data.Project.map((p) => ({ Id: p.Id })),
      };
      await updateOrg({ id: organizationId, ...payload }).unwrap();
      toast.success("Cập nhật thành công");
      onClose();
      onSuccess?.();
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <Drawer open={open} onOpenChange={onClose} direction="right">
      <DrawerContent className="w-[400px] ml-auto p-6 space-y-4 mt-[35px]">
        <DrawerHeader>
          <DrawerTitle className="ml-[-18px] mb-[-18px]">
            Sửa thông tin tổ chức
          </DrawerTitle>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 overflow-auto scrollbar-hide px-2"
        >
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="Code">Mã dự án</Label>
              <Input
                id="Code"
                {...register("Code")}
                placeholder="Nhập mã dự án"
              />
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="Name">Tên tổ chức</Label>
              <Input
                id="Name"
                {...register("Name", { required: "Tên tổ chức là bắt buộc" })}
                placeholder="Nhập tên tổ chức"
              />
              {errors.Name && (
                <p className="text-sm text-red-600">{errors.Name.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="Parent_Id">Công ty cha</Label>
            <select
              {...register("Parent_Id", { valueAsNumber: true })}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
                ring-offset-background placeholder:text-muted-foreground focus:outline-none
                focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">-- Chọn công ty cha (nếu có) --</option>
              {org?.map((p: Organization) => (
                <option key={p.Id} value={p.Id}>
                  {p.Name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="Phone">Số điện thoại</Label>
            <Input
              id="Phone"
              {...register("Phone")}
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="Email">Email</Label>
            <Input
              id="Email"
              {...register("Email", {
                pattern: {
                  value: /^[^@]+@[^@]+\.[^@]+$/,
                  message: "Email không hợp lệ",
                },
              })}
              placeholder="Nhập email"
            />
            {errors.Email && (
              <p className="text-sm text-red-600">{errors.Email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="Local_Id">Tỉnh / Thành phố</Label>
            <select
              {...register("Local_Id", {
                required: "Chọn tỉnh/thành phố",
                valueAsNumber: true,
              })}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
                ring-offset-background placeholder:text-muted-foreground focus:outline-none
                focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">-- Chọn tỉnh/thành phố --</option>
              {local?.map((l: Local) => (
                <option key={l.Id} value={l.Id}>
                  {l.Name}
                </option>
              ))}
            </select>
            {errors.Local_Id && (
              <p className="text-sm text-red-600">{errors.Local_Id.message}</p>
            )}
          </div>

          <div>
            <Label>Chọn dự án</Label>
            <Controller
              control={control}
              name="Project"
              render={({ field }) => {
                const value: { Id: number }[] = field.value ?? [];

                const toggle = (p: Project, checked: boolean) => {
                  if (checked) {
                    field.onChange([...value, { Id: p.Id }]);
                  } else {
                    field.onChange(value.filter((x) => x.Id !== p.Id));
                  }
                };

                return (
                  <div className="grid gap-2 max-h-60 overflow-auto">
                    {projects?.map((p: Project) => {
                      const checked = value.some((x) => x.Id === p.Id);
                      return (
                        <label key={p.Id} className="flex items-center gap-2">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(v) => toggle(p, Boolean(v))}
                          />
                          <span>
                            {p.Code} - {p.Name}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                );
              }}
            />
          </div>

          <DrawerFooter className="flex justify-end gap-2 flex-row p-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onClose();
              }}
              className="cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-green-800 hover:bg-green-700 cursor-pointer"
            >
              {isLoading ? "Đang xử lí..." : "Cập nhật"}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
