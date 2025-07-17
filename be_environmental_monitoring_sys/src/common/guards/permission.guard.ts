import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY, PermissionMeta } from '../decorators';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required: PermissionMeta = this.reflector.getAllAndOverride(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!required) {
      return true; // Nếu không có yêu cầu permission cụ thể, cho phép truy cập
    }

    const { user } = context.switchToHttp().getRequest();

    console.log('User permissions:', user.permissions);

    const hasAll = user.permissions.some((perm: any) =>
      perm.PermissionsCode.includes('ALL'),
    );
    if (hasAll) return true;

    // Match by Func + Permission
    return user.permissions.some((perm: any) =>
      perm.FunctionCode === required.Func &&
      perm.PermissionsCode.includes(required.Permission),
    );
  }
}
