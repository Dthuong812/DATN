import type {
  Function,
  Permission,
  Project,
  RoleFormValue,
} from "@/types/types";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm } from "react-hook-form";
import { useCreateRoleMutation } from "@/services/role.service";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { useState, useEffect, useMemo } from "react";
import { DrawerFooter } from "../ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useGetProjectsQuery } from "@/services/project.service";
import { useGetPermissionsQuery } from "@/services/permission.service";
import { X } from "lucide-react";

interface AddRoleModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Tab {
  Id: string;
  projectId: number;
  permissions: Record<number, Record<number, boolean>>;
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
  const permissions: Permission[] = useMemo(
    () => listPermissions?.Data || [],
    [listPermissions]
  );

  const { data: listProject } = useGetProjectsQuery({});
  const projects: Project[] = useMemo(
    () => listProject?.Data || [],
    [listProject]
  );

  const [tabs, setTabs] = useState<Tab[]>([]);
  const [active, setActive] = useState("");

  const initPermissions = (projectId: number) => {
    const perms: Record<number, Record<number, boolean>> = {};
    const project = projects.find((p) => p.Id === projectId);
    const functions = project?.Functions || [];
    functions.forEach((func: Function) => {
      perms[func.Id] = {};
      permissions.forEach((perm) => {
        perms[func.Id][perm.Id] = false;
      });
    });
    return perms;
  };
  useEffect(() => {
    if (projects?.length && permissions?.length) {
      const defaultProject = projects[0].Id;
      const firstTab: Tab = {
        Id: "1",
        projectId: defaultProject,
        permissions: initPermissions(defaultProject),
      };
      setTabs([firstTab]);
      setActive("1");
    }
  }, [projects, permissions]);

  const addTab = () => {
    const availableProjects = projects.filter(
      (project) => !tabs.some((tab) => tab.projectId === project.Id)
    );

    if (!availableProjects.length) {
      toast.error("Không còn dự án nào để thêm tab!");
      return;
    }
    const newId = `${Date.now()}`;
    const newProjectId = availableProjects[0].Id;
    setTabs([
      ...tabs,
      {
        Id: newId,
        projectId: newProjectId,
        permissions: initPermissions(newProjectId),
      },
    ]);
    setActive(newId);
  };

  const closeTab = (Id: string) => {
    const newTabs = tabs.filter((t) => t.Id !== Id);
    setTabs(newTabs);
    if (active === Id) {
      setActive(newTabs.length ? newTabs[newTabs.length - 1].Id : "");
    }
  };

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
    setTabs([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[1000px] mt-8"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
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
          <Tabs value={active} onValueChange={setActive}>
            <div className="flex items-center">
              <TabsList>
                {tabs.map((tab) => (
                  <div key={tab.Id} className="flex items-center">
                    <TabsTrigger
                      value={tab.Id}
                      className="flex items-center cursor-pointer"
                    >
                      {projects
                        .find((p) => p.Id === tab.projectId)
                        ?.Name.slice(0, 20) || "Chưa chọn dự án"}
                      <span
                        className="ml-2 hover:text-destructive cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          closeTab(tab.Id);
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
                className="ml-2 cursor-pointer"
                onClick={addTab}
              >
                + Tab
              </Button>
            </div>

            {tabs.map((tab) => {
              const project = projects.find((p) => p.Id === tab.projectId);
              const functions = project?.Functions || [];

              return (
                <TabsContent
                  key={tab.Id}
                  value={tab.Id}
                  className="mt-4 max-h-45 overflow-auto scrollbar-hide "
                >
                  <Select
                    value={String(tab.projectId)}
                    onValueChange={(val) => chooseProject(tab.Id, Number(val))}
                  >
                    <SelectTrigger className="w-[200px] mb-4 cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((p) => (
                        <SelectItem
                          key={p.Id}
                          value={String(p.Id)}
                          className="cursor-pointer"
                        >
                          {p.Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <table className="w-full text-sm border ">
                    <thead className="bg-gray-100 sticky top-[-2px]">
                      <tr>
                        <th className="p-2 text-left border">Chức năng</th>
                        {permissions.map((perm) => (
                          <th key={perm.Id} className="p-2 text-center border">
                            <div className="flex flex-col items-center gap-1">
                              <span>{perm.Name}</span>
                              <Checkbox
                                className="cursor-pointer"
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
                                className="cursor-pointer"
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
      </DialogContent>
    </Dialog>
  );
}
