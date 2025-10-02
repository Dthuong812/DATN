import type { Department, DepartmentFormValue } from "@/types/types";
import { Button } from "../ui/button";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm } from "react-hook-form";
import { useGetDepartmentByIdQuery, useGetDepartmentsQuery, useUpdateDepartmentMutation } from "@/services/department.service";
import {  useEffect } from "react";
import { toast } from "sonner";

interface UpdateOrganizationDrawProps {
    departmentId: number | null;
    organizationId: number | null;
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    
  }
  
export default function UpdateDepartmentDraw(
    {
        departmentId,
        organizationId,
        open,
        onClose,
        onSuccess,  
    }: UpdateOrganizationDrawProps
) {
    const {
        register,
        handleSubmit,
        formState: { errors },  
        reset,
    } = useForm<DepartmentFormValue>()
    const { data : departmentData , isSuccess} = useGetDepartmentByIdQuery(
        departmentId!,
        { skip: !departmentId }
    );
    const department = departmentData?.Data;

    const { data: listDeps } = useGetDepartmentsQuery({});
    const depsdata = listDeps?.Data.data;

    const deps = depsdata?.filter((dep: Department) => dep.Organization_Id === organizationId);
  
    const [updateDep, { isLoading }] = useUpdateDepartmentMutation();
    useEffect(() => {
        if (isSuccess && department) {
            reset({
                ...department
            });
        }
    }, [isSuccess, department, reset]);
    const onSubmit = async (data: DepartmentFormValue) => {
        try {
            if (!departmentId || !organizationId) {
                toast.error("ID phòng ban hoặc tổ chức không hợp lệ!");
                return;
            }
            const payload ={
                Parent_Id: data.Parent_Id === 0 ? null : data.Parent_Id,
                Organization_Id: organizationId,
                Code: data.Code,
                Name: data.Name,
                Phone: data.Phone,
                Email: data.Email
            }
            await updateDep({id:departmentId, ...payload, Organization_Id: organizationId }).unwrap();
            toast.success("Cập nhật thành công!");
            reset();
            onClose();
            if (onSuccess) onSuccess();
        }
        catch {
            toast.error("Có lỗi khi lưu!");
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
              <option value="">-- Thuộc phòng ban (nếu có) --</option>
              {deps?.map((p: Department) => (
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