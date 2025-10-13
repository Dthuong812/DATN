import type { PermissionCode, Token } from "@/types/types";

export function hasPermission(
    user: Token | null,
    projectCode: string,
    functionCode: string,
    permissionCode: PermissionCode
  ): boolean {
    if (!user?.Projects) return false;
  
    const project = user.Projects.find((p) => p.Code === projectCode);
    if (!project) return false;
  
    if (project.Roles.some(r => r.Code === "SUPPER_ADMIN")) {
      return true;
    }
  
    for (const role of project.Roles) {
      const func = role.Functions.find((f) => f.Code === functionCode);
      if (func) {
        return func.Permissions.some((p) => p.Code === permissionCode);
      }
    }
    return false;
  }
  