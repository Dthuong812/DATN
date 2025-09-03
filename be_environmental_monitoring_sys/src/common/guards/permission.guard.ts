import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSION_KEY, PermissionMeta } from "../decorators";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required: PermissionMeta = this.reflector.getAllAndOverride(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required) {
      return true; 
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false; 
    }

    // Nếu là admin → cho qua
    if (Array.isArray(user.RoleCode) && user.RoleCode.includes("ROLE_ADMIN")) {
      return true;
    }

    if (!user.permissions || !Array.isArray(user.permissions)) {
      return false; 
    }

    return user.permissions.some((perm: any) =>
      perm.FunctionCode === required.Func &&
      perm.PermissionsCode?.includes(required.Permission),
    );
  }
}
