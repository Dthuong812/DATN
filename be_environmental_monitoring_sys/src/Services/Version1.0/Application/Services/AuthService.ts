import { Or } from 'typeorm';
import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import * as requestIp from "request-ip";
import dayjs from "dayjs";
import { UserService } from "./UserService";
import CaptchaService from "./CaptchaService";
import { ResultResponse } from "src/common/ResultResponse";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";
import { ErrorManage } from "src/common/ErrorCode/ErrorManager";
import { generatePassword } from "src/common/Util";
import { MailService } from "./MailService";
import { TelegramService } from "./TelegramService";
import { UserRepository } from "../../Infrastructure/Repository/UserRepository";
import { AuthDto, JWTpayload } from "../../Domain/Dtos/auth.dto";
import { refreshDto } from "../../Domain/Dtos/refesh.dto";
import { ChangePasswordDto, ForgotPassWordDto, ResetPasswordDto } from "../../Domain/Dtos/users.dto";
import { UserEntity } from "../../Domain/Models/users.entity";

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private readonly userService: UserService,
    private readonly captchaService: CaptchaService,
    private readonly userRepository: UserRepository,
    private readonly mail: MailService,
    private readonly telegramService: TelegramService
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

  async signIn(payload: AuthDto,req: Request): Promise<ResultResponse> {
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

      const userData = await this.userService.getPayloadByName(payload.UserName);

      const user = userData.Data;
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
        user.Organization_Id,
        user.Department_Id,
        user.Projects
      );
      const { access_token, refresh_token, exp_refresh } = tokens;
      
      const item = {
        UserId: user.Id,
        UserName: user.UserName,
        Organization_Id: user.Organization_Id,
        Department_Id: user.Department_Id,
        Projects: user.Projects,
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
    Organization_Id: number,
    Department_Id: number,
    Projects?: string[]
  ) {
    const payload = { sub: userId, username, Organization_Id, Department_Id, Projects };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get("JWT_SECRET"),
        expiresIn: this.configService.get("EXPIRES_ACCESS_IN"),
        header: {
          // kid: this.configService.get("JWT_KID"),
          alg: "HS256",
          typ: "JWT",
        },
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get("REFRESH_SECRET"),
        expiresIn: this.configService.get("EXPIRES_REFRESH_IN"),
        header: {
          // kid: this.configService.get("REFRESH_KID"),
          alg: "HS256",
          typ: "JWT",
        },
      }),
    ]);
    const expiresInMinutes = parseInt(
      this.configService.get<string>("EXPIRES_REFRESH_IN")
    );
    const exp_refresh = Date.now() + expiresInMinutes * 60 * 1000;

    return {
      access_token: at,
      refresh_token: rt,
      exp_refresh,
    };
  }

  async refreshToken(payload: refreshDto): Promise<ResultResponse> {
    const res = new ResultResponse(0, "", null);
    try {
      const payloadItem: JWTpayload = await this.jwtService.verifyAsync(
        payload.refresh_token,
        {
          secret: this.configService.get("REFRESH_SECRET"),
        }
      );

      const userResponse = await this.userService.getById(payloadItem.sub);
      const user = userResponse.Data;
      if (!user) {
        res.Status = ErrorCode.USER_NOT_FOUND;
        res.Message = ErrorManage.getErrorMessage(ErrorCode.USER_NOT_FOUND);
        return res;
      }

      const tokens = await this.getTokens(
        user.Id,
        user.UserName,
        user.Organization_Id,
        user.Department_Id,
        user.Projects
      );
      const { access_token, refresh_token, exp_refresh } = tokens;
      const item = {
        UserId: user.Id,
        UserName: user.UserName,
        Organization_Id: user.Organization_Id,
        Department_Id: user.Department_Id,
        Projects: user.Projects,
        access_token,
        refresh_token,
        exp_refresh,
      };
      console.log(item);
      res.Data = item;
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Refresh token thành công";
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.Message;
    }

    return res;
  }
  async resetPassword(
    Id: number,
    payload: ResetPasswordDto,
    authId: number
  ): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const user = await this.userRepository.getById(Id);
      if (!user) {
        res.Status = ErrorCode.NOT_FOUND_ID;
        res.Message = "Không tìm thấy người dùng";
        return res;
      }
      const hashedPassword = await argon2.hash(payload.PassWord);
      const updateData: UserEntity = {
        ...user,
        PassWord: hashedPassword,
        UpdatedAt: new Date(),
        UpdatedBy: authId,
      };
      await this.userRepository.update({ Id }, updateData);
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Đặt lại mật khẩu thành công";
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
  async ChangePassword(payload: ChangePasswordDto) {
    const res = new ResultResponse(0, "", null);

    if (!payload) {
      res.Status = ErrorCode.NOT_DTO;
      res.Message = ErrorManage.getErrorMessage(ErrorCode.NOT_DTO);
      return res;
    }
    const userupdate = await this.userRepository.getById(payload.Id);
    if (!userupdate) {
      res.Status = ErrorCode.USER_NOT_FOUND;
      res.Message = ErrorManage.getErrorMessage(ErrorCode.USER_NOT_FOUND);
      return res;
    }
    const user = userupdate as UserEntity;

    const passwordMatches = await argon2.verify(
      user.PassWord,
      payload.OldPassWord
    );
    if (!passwordMatches) {
      res.Status = ErrorCode.WRONG_PASSWORD;
      res.Message = ErrorManage.getErrorMessage(ErrorCode.WRONG_PASSWORD);
      return res;
    }

    if (payload.PassWord === payload.OldPassWord) {
      res.Status = ErrorCode.NOT_CHANGE_PASS;
      res.Message = ErrorManage.getErrorMessage(ErrorCode.NOT_CHANGE_PASS);
      return res;
    }

    if (payload.PassWord !== payload.PassWordAgain) {
      res.Status = ErrorCode.AGAIN_PASS_ERROR;
      res.Message = ErrorManage.getErrorMessage(ErrorCode.AGAIN_PASS_ERROR);
      return res;
    }

    const password_hash = await argon2.hash(payload.PassWord);
    user.PassWord = password_hash;
    user.UpdatedBy = user.Id;
    user.ChangePasswordAt = new Date();
    user.UpdatedAt = new Date();

    const param = { Id: user.Id };
    const updateUser = await this.userRepository.update(param, user);

    if (updateUser) {
      res.Status = ErrorCode.CHANGE_PASS_SUCCESS;
      res.Message = ErrorManage.getErrorMessage(ErrorCode.CHANGE_PASS_SUCCESS);
      res.Data = updateUser;
    }

    return res;
  }
  async forgotPassword(payload: ForgotPassWordDto): Promise<ResultResponse> {
    const res = new ResultResponse(0, "", null);
    try {
      const userUpdate = await this.userRepository.getAll();
      if (!userUpdate || userUpdate.length === 0) {
        res.Status = ErrorCode.USER_NOT_FOUND;
        res.Message = ErrorManage.getErrorMessage(ErrorCode.USER_NOT_FOUND);
        return res;
      }
      const user = userUpdate.find((u) => u.Email === payload.Email || u.Phone === payload.Phone || u.UserName === payload.UserName);

      const rawPassword = generatePassword(12, {
        includeLowercase: true,
        includeSpecialChars: true,
        includeNumbers: true,
        includeUppercase: true,
      });

      if (payload.Email) {
        await this.mail.sendMailCreateUser(payload.Email, rawPassword);
      } else if (payload.Phone) {
        await this.telegramService.sendMessage(rawPassword);
      }

      const hashedPassword = await argon2.hash(rawPassword);
      const updateData: UserEntity = {
        ...user,
        PassWord: hashedPassword,
        UpdatedAt: new Date(),
        UpdatedBy: user.Id,
      };
      const result = await this.userRepository.update(
        { Id: user.Id },
        updateData
      );

      if (result) {
        res.Data = result;
        res.Status = ErrorCode.SUCCESS;
      } else {
        res.Status = ErrorCode.SAVE_FAIL;
        res.Message = "Lấy lại mật khẩu thất bại";
      }
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
  async LockUser(Id: number, authId: number): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const item = await this.userRepository.getById(Id);
      if (!item) {
        res.Status = ErrorCode.NOT_FOUND_ID;
        res.Message = "Không tìm thấy người dùng";
        return res;
      }
  
      if (item.Active === 3) {
        res.Status = ErrorCode.EDIT_FAIL;
        res.Message = "Người dùng đã bị khóa trước đó";
        return res;
      }
  
      const ItemUpdate: UserEntity = {
        ...item,
        Active: 3,
        UpdatedAt: new Date(),
        UpdatedBy: authId,
      };
  
      const resultUpdate = await this.userRepository.update({ Id }, ItemUpdate);
      if (resultUpdate) {
        res.Status = ErrorCode.SUCCESS;
        res.Message = "Khóa người dùng thành công";
      } else {
        res.Status = ErrorCode.EDIT_FAIL;
        res.Message = "Khóa người dùng thất bại";
      }
    } catch (err) {
      res.Message = err.message;
    }
    return res;
  }
  
  async UnLockUser(Id: number, authId: number): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const item = await this.userRepository.getById(Id);
      
      if (!item) {
        res.Status = ErrorCode.NOT_FOUND_ID;
        res.Message = "Không tìm thấy người dùng";
        return res;
      }
  
      if (item.Active === 1) {
        res.Status = ErrorCode.EDIT_FAIL;
        res.Message = "Người dùng đã được mở khóa trước đó";
        return res;
      }
  
      const ItemUpdate: UserEntity = {
        ...item,
        Active: 1,
        UpdatedAt: new Date(),
        UpdatedBy: authId,
      };
  
      const resultUpdate = await this.userRepository.update({ Id }, ItemUpdate);
      if (resultUpdate) {
        res.Status = ErrorCode.SUCCESS;
        res.Message = "Mở khóa người dùng thành công";
      } else {
        res.Status = ErrorCode.EDIT_FAIL;
        res.Message = "Mở khóa người dùng thất bại";
      }
    } catch (err) {
      res.Message = err.message;
    }
    return res;
  }
}
