import { Body, Controller, Post, Req } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "../Application/Services/AuthService";
import { AuthDto } from "../Domain/Dtos/auth.dto";
import { ResultResponse } from "src/common/ResultResponse";
import { refreshDto } from "../Domain/Dtos/refesh.dto";
import { Payload } from "@nestjs/microservices";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post("/signin")
  @ApiOperation({ summary: "Đăng nhập" })
  async signIn(@Body() payload: AuthDto): Promise<ResultResponse> {
    return await this.authService.signIn(payload);
  }
  @Post("/refresh")
  @ApiOperation({ summary: "refreshToken" })
  async refreshToken(@Body() payload: refreshDto) {
      return await this.authService.refreshToken(payload);
  }
}
