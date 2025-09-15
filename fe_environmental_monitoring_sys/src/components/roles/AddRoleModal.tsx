import type { Function, Permission, RoleFormValue } from "@/types/types";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm } from "react-hook-form";
import { useCreateRoleMutation } from "@/services/role.service";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { useGetPermissionsQuery } from "@/services/permission.service";
import { useState, useEffect, useMemo } from "react";
import { useGetFunctionsQuery } from "@/services/function.service";
import { DrawerFooter } from "../ui/drawer";

interface AddRoleModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddRoleModal({ open, onClose, onSuccess }: AddRoleModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RoleFormValue>();

  const [addRole, { isLoading }] = useCreateRoleMutation();
  const { data: listPermissions } = useGetPermissionsQuery({});
  const permissions: Permission[] = useMemo(() => listPermissions?.Data || [], [listPermissions]);
  const { data: listFunctions } = useGetFunctionsQuery({});
  const functions: Function[] = useMemo(() => listFunctions?.Data || [], [listFunctions]);

  const [selectAll, setSelectAll] = useState<Record<number, boolean>>({});

  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<number, Record<number, boolean>>
  >({});

  useEffect(() => {
    const initSelected: Record<number, Record<number, boolean>> = {};
    functions.forEach((f) => {
      initSelected[f.Id] = {};
      permissions.forEach((p) => {
        initSelected[f.Id][p.Id] = false;
      });
    });
    setSelectedPermissions(initSelected);

    const initSelectAll: Record<number, boolean> = {};
    permissions.forEach((p) => {
      initSelectAll[p.Id] = false;
    });
    setSelectAll(initSelectAll);
  }, [functions, permissions]);

  const handleToggleAll = (permId: number) => {
    const newValue = !selectAll[permId];
    setSelectAll((prev) => ({ ...prev, [permId]: newValue }));

    setSelectedPermissions((prev) => {
      const updated = { ...prev };
      functions.forEach((func) => {
        updated[func.Id] = {
          ...updated[func.Id],
          [permId]: newValue,
        };
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
  
      await addRole(payload).unwrap();
  
      toast.success("Lưu thành công!");
      reset();
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to add role:", error);
      toast.error("Lưu thất bại!");
    }
  };
  const handleCancel = () => {
    reset();
    const initSelected: Record<number, Record<number, boolean>> = {};
    functions.forEach((f) => {
      initSelected[f.Id] = {};
      permissions.forEach((p) => {
        initSelected[f.Id][p.Id] = false;
      });
    });
    setSelectedPermissions(initSelected);

    const initSelectAll: Record<number, boolean> = {};
    permissions.forEach((p) => {
      initSelectAll[p.Id] = false;
    });
    setSelectAll(initSelectAll);

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1200px] mt-10">
        <DialogHeader>
          <DialogTitle>Thêm vai trò</DialogTitle>
        </DialogHeader>

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
                  {permissions.map((perm) => (
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
                {functions.map((func) => (
                  <tr key={func.Id} className="border-t">
                    <td className="p-2 border">
                      <b>{func.Code}</b>
                      <br />
                      {func.Name}
                    </td>
                    {permissions.map((perm) => (
                      <td key={perm.Id} className="text-center border">
                        <Checkbox
                          checked={
                            selectedPermissions[func.Id]?.[perm.Id] || false
                          }
                          onCheckedChange={() => handleToggle(func.Id, perm.Id)}
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
      </DialogContent>
    </Dialog>
  );
}
