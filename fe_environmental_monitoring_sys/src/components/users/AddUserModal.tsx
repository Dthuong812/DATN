import { useForm, useWatch } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type {
  Department,
  Function,
  Organization,
  Permission,
  Project,
  Role,
  UserFormValue,
} from "@/types/types";
import { useGetOrganizationsQuery } from "@/services/organization.service";
import { useGetDepartmentsQuery } from "@/services/department.service";
import { useAddUserMutation } from "@/services/user.service";
import { Checkbox } from "../ui/checkbox";
import { Eye, EyeOff, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useGetPermissionsQuery } from "@/services/permission.service";
import { useGetFunctionsQuery } from "@/services/function.service";
import {
  useGetRolesQuery,
  useLazyGetRoleByIdQuery,
} from "@/services/role.service";
import { useLazyGetProjectByIdQuery } from "@/services/project.service";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
interface Tab {
  Id: string;
  projectId: number;
  roleId?: number;
  permissions: Record<number, Record<number, boolean>>;
  rolePermissions: Record<number, Record<number, boolean>>;
}

export default function AddUserModal({
  open,
  onClose,
  onSuccess,
}: AddUserModalProps) {
  const [active, setActive] = useState("tab-1");
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
  const [fetchRoleById] = useLazyGetRoleByIdQuery();
  const [fetchProjectById] = useLazyGetProjectByIdQuery();
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

  const { data: listPermissions } = useGetPermissionsQuery({});
  const permissions: Permission[] = useMemo(
    () => listPermissions?.Data || [],
    [listPermissions]
  );
  const { data: listRole } = useGetRolesQuery({});
  const roles = listRole?.Data || [];

  const { data: listFunctions } = useGetFunctionsQuery({});
  const functions: Function[] = useMemo(
    () => listFunctions?.Data || [],
    [listFunctions]
  );

  const initPermissions = (projectId: number) => {
    const perms: Record<number, Record<number, boolean>> = {};
    const funcs = functions.filter((f) => f.Id === projectId);
    funcs.forEach((func) => {
      perms[func.Id] = {};
      permissions.forEach((perm) => {
        perms[func.Id][perm.Id] = false;
      });
    });
    return perms;
  };
  const [projectFunctions, setProjectFunctions] = useState<
    Record<number, Function[]>
  >({});
  const [tabs, setTabs] = useState<Tab[]>(() => {
    if (projects.length === 0) return [];
    const defaultCompany = projects[0].Id;
    return [
      {
        Id: "1",
        projectId: defaultCompany,
        permissions: initPermissions(defaultCompany),
        rolePermissions: {},
      },
    ];
  });
  useEffect(() => {
    const fetchFunctions = async () => {
      for (const tab of tabs) {
        try {
          const res = await fetchProjectById(tab.projectId).unwrap();
          setProjectFunctions((prev) => ({
            ...prev,
            [tab.projectId]: res.Data.Functions || [],
          }));
        } catch (err) {
          console.error("Lỗi fetch project:", err);
        }
      }
    };
    if (tabs.length > 0) {
      fetchFunctions();
    }
  }, [tabs]);
  const chooseProject = (tabId: string, projectId: number) => {
    setTabs((prev) =>
      prev.map((t) =>
        t.Id === tabId
          ? { ...t, projectId, permissions: initPermissions(projectId) }
          : t
      )
    );
  };

  const togglePermission = (
    tabId: string,
    functionId: number,
    permId: number
  ) => {
    setTabs((prev) =>
      prev.map((t) =>
        t.Id === tabId
          ? {
              ...t,
              permissions: {
                ...t.permissions,
                [functionId]: {
                  ...t.permissions[functionId],
                  [permId]: !t.permissions[functionId]?.[permId],
                },
              },
            }
          : t
      )
    );
  };

  const handleToggleAll = (tabId: string, permId: number) => {
    setTabs((prev) =>
      prev.map((t) => {
        if (t.Id !== tabId) return t;
        const newPermissions: Record<number, Record<number, boolean>> = {};
        for (const [fid, perms] of Object.entries(t.permissions)) {
          newPermissions[Number(fid)] = {
            ...perms,
            [permId]: !perms[permId],
          };
        }
        return { ...t, permissions: newPermissions };
      })
    );
  };
  const [addUser, { isLoading }] = useAddUserMutation();

  const onSubmit = async (data: UserFormValue) => {
    try {
      const payload = {
        ...data,
        Projects: tabs.map((t) => ({
          ProjectId: t.projectId,
          Roles: t.roleId ? [{ Id: t.roleId }] : [],
        })),
        FuncPers: tabs.map((t) => ({
          ProjectId: t.projectId,
          Functions: Object.entries(t.permissions).map(([funcId, perms]) => {
            const filtered = Object.entries(perms)
              .filter(
                ([permId, checked]) =>
                  checked &&
                  !t.rolePermissions?.[Number(funcId)]?.[Number(permId)]
              )
              .map(([permId]) => ({ Id: Number(permId) }));

            return { Id: Number(funcId), Permissions: filtered };
          }),
        })),
      };
      await addUser(payload).unwrap();
      toast.success("Thêm người dùng thành công");
      reset();
      onSuccess();
      onClose();
    } catch {
      toast.error("Có lỗi khi lưu!");
    }
  };

  const handleCancel = () => {
    reset();
    setTabs([]);
    onClose();
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] p-6 mt-10">
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
                  required: "Tên đăng nhập không được bỏ trống",
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
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
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
              <Label htmlFor="Email">Email</Label>
              <Input
                id="Email"
                placeholder="Nhập Emai"
                {...register("Email", {
                  required: "Emai không được bỏ trống",
                })}
              />
              {errors.Email && (
                <p className="text-sm text-red-600">
                  {errors.Email.message}
                </p>
              )}
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="Phone"></Label>
              <Input
                id="Phone"
                placeholder="Nhập số điện thoại"
                {...register("Phone", {
                  required: "Số điện thoại không được bỏ trống",
                })}
              />
              {errors.Phone && (
                <p className="text-sm text-red-600">
                  {errors.Phone.message}
                </p>
              )}
            </div>

          </div>

          <div className="flex gap-4 w-full">
            <div className="grid gap-2 w-full">
              <Label htmlFor="Organization_Id">Chọn tổ chức</Label>
              <select
                id="Organization_Id"
                {...register("Organization_Id", {
                  valueAsNumber: true,
                })}
                className="flex h-9 w-full rounded-md border px-3 py-2 text-sm"
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
                // {...register("Department_Id", {
                //   required: "Vui lòng chọn phòng ban",
                //   valueAsNumber: true,
                // })}
                className="flex h-9 w-full rounded-md border px-3 py-2 text-sm"
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
          <Label>Phân quyền</Label>
          <Tabs value={active} onValueChange={setActive}>
            <div className="flex items-center">
              <TabsList>
                {tabs.map((tab) => (
                  <div key={tab.Id} className="flex items-center">
                    <TabsTrigger value={tab.Id}>
                      {projects.find((p:Project) => p.Id === tab.projectId)?.Name.slice(0,20) ||
                        "Chưa chọn dự án"}
                      <span
                        className="ml-2 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTabs((prev) =>
                            prev.filter((t) => t.Id !== tab.Id)
                          );
                          if (active === tab.Id && tabs.length > 1) {
                            setActive(tabs[0].Id);
                          }
                        }}
                      >
                        <X size={14} />
                      </span>
                    </TabsTrigger>
                  </div>
                ))}
              </TabsList>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const usedIds = tabs.map((t) => t.projectId);
                  const available = projects.filter(
                    (p:Project) => !usedIds.includes(p.Id)
                  );
                  if (!available.length) {
                    toast.warning("Không còn dự án nào để thêm");
                    return;
                  }
                  const newProj = available[0];
                  const newId = Date.now().toString();
                  setTabs((prev) => [
                    ...prev,
                    {
                      Id: newId,
                      projectId: newProj.Id,
                      permissions: initPermissions(newProj.Id),
                      rolePermissions: {},
                    },
                  ]);
                  setActive(newId);
                }}
              >
                + Tab
              </Button>
            </div>

            {tabs.map((tab) => {
              const funcs = projectFunctions[tab.projectId] || [];
              return (
                <TabsContent key={tab.Id} value={tab.Id}>
                  <div className="flex gap-2">
                    <Select
                      value={String(tab.projectId)}
                      onValueChange={(val) =>
                        chooseProject(tab.Id, Number(val))
                      }
                    >
                      <SelectTrigger className="w-[200px] mb-4">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((p: Project) => (
                          <SelectItem key={p.Id} value={String(p.Id)}>
                            {p.Name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={tab.roleId ? String(tab.roleId) : ""}
                      onValueChange={async (val) => {
                        const roleId = Number(val);
                        setTabs((prev) =>
                          prev.map((t) =>
                            t.Id === tab.Id ? { ...t, roleId } : t
                          )
                        );

                        try {
                          const res = await fetchRoleById(roleId).unwrap();
                          const role = res?.Data;
                          if (!role) return;

                          setTabs((prev) =>
                            prev.map((t) => {
                              if (t.Id !== tab.Id) return t;

                              const perms = initPermissions(t.projectId);
                              const rolePerms = initPermissions(t.projectId);

                              const proj = role.Projects.find(
                                (p: Project) => p.Id === t.projectId
                              );
                              if (proj) {
                                proj.Functions.forEach((f: Function) => {
                                  if (!perms[f.Id]) perms[f.Id] = {};
                                  if (!rolePerms[f.Id]) rolePerms[f.Id] = {};
                                  f.Permissions.forEach((p: Permission) => {
                                    perms[f.Id][p.Id] = true;
                                    rolePerms[f.Id][p.Id] = true;
                                  });
                                });
                              }

                              return {
                                ...t,
                                permissions: perms,
                                rolePermissions: rolePerms,
                              };
                            })
                          );
                        } catch {
                          toast.error("Không tải được chi tiết vai trò");
                        }
                      }}
                    >
                      <SelectTrigger className="w-[200px] mb-4">
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role: Role) => (
                          <SelectItem key={role.Id} value={String(role.Id)}>
                            {role.Code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="overflow-x-auto max-h-[230px] scrollbar-hide mb-2 ">
                    <table className="w-full text-sm border">
                      <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr>
                          <th className="p-2 text-left border">Chức năng</th>
                          {permissions.map((perm) => (
                            <th
                              key={perm.Id}
                              className="p-2 text-center border"
                            >
                              <div className="flex flex-col items-center gap-1">
                                <span>{perm.Name}</span>
                                <Checkbox
                                  checked={functions.every(
                                    (f) => tab.permissions[f.Id]?.[perm.Id]
                                  )}
                                  onCheckedChange={() =>
                                    handleToggleAll(tab.Id, perm.Id)
                                  }
                                  disabled={!!tab.roleId}
                                />
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {funcs.map((func) => (
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
                                    tab.permissions[func.Id]?.[perm.Id] || false
                                  }
                                  onCheckedChange={() =>
                                    togglePermission(tab.Id, func.Id, perm.Id)
                                  }
                                  disabled={
                                    tab.rolePermissions?.[func.Id]?.[
                                      perm.Id
                                    ] === true
                                  }
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>

          <div className="flex justify-end gap-2">
            <Button
              className="cursor-pointer"
              type="button"
              variant="outline"
              onClick={handleCancel}
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
