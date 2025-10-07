import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { PermissionGuard } from "./permission.guard";

@Injectable()
export class AccessGuard extends AuthGuard("jwt") {
  private permissionGuard: PermissionGuard;

  constructor(private reflector: Reflector) {
    super();
    this.permissionGuard = new PermissionGuard(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride("isPublic", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // Cho phép truy cập nếu route là public
    }

    try {
      // Kiểm tra JWT
      const canActivateJwt = await super.canActivate(context);
      if (!canActivateJwt) {
        throw new UnauthorizedException("Token không hợp lệ hoặc đã hết hạn");
      }

      // Kiểm tra quyền
      const hasPermission = await this.permissionGuard.canActivate(context);
      if (!hasPermission) {
        throw new ForbiddenException("Bạn không có quyền truy cập vào chức năng này");
      }

      return true; // Cho phép truy cập nếu JWT và quyền hợp lệ
    } catch (error) {
      // Xử lý lỗi JWT hoặc quyền truy cập
      if (error instanceof UnauthorizedException) {
        console.error("Lỗi xác thực JWT:", error.message);
        throw new UnauthorizedException("Không thể xác thực người dùng. Vui lòng đăng nhập lại.");
      }

      if (error instanceof ForbiddenException) {
        console.error("Lỗi kiểm tra quyền:", error.message);
        throw new ForbiddenException(error.message);
      }

      // Xử lý lỗi không xác định
      console.error("Lỗi không xác định:", error);
      throw new UnauthorizedException("Lỗi hệ thống. Vui lòng thử lại sau.");
    }
  }
}
