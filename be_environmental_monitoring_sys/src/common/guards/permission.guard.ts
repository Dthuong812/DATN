import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY, PermissionMeta } from '../decorators/permission.decorator';

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
      throw new ForbiddenException('Không tìm thấy thông tin người dùng.');
    }

    if (Array.isArray(user.Projects)) {
      const isSuperAdmin = user.Projects.some((project) =>
        project.Roles.some((role) => role.Code === 'SUPPER_ADMIN')
      );
      if (isSuperAdmin) {
        return true;
      }
    }

    const hasPermission =
    user.Projects.some(project =>
      project.Roles.some(role =>
        role.Functions.some(func =>
          func.Code.toUpperCase() === required.Func.toUpperCase() &&
          func.Permissions.some(p => p.Code.toUpperCase() === required.Permission.toUpperCase())
        )
      )
    ) ||
    user.Projects.some(project =>
      project.UserFunctions?.some(func =>
        func.Code.toUpperCase() === required.Func.toUpperCase() &&
        func.Permissions.some(p => p.Code.toUpperCase() === required.Permission.toUpperCase())
      )
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `Không có quyền truy cập: ${required.Func}.${required.Permission}`
      );
    }

    return true;
  }
}