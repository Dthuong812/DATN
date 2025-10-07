import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ResultResponse } from "src/common/ResultResponse";
import { UserService } from "../Application/Services/UserService";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import {
  PayLoadCreateUserDto,
  PayLoadUpdateUserDto,
} from "../Domain/Dtos/users.dto";
import { GetCurrentUserId, RequirePermission } from "src/common/decorators";
import { EnumQuyen } from "src/common/EnumQuyen";

@Controller("/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiBearerAuth("JWT")
  @RequirePermission({ Func: "FUNC_USER", Permission: EnumQuyen.READ })
  @ApiOperation({ summary: "Lấy danh sách tất cả người dùng" })
  async getAll(): Promise<ResultResponse> {
    return await this.userService.getAllUsers();
  }

  @Post()
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Tạo người dùng mới" })
  @RequirePermission({ Func: "FUNC_USER", Permission: EnumQuyen.CREATE })
  async createUser(
    @Body() userDto: PayLoadCreateUserDto,
    @GetCurrentUserId() authId: number
  ): Promise<ResultResponse> {
    return await this.userService.createUser(userDto, authId);
  }

  @Patch("/:Id")
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Cập nhật thông tin người dùng" })
  @RequirePermission({ Func: "FUNC_USER", Permission: EnumQuyen.UPDATE})
  async updateUser(
    @Param("Id") Id: number,
    @Body() userDto: PayLoadUpdateUserDto,
    @GetCurrentUserId() authId: number
  ): Promise<ResultResponse> {
    return await this.userService.updateUser(Id, userDto, authId);
  }

  @Delete("/:Id")
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Xóa người dùng" })
  @RequirePermission({ Func: "FUNC_USER", Permission: EnumQuyen.DELETE })
  async deleteUser(@Param("Id") Id: number): Promise<ResultResponse> {
    return await this.userService.deleteUser(Id);
  }

  @Get("/:Id")
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Lấy thông tin người dùng theo Id" })
  @RequirePermission({ Func: "FUNC_USER", Permission: EnumQuyen.READ })
  async getUserById(@Param("Id") Id: number): Promise<ResultResponse> {
    return await this.userService.getUserById(Id);
  }
}
