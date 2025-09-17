import { Controller, useForm, useWatch } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type {
  Department,
  Organization,
  Project,
  UserFormValue,
} from "@/types/types";
import { useGetOrganizationsQuery } from "@/services/organization.service";
import { useGetDepartmentsQuery } from "@/services/department.service";
import { useAddUserMutation } from "@/services/user.service";
import { Checkbox } from "../ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddUserModal({
  open,
  onClose,
  onSuccess,
}: AddUserModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UserFormValue>({
    defaultValues: {
      PassWord: "Eco@12312345",
    },
  });
  const [showPassWord, setShowPassWord] = useState(false);
  const selectedOrgId = useWatch({
    control,
    name: "Organization_Id",
  });

  const { data: listOrgs } = useGetOrganizationsQuery({});
  const org = listOrgs?.Data;

  const projects =
    org?.find((o: Organization) => o.Id === Number(selectedOrgId))?.Projects ||
    [];

  const { data: listDep } = useGetDepartmentsQuery({});
  const depData = listDep?.Data?.data || [];
  const dep = depData.filter(
    (d: Department) => d.Organization_Id === Number(selectedOrgId)
  );

  const [addUser, { isLoading }] = useAddUserMutation();

  const onSubmit = async (data: UserFormValue) => {
    try {
      await addUser(data).unwrap();
      toast.success("Thêm người dùng thành công");
      reset();
      onSuccess();
      onClose();
    } catch {
      toast.error("Có lỗi khi lưu!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6 space-y-4">
        <DialogHeader>
          <DialogTitle>Thêm người dùng</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 overflow-auto scrollbar-hide px-1"
        >
          <div className="grid gap-2">
            <Label htmlFor="FullName">Tên đầy đủ</Label>
            <Input
              id="FullName"
              placeholder="Nhập tên"
              {...register("FullName", { required: "Tên không được bỏ trống" })}
            />
            {errors.FullName && (
              <p className="text-sm text-red-600">{errors.FullName.message}</p>
            )}
          </div>
          <div className="flex gap-4 w-full">
            <div className="grid gap-2 w-full">
              <Label htmlFor="UserName">Tên đăng nhập</Label>
              <Input
                id="UserName"
                placeholder="Nhập tên đăng nhập"
                {...register("UserName", {
                  required: "Tên đăng không được bỏ trống",
                })}
              />
              {errors.UserName && (
                <p className="text-sm text-red-600">
                  {errors.UserName.message}
                </p>
              )}
            </div>

            <div className="grid gap-2 w-full">
              <Label htmlFor="PassWord">Mật khẩu</Label>
              <div className="relative">
                <Input
                  id="PassWord"
                  type={showPassWord ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  {...register("PassWord", {
                    required: "Mật khẩu không được bỏ trống",
                  })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassWord(!showPassWord)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassWord ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.PassWord && (
                <p className="text-sm text-red-600">
                  {errors.PassWord.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <div className="grid gap-2 w-full">
              <Label htmlFor="Phone">Số điện thoại</Label>
              <Input
                id="Phone"
                placeholder="Số điện thoại"
                {...register("Phone")}
              />
            </div>

            <div className="grid gap-2 w-full">
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
          </div>

          <div className="flex gap-4 w-full">
            <div className="grid gap-2 w-full" >
              <Label htmlFor="Organization_Id">Chọn tổ chức</Label>
              <select
                id="Organization_Id"
                {...register("Organization_Id", {
                  valueAsNumber: true,
                })}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
                ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">-- Chọn tổ chức --</option>
                {org?.map((p: Organization) => (
                  <option key={p.Id} value={p.Id}>
                    {p.Name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2 w-full">
              <Label htmlFor="Department_Id">Chọn phòng ban</Label>
              <select
                id="Department_Id"
                {...register("Department_Id", {
                  required: "Vui lòng chọn phòng ban",
                  valueAsNumber: true,
                })}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
                ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">-- Chọn phòng ban --</option>
                {dep?.map((d: Department) => (
                  <option key={d.Id} value={d.Id}>
                    {d.Name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label>Chọn dự án</Label>
            <Controller
              control={control}
              name="Projects"
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

          <DialogFooter className="flex justify-end gap-2 flex-row p-0">
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
