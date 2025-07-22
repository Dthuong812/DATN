import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import * as requestIp from "request-ip";
import dayjs from "dayjs";
import { UserService } from "./UserService";
import CaptchaService from "./CaptchaService";
import { AuthDto } from "src/Services/Domain/Dtos/auth.dto";
import { ResultResponse } from "src/common/ResultResponse";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";
import { ErrorManage } from "src/common/ErrorCode/ErrorManager";
import { refreshDto } from "src/Services/Domain/Dtos/refesh.dto";

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private readonly userService: UserService,
    private readonly captchaService: CaptchaService
  ) {}
  getIpv4(req: Request) {
    const clientIp = requestIp.getClientIp(req);
    if (clientIp === "::1") return "127.0.0.1";
    if (clientIp && clientIp.substr(0, 7) === "::ffff:")
      return clientIp.substr(7);
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (clientIp && ipv4Regex.test(clientIp)) {
      return clientIp;
    }
    return null;
  }
  checkIsMustChangePassword = (latestChangePasswordAt: Date) => {
    const expiresChangePasswordIn =
      parseInt(this.configService.get("EXPIRES_CHANGE_PASSWORD_IN")) ?? 0;
    const dayjsNow = dayjs();
    const time =
      expiresChangePasswordIn > 0
        ? dayjsNow.subtract(expiresChangePasswordIn, "day")
        : dayjsNow.subtract(1, "minute");
    return dayjs(latestChangePasswordAt) < time;
  };

  async signIn(payload: AuthDto): Promise<ResultResponse> {
    const res = new ResultResponse(0, "", null);

    try {
      // CAPTCHA
      if (payload.recaptchaToken) {
        const captchaResponse = await this.captchaService.verifyCaptcha(
          payload.recaptchaToken
        );
        if (captchaResponse.Status !== ErrorCode.VERIFY) {
          return captchaResponse;
        }
      }
      //validate
      const users = await this.userService.getAll();
      const user = users.Data.find(
        (u) =>
          u.UserName === payload.UserName ||
          u.Email === payload.Email ||
          u.Phone === payload.Phone
      );

      if (!user) {
        res.Status = ErrorCode.USER_NOT_FOUND;
        res.Message = ErrorManage.getErrorMessage(ErrorCode.USER_NOT_FOUND);
        return res;
      }

      if (user.Active === 3) {
        res.Status = ErrorCode.LOCK_USER;
        res.Message = ErrorManage.getErrorMessage(ErrorCode.LOCK_USER);
        return res;
      }
      // Check password
      const isMatch = await argon2.verify(user.PassWord, payload.PassWord);
      if (!isMatch) {
        res.Status = ErrorCode.WRONG_PASSWORD;
        res.Message = ErrorManage.getErrorMessage(ErrorCode.WRONG_PASSWORD);
        return res;
      }
      // Kiểm tra xem người dùng có cần thay đổi mật khẩu không
      const isMustChangePassword = this.checkIsMustChangePassword(
        user.ChangePasswordAt
      );
      if (isMustChangePassword) {
        res.Status = ErrorCode.PASSWORD_EXP;
        res.Message = ErrorManage.getErrorMessage(ErrorCode.PASSWORD_EXP);
        return res;
      }

      // tạo token
      const tokens = await this.getTokens(
        user.Id,
        user.UserName,
        user.Location_Id,
        user.IsManagement
      );
      const { access_token, refresh_token, exp_refresh } = tokens;
      const item = {
        UserId: user.Id,
        UserName: user.UserName,
        Location_Id: user.Location_Id,
        IsManagement: user.IsManagement,
        access_token,
        refresh_token,
        exp_refresh,
      };
      res.Data = item;
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Đăng nhập thành công";
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }

    return res;
  }

  async getTokens(
    userId: number,
    username: string,
    Location_Id: number,
    IsManagement: number
  ) {
    const payload = { sub: userId, username, Location_Id, IsManagement };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>("JWT_SECRET"),
      expiresIn: this.configService.get<string>("EXPIRES_ACCESS_IN"),
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>("REFRESH_SECRET"),
      expiresIn: this.configService.get<string>("EXPIRES_REFRESH_IN"),
    });

    const expiresInMinutes = parseInt(
      this.configService.get<string>("EXPIRES_REFRESH_IN")
    );
    const exp_refresh = Date.now() + expiresInMinutes * 60 * 1000;

    return {
      access_token,
      refresh_token,
      exp_refresh,
    };
  }

  async refreshToken(payload: refreshDto): Promise<ResultResponse> {
    const res = new ResultResponse(0, "", null);
    try {
      const decoded = await this.jwtService.verifyAsync(payload.refresh_token, {
        secret: this.configService.get<string>("REFRESH_SECRET"),
      });

      const userResponse = await this.userService.getById(decoded.sub);
      const user = userResponse.Data;
      if (!user) {
        res.Status = ErrorCode.USER_NOT_FOUND;
        res.Message = ErrorManage.getErrorMessage(ErrorCode.USER_NOT_FOUND);
        return res;
      }

      const tokens = await this.getTokens(
        user.Id,
        user.UserName,
        user.Location_Id,
        user.IsManagement
      );
      const { access_token, refresh_token, exp_refresh } = tokens;
      const item = {
        UserId: user.Id,
        UserName: user.UserName,
        Location_Id: user.Location_Id,
        IsManagement: user.IsManagement,
        access_token,
        refresh_token,
        exp_refresh,
      };
      res.Data = item;
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Refresh token thành công";
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.Message;
    }

    return res;
  }
}
