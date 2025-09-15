import type { Function, Permission, RoleFormValue } from "@/types/types";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { DrawerFooter } from "../ui/drawer";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
} from "@/services/role.service";
import { useGetPermissionsQuery } from "@/services/permission.service";
import { useGetFunctionsQuery } from "@/services/function.service";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
interface UpdateRoleModalProps {
  roleId: number;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}
export default function UpdateRoleModal({
  roleId,
  open,
  onClose,
  onSuccess,
}: UpdateRoleModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RoleFormValue>();
  const {
    data: roleData,
    isFetching: isRoleFetching,
    isSuccess,
  } = useGetRoleByIdQuery(roleId!, {
    skip: !roleId,
  });
  const { data: listPermissions, isFetching: isPermissionsFetching } =
    useGetPermissionsQuery({});
  const { data: listFunctions, isFetching: isFunctionsFetching } =
    useGetFunctionsQuery({});

  const isFetching =
    isRoleFetching || isPermissionsFetching || isFunctionsFetching;

  const permissions: Permission[] = useMemo(
    () => (listPermissions?.Data as Permission[]) || [],
    [listPermissions]
  );

  const functions: Function[] = useMemo(
    () => (listFunctions?.Data as Function[]) || [],
    [listFunctions]
  );
  const [updateRole, { isLoading }] = useUpdateRoleMutation();
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<number, Record<number, boolean>>
  >({});
  const [selectAll, setSelectAll] = useState<Record<number, boolean>>({});
  useEffect(() => {
    if (isSuccess && roleData) {
      reset({
        Code: roleData.Data.Code,
        Name: roleData.Data.Name,
        Description: roleData.Data.Description,
      });
      const initSelected: Record<number, Record<number, boolean>> = {};
      functions.forEach((f) => {
        initSelected[f.Id] = {};
        permissions.forEach((p: Permission) => {
          initSelected[f.Id][p.Id] = false;
        });
      });
      roleData.Data.Functions.forEach(
        (func: { Id: number; Permissions: { Id: number }[] }) => {
          if (!initSelected[func.Id]) initSelected[func.Id] = {};
          func.Permissions.forEach((perm) => {
            initSelected[func.Id][perm.Id] = true;
          });
        }
      );
      setSelectedPermissions(initSelected);
      const initSelectAll: Record<number, boolean> = {};
      permissions.forEach((p: Permission) => {
        const allSelected = functions.every(
          (f) => initSelected[f.Id] && initSelected[f.Id][p.Id]
        );
        initSelectAll[p.Id] = allSelected;
      });
      setSelectAll(initSelectAll);
    }
  }, [isSuccess, roleData, reset, functions, permissions]);
  const handleToggleAll = (permId: number) => {
    setSelectAll((prev) => ({ ...prev, [permId]: !prev[permId] }));
    setSelectedPermissions((prev) => {
      const updated = { ...prev };
      functions.forEach((func: Function) => {
        if (!updated[func.Id]) updated[func.Id] = {};
        updated[func.Id][permId] = !selectAll[permId];
      });
      return updated;
    });
  };
  const handleToggle = (functionId: number, permId: number) => {
    setSelectedPermissions((prev) => {
      const updated = { ...prev };
      updated[functionId] = {
        ...updated[functionId],
        [permId]: !updated[functionId]?.[permId],
      };
      return updated;
    });
  };
  const onSubmit = async (data: RoleFormValue) => {
    try {
      const functionsToSubmit = Object.entries(selectedPermissions).map(
        ([functionId, perms]) => ({
          Id: Number(functionId),
          Permissions: Object.keys(perms)
            .filter((permId) => perms[Number(permId)])
            .map((permId) => ({ Id: Number(permId) })),
        })
      );
      const payload = {
        Code: data.Code,
        Name: data.Name,
        Description: data.Description,
        Functions: functionsToSubmit,
      };
      await updateRole({ id: roleId, ...payload }).unwrap();
      toast.success("Cập nhật vai trò thành công!");
      reset();
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error("Cập nhật vai trò thất bại!");
    }
  };
  const handleCancel = () => {
    onClose();
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1200px] mt-10">
        <DialogHeader>
          <DialogTitle>Cập nhật vai trò</DialogTitle>
        </DialogHeader>
        {isFetching ? (
          <div className="p-6 space-y-4">
            <Card>
              <CardContent className="grid gap-2 p-6">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-[90%]" />
                <Skeleton className="h-6 w-[75%]" />
              </CardContent>
            </Card>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex justify-between gap-4 w-full">
              <div className="grid gap-2 w-full">
                <Label htmlFor="Code">Mã vai trò</Label>
                <Input
                  id="Code"
                  placeholder="Mã vai trò"
                  {...register("Code", {
                    required: "Mã code không được bỏ trống",
                  })}
                />
                {errors.Code && (
                  <p className="text-sm text-red-600">{errors.Code.message}</p>
                )}
              </div>
              <div className="grid gap-2 w-full">
                <Label htmlFor="Name">Tên vai trò</Label>
                <Input
                  id="Name"
                  placeholder="Tên vai trò"
                  {...register("Name", {
                    required: "Tên vai trò không được bỏ trống",
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
            <Label>Phân quyền</Label>
            <div className="rounded border max-h-[500px] overflow-auto scrollbar-hide">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="p-2 text-left border">Chức năng</th>
                    {permissions.map((perm: Permission) => (
                      <th key={perm.Id} className="p-2 text-center border">
                        <div className="flex flex-col items-center gap-1">
                          <span className="capitalize">{perm.Name}</span>
                          <Checkbox
                            checked={!!selectAll[perm.Id]}
                            onCheckedChange={() => handleToggleAll(perm.Id)}
                          />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {functions.map((func: Function) => (
                    <tr key={func.Id} className="border-t">
                      <td className="p-2 border">
                        <b>{func.Code}</b> <br /> {func.Name}
                      </td>
                      {permissions.map((perm: Permission) => (
                        <td key={perm.Id} className="text-center border">
                          <Checkbox
                            checked={
                              selectedPermissions[func.Id]?.[perm.Id] || false
                            }
                            onCheckedChange={() =>
                              handleToggle(func.Id, perm.Id)
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <DrawerFooter className="flex justify-end gap-2 flex-row p-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
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
        )}
      </DialogContent>
    </Dialog>
  );
}
