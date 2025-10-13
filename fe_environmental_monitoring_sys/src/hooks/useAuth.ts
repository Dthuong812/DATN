import type { PermissionCode, Token } from "@/types/types";
import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";


function getToken(): string | null {
  return localStorage.getItem("token");
}

export function useAuth() {
  const token = getToken();

  const user = useMemo(() => {
    if (!token) return null;
    try {
      return jwtDecode<Token>(token);
    } catch (err) {
      console.error("Invalid token:", err);
      return null;
    }
  }, [token]);

  /**
   * Kiểm tra quyền theo Function + Permission
   * @param funcCode - mã function (ví dụ FUNC_OBJECT)
   * @param permCode - mã quyền (CREATE, READ, UPDATE...)
   */
  const hasFunctionPermission = (funcCode: string, permCode?: PermissionCode): boolean => {
    if (!user) return false;

    for (const project of user.Projects) {
      for (const role of project.Roles) {
        for (const func of role.Functions) {
          if (func.Code === funcCode) {
            if (!permCode) return true; 
            return func.Permissions.some(p => p.Code === permCode);
          }
        }
      }
    }

    return false;
  };

  return {
    user,
    hasFunctionPermission,
  };
}
