import { Controller, useForm } from "react-hook-form";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type {
  Local,
  Organization,
  OrganizationFormValue,
  Project,
} from "@/types/types";
import {
  useAddOrganizationMutation,
  useGetOrganizationsQuery,
} from "@/services/organization.service";
import { useGetLocalsQuery } from "@/services/local.service";
import { Checkbox } from "../ui/checkbox";
import { useGetProjectsQuery } from "@/services/project.service";

interface AddOrganizationDrawProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddOrganizationDraw({
  open,
  onClose,
  onSuccess,
}: AddOrganizationDrawProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<OrganizationFormValue>();
  const [addOrganization, { isLoading }] = useAddOrganizationMutation();
  const { data: listLocal } = useGetLocalsQuery({});
  const local = listLocal?.Data;
  const { data: listOrgs } = useGetOrganizationsQuery({});
  const org = listOrgs?.Data;
  const { data: listProject } = useGetProjectsQuery({});
  const projects = listProject?.Data;
  const onSubmit = async (data: OrganizationFormValue) => {
    try {
      await addOrganization(data).unwrap();
      toast.success("Lưu thành công!");
      reset();
      onClose();
      if (onSuccess) onSuccess();
    } catch {
      toast.error("Có lỗi khi lưu!");
    }
  };

  return (
    <Drawer open={open} onOpenChange={onClose} direction="right" >
      <DrawerContent className="w-[400px] ml-auto p-6 space-y-4 mt-[35px]">
        <DrawerHeader>
          <DrawerTitle className="ml-[-18px] mb-[-18px]">Thêm tổ chức</DrawerTitle>
        </DrawerHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-auto scrollbar-hide px-2 ">
          <div className="grid gap-2">
            <Label htmlFor="Code">Mã tổ chức</Label>
            <Input
              id="Code"
              placeholder="Nhập mã"
              {...register("Code", { required: "Mã không được bỏ trống" })}
            />
            {errors.Code && (
              <p className="text-sm text-red-600">{errors.Code.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="Name">Tên tổ chức</Label>
            <Input
              id="Name"
              placeholder="Nhập tên"
              {...register("Name", { required: "Tên không được bỏ trống" })}
            />
            {errors.Name && (
              <p className="text-sm text-red-600">{errors.Name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="Parent_Id">Công ty cha</Label>
            <select
              id="Parent_Id"
              {...register("Parent_Id", {
                valueAsNumber: true,
              })}
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
              placeholder="Số điện thoại"
              {...register("Phone")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="Email">Email</Label>
            <Input
              id="Email"
              placeholder="Email"
              {...register("Email", {
                pattern: {
                  value: /^[^@]+@[^@]+\.[^@]+$/,
                  message: "Email không hợp lệ",
                },
              })}
            />
            {errors.Email && (
              <p className="text-sm text-red-600">{errors.Email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="Local_Id">Tỉnh / Thành phố</Label>
            <select
              id="Local_Id"
              {...register("Local_Id", {
                required: "Vui lòng chọn tỉnh/thành phố",
                valueAsNumber: true,
              })}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
      ring-offset-background placeholder:text-muted-foreground focus:outline-none
      focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">-- Chọn tỉnh/thành phố --</option>
              {local?.map((loc: Local) => (
                <option key={loc.Id} value={loc.Id}>
                  {loc.Name}
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
                  <div className="grid gap-2 max-h-60 overflow-auto pt-2">
                    {projects.length === 0 && (
                      <div className="text-sm text-muted-foreground">
                        Chưa có dự án
                      </div>
                    )}

                    {projects.map((p: Project) => {
                      const checked = value.some((x) => x.Id === p.Id);
                      return (
                        <label
                          key={p.Id}
                          className="flex items-start gap-3 p-2 rounded-md border border-input hover:shadow-sm"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(v) => toggle(p, Boolean(v))}
                            className="mt-1"
                            aria-label={`Chọn dự án ${p.Code}`}
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium leading-tight">
                              {p.Code}
                            </span>
                            <span className="text-xs text-muted-foreground -mt-0.5">
                              {p.Name}
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
              {isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
