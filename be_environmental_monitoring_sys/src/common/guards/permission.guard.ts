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


// import {
//   Injectable,
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { JwtService } from '@nestjs/jwt';
// import { PERMISSION_KEY, PermissionMeta } from '../decorators';

// @Injectable()
// export class PermissionGuard implements CanActivate {
//   constructor(
//     private reflector: Reflector,
//     private jwtService: JwtService,
//     // private roleFunctionService: RoleFunctionPermissionService,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const meta = this.reflector.get<PermissionMeta>(
//       PERMISSION_KEY,
//       context.getHandler(),
//     );

//     if (!meta) return true;

//     const request = context.switchToHttp().getRequest();
//     const token = request.headers.authorization?.split(' ')[1];
//     if (!token) throw new ForbiddenException('Missing token');

//     const payload = this.jwtService.decode(token) as any;
//     const roleCode = payload.RoleCode;
//     const projectId = payload.ProjectId;

//     // Query DB lấy quyền theo Role + Project + Function
//     const permissions = await this.roleFunctionService.getPermissions(
//       roleCode,
//       projectId,
//       meta.Func,
//     );

//     if (!permissions.includes(meta.Permission)) {
//       throw new ForbiddenException(
//         `No permission: ${meta.Func}.${meta.Permission}`,
//       );
//     }

//     return true;
//   }
// }
