import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permission';
export interface PermissionMeta {
  Func: string;
  Permission: string;
}

export const RequirePermission = (permissionMeta: PermissionMeta) =>
  SetMetadata(PERMISSION_KEY, permissionMeta);
