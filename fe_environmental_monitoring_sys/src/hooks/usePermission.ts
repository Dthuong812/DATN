import { jwtDecode } from "jwt-decode";
import type { Token } from "@/types/types";

function getToken(): string | null {
  return localStorage.getItem("token");
}

export function usePermission() {
  const token = getToken();
  let user: Token | null = null;

  try {
    if (token) {
      user = jwtDecode<Token>(token);
    }
  } catch (err) {
    console.error("Invalid token:", err);
  }

  function can(funcCode: string, projectCode?: string): boolean {
    if (!user) return false;

    for (const project of user.Projects) {
      if (projectCode && project.Code !== projectCode) continue;

      for (const role of project.Roles) {
        for (const func of role.Functions) {
          if (func.Code === funcCode) {
            return true;
          }
        }
      }
    }

    return false;
  }

  return can;
}
