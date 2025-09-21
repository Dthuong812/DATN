import type {
  Function,
  Permission,
  Project,
  RoleFormValue,
} from "@/types/types";
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
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useGetProjectsQuery } from "@/services/project.service";
import { X } from "lucide-react";

interface UpdateRoleModalProps {
  roleId: number;
  open: boolean;
  onClose: () => void;
  onSuccess?: (role?: RoleFormValue) => void;
}

interface Tab {
  Id: string;
  projectId: number;
  permissions: Record<number, Record<number, boolean>>;
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
    isFetching,
    isSuccess,
  } = useGetRoleByIdQuery(roleId!, {
    skip: !roleId,
  });

  const { data: listPermissions } = useGetPermissionsQuery({});
  const permissions: Permission[] = useMemo(
    () => listPermissions?.Data || [],
    [listPermissions]
  );

  const { data: listProject } = useGetProjectsQuery({});
  const projects: Project[] = useMemo(
    () => listProject?.Data || [],
    [listProject]
  );

  const [updateRole, { isLoading }] = useUpdateRoleMutation();
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [active, setActive] = useState("");

  const mapRoleDataToTabs = (
    roleProjects: any[],
    permissions: Permission[]
  ): Tab[] => {
    return roleProjects.map((project, idx) => {
      const perms: Record<number, Record<number, boolean>> = {};

      project.Functions.forEach((func: Function) => {
        perms[func.Id] = {};
        permissions.forEach((perm) => {
          const hasPerm = func.Permissions?.some((p: Permission) => p.Id === perm.Id);
          perms[func.Id][perm.Id] = hasPerm;
        });
      });

      return {
        Id: `${idx + 1}`,
        projectId: project.Id,
        permissions: perms,
      };
    });
  };
  const [originalRole, setOriginalRole] = useState<RoleFormValue | null>(null);

  useEffect(() => {
    if (projects?.length && permissions?.length && isSuccess && roleData) {
      const initRole: RoleFormValue = {
        Code: roleData.Data.Code,
        Name: roleData.Data.Name,
        Description: roleData.Data.Description,
        Projects: roleData.Data.Projects || [],
        Functions: roleData.Data.Functions || [],
        Permissions: roleData.Data.Permissions || [],
      };
  
      reset(initRole);
      setOriginalRole(initRole);
  
      const tabsFromRole = mapRoleDataToTabs(roleData.Data.Projects, permissions);
      setTabs(tabsFromRole);
      setActive(tabsFromRole.length ? tabsFromRole[0].Id : "");
    }
  }, [projects, permissions, isSuccess, roleData, reset]);

  const chooseProject = (tabId: string, projectId: number) => {
    const project = projects.find((p) => p.Id === projectId);
    if (!project) return;

    const perms: Record<number, Record<number, boolean>> = {};
    project.Functions.forEach((func: Function) => {
      perms[func.Id] = {};
      permissions.forEach((perm) => {
        perms[func.Id][perm.Id] = false;
      });
    });

    setTabs((prev) =>
      prev.map((t) =>
        t.Id === tabId ? { ...t, projectId, permissions: perms } : t
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
        const project = projects.find((p) => p.Id === t.projectId);
        const functions = project?.Functions || [];
        const allChecked = functions.every(
          (f) => t.permissions[f.Id]?.[permId]
        );
        const newPermissions: Record<number, Record<number, boolean>> = {};
  
        for (const f of functions) {
          newPermissions[f.Id] = {
            ...(t.permissions[f.Id] || {}),
            [permId]: !allChecked,
          };
        }
  
        return { ...t, permissions: { ...t.permissions, ...newPermissions } };
      })
    );
  };
  

  const onSubmit = async (data: RoleFormValue) => {
    try {
      const projectsToSubmit = tabs.map((tab) => ({
        Id: tab.projectId,
        Functions: Object.entries(tab.permissions).map(
          ([functionId, perms]) => ({
            Id: Number(functionId),
            Permissions: Object.keys(perms)
              .filter((permId) => perms[Number(permId)])
              .map((permId) => ({ Id: Number(permId) })),
          })
        ),
      }));

      const payload = {
        Code: data.Code,
        Name: data.Name,
        Description: data.Description,
        Projects: projectsToSubmit,
      };

      const updatedRole = await updateRole({ id: roleId, ...payload }).unwrap();

      toast.success("Cập nhật vai trò thành công!");
      reset();
      onClose();
      if (onSuccess) onSuccess(updatedRole);
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error("Cập nhật vai trò thất bại!");
    }
  };

  const handleCancel = () => {
    if (originalRole) {
      reset(originalRole);
    }
    if (roleData) {
      const tabsFromRole = mapRoleDataToTabs(roleData.Data.Projects, permissions);
      setTabs(tabsFromRole);
      setActive(tabsFromRole.length ? tabsFromRole[0].Id : "");
    }
    onClose();
  };
  

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] mt-10"
      onInteractOutside={(e) => e.preventDefault()}
      onEscapeKeyDown={(e) => e.preventDefault()}  
      >
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
            <Tabs value={active} onValueChange={setActive}>
              <div className="flex items-center">
                <TabsList>
                  <div className="flex items-center">
                    <TabsList>
                      {tabs.map((tab) => (
                        <div key={tab.Id} className="flex items-center">
                          <TabsTrigger
                            value={tab.Id}
                            className="flex items-center"
                          >
                            {projects
                              .find((p) => p.Id === tab.projectId)
                              ?.Name.slice(0, 20) }
                            <span
                              className="ml-2 hover:text-destructive cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                              
                                setTabs((prev) => {
                                  const newTabs = prev.filter((t) => t.Id !== tab.Id);
                              
                                  if (active === tab.Id) {
                                    setActive(newTabs.length ? newTabs[0].Id : "");
                                  }
                              
                                  return newTabs;
                                });
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
                      className="ml-2"
                      onClick={() => {
                        const usedIds = tabs.map((t) => t.projectId);
                        const availableProjects = projects.filter((p) => !usedIds.includes(p.Id));
                      
                        if (availableProjects.length === 0) {
                          toast.warning("Không còn dự án nào để thêm");
                          return;
                        }
                      
                        const newProject = availableProjects[0];
                        const newId = Date.now().toString(); 
                      
                        setTabs((prev) => [
                          ...prev,
                          {
                            Id: newId,
                            projectId: newProject.Id,
                            permissions: {},
                          },
                        ]);
                      
                        setActive(newId);
                      }}
                    >
                      + Tab
                    </Button>
                  </div>
                </TabsList>
              </div>

              {tabs.map((tab) => {
                const project = projects.find((p) => p.Id === tab.projectId);
                const functions = project?.Functions || [];

                return (
                  <TabsContent
                    key={tab.Id}
                    value={tab.Id}
                    className="mt-4 max-h-45 overflow-auto scrollbar-hide"
                  >
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
                        {projects.map((p) => (
                          <SelectItem key={p.Id} value={String(p.Id)}>
                            {p.Name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <table className="w-full text-sm border">
                      <thead className="bg-gray-100 sticky top-[-2px]">
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
                                  checked={
                                    functions.length > 0 &&
                                    functions.every(
                                      (f) => tab.permissions[f.Id]?.[perm.Id]
                                    )
                                  }
                                  onCheckedChange={() =>
                                    handleToggleAll(tab.Id, perm.Id)
                                  }
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
                              <b>{func.Code}</b>
                              <br /> {func.Name}
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
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TabsContent>
                );
              })}
            </Tabs>

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
