import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { Result } from "ioredis";
import { ResultResponse } from "src/common/ResultResponse";
import { UserService } from "../Application/Services/UserService";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { PayLoadCreateUserDto, PayLoadUpdateUserDto } from "../Domain/Dtos/users.dto";

@Controller("/users")
export class UserController{
    constructor(
        private readonly userService: UserService, 
    ){}
    @Get()
    @ApiOperation({ summary: 'Lấy danh sách tất cả người dùng' })
    async getAll(): Promise<ResultResponse> {
      return await this.userService.getAllUsers();
    }
    @Post()
    @ApiOperation({ summary: 'Tạo người dùng mới' })
    async createUser(@Body() userDto: PayLoadCreateUserDto): Promise<ResultResponse> {
        return await this.userService.createUser(userDto);
    }
    @Patch("/:Id")
    @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
    async updateUser(@Param("Id") Id: number,
      @Body() userDto: PayLoadUpdateUserDto): Promise<ResultResponse> {
        return await this.userService.updateUser(Id,userDto);
    }
    @Delete("/:Id")
    @ApiOperation({ summary: 'Xóa người dùng' })
    async deleteUser(@Param("Id") Id: number): Promise<ResultResponse> {
        console.log("Id", Id);

        const reesult = await this.userService.softDelete({ Id });
        console.log("reesult", reesult);
        return reesult;
    }
}