import { useForm } from "react-hook-form";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import type { Department, DepartmentFormValue } from "@/types/types";
import { useAddDepartmentMutation, useGetDepartmentsQuery } from "@/services/department.service";
import { toast } from "sonner";

interface AddDepartmentDrawProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  organizationId: number;
}

export default function AddDepartmentDraw({
    open,
    onClose,
    onSuccess,
    organizationId,
}: AddDepartmentDrawProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<DepartmentFormValue>();
    const [addDepartment, { isLoading }]= useAddDepartmentMutation({});

    const {data: listDepartment}= useGetDepartmentsQuery({
        filter: { Organization_Id: organizationId },
    });
    const department = listDepartment?.Data.data || [];

    const onSubmit = async (data: DepartmentFormValue) => {
        try {
            await addDepartment({ ...data, Organization_Id: organizationId }).unwrap();
            toast.success("Lưu thành công!");
            reset();
            onClose();
            if (onSuccess) onSuccess();
        } catch {
            toast.error("Có lỗi khi lưu!");
        }
    };

  return (
    <Drawer open={open} onOpenChange={onClose} direction="right">
      <DrawerContent className="w-[400px] ml-auto p-6 space-y-4 mt-[35px]">
        <DrawerHeader>
          <DrawerTitle className="ml-[-18px] mb-[-18px]">
            Thêm phòng ban
          </DrawerTitle>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 overflow-auto scrollbar-hide px-2 "
        >
          <div className="grid gap-2">
            <Label htmlFor="Code">Mã phòng ban</Label>
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
            <Label htmlFor="Name">Tên phòng ban</Label>
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
            <Label htmlFor="Parent_Id">Thuộc phòng ban </Label>
            <select
              id="Parent_Id"
              {...register("Parent_Id", {
                valueAsNumber: true,
              })}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
        ring-offset-background placeholder:text-muted-foreground focus:outline-none
        focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">-- Thuộc phòng ban (nếu có) --</option>
              {department?.map((p: Department) => (
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
