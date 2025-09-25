import { Body, Controller, Param, Patch, Post, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "../Application/Services/AuthService";
import { AuthDto } from "../Domain/Dtos/auth.dto";
import { ResultResponse } from "src/common/ResultResponse";
import { refreshDto } from "../Domain/Dtos/refesh.dto";
import {
  ChangePasswordDto,
  ForgotPassWordDto,
  ResetPasswordDto,
} from "../Domain/Dtos/users.dto";
import { GetCurrentUserId, Public } from "src/common/decorators";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post("/signin")
  @ApiOperation({ summary: "Đăng nhập" })
  async signIn(@Body() payload: AuthDto , @Req() req: Request): Promise<ResultResponse> {
    return await this.authService.signIn(payload,req);
  }

  @Public()
  @Post("/refresh")
  @ApiOperation({ summary: "refreshToken" })
  async refreshToken(@Body() payload: refreshDto) {
    return await this.authService.refreshToken(payload);
  }

  @Patch("/reset-password/:Id")
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Reset mật khẩu" })
  async resetPassword(
    @Param("Id") Id: number,
    @Body() payload: ResetPasswordDto,
    @GetCurrentUserId() authId: number
  ): Promise<ResultResponse> {
    return await this.authService.resetPassword(Id, payload, authId);
  }

  @Patch("/change-password")
  @ApiOperation({ summary: "Đặt lại mật khẩu" })
  @ApiBearerAuth("JWT")
  async changePassword(
    @Body() payload: ChangePasswordDto,
    @GetCurrentUserId() authId: number
  ) {
    return await this.authService.ChangePassword(payload, authId);
  }
  @Public()
  @Patch("/forgot-password")
  @ApiOperation({ summary: "Quên mật khẩu" })
  @ApiBearerAuth("JWT")
  async forgotPassword(
    @Body() payload: ForgotPassWordDto
  ): Promise<ResultResponse> {
    {
      return await this.authService.forgotPassword(payload);
    }
  }

  @Patch("/lock-user/:Id")
  @ApiOperation({ summary: "Khóa tài khoản" })
  @ApiBearerAuth("JWT")
  async LockUser(@Param("Id") Id: number, @GetCurrentUserId() authId: number) {
    return await this.authService.LockUser(Id, authId);
  }
  @Patch("/unlock-user/:Id")
  @ApiOperation({ summary: "Mở khóa tài khoản" })
  @ApiBearerAuth("JWT")
  async UnLockUser(
    @Param("Id") Id: number,
    @GetCurrentUserId() authId: number
  ) {
    return await this.authService.UnLockUser(Id, authId);
  }
}
