import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from './permission.guard';

@Injectable()
export class AccessGuard extends AuthGuard('jwt') {
  private permissionGuard: PermissionGuard;
  constructor(private reflector: Reflector) {
    super();
    this.permissionGuard = new PermissionGuard(reflector);
  }
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    try {
      const canActivateJwt = await super.canActivate(context);
      if (!canActivateJwt) {
        return false;
      }
       return true;

      // Kiểm tra quyền
      //return this.permissionGuard.canActivate(context);
    } catch (error) {
      console.error('Error during JWT validation or permission check:', error);
      throw new UnauthorizedException('Unauthorized access');
    }
  }
}
