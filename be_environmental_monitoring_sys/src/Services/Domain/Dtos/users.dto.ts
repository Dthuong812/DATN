import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsDate, IsNotEmpty, IsNumber, IsString, Matches, MinLength } from "class-validator"

export class UserDto {
    Id : number
    UserName : string
    PassWord : string
    FullName : string
    Email : string
    Phone: string
    ChangePasswordAt: Date
    Location_Id: number
    IsManagement:Number
    Active: number
    CreatedBy: number
    CreatedAt: Date
    UpdatedBy: number
    UpdatedAt: Date
    DeletedAt?: Date;
}

export class PayLoadCreateUserDto{
    @ApiProperty({ description: "Tên đăng nhập" })
    @IsNotEmpty()
    @IsString()
    UserName: string;

    @ApiProperty({ description: "Mật khẩu" })
    @IsString()
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/, {
      message: 'Mật khẩu phải chứa chữ hoa, chữ thường và số',
    })
    PassWord: string;

    @ApiProperty({ description: "Họ và tên" })
    @IsNotEmpty()
    @IsString()
    FullName: string;

    @ApiProperty({ description: "Email" })
    @IsNotEmpty()
    @IsString()
    Email: string;

    @ApiProperty({ description: "Số điện thoại" })
    @IsNotEmpty()
    @IsString()
    Phone: string;

    @ApiProperty({ description: "ID địa chỉ" })
    @IsNotEmpty()
    Location_Id: number;

    @ApiProperty({ description: "Quyền quản lý" })
    @IsNotEmpty()   
    IsManagement: number;

    @ApiProperty({ description: "Trạng thái hoạt động" })
    @IsNotEmpty()
    Active: number;

    @ApiProperty({ description: "Người tạo" })
    @IsNotEmpty()
    CreatedBy: number;

    @ApiProperty({ description: "Ngày tạo" })
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    CreatedAt: Date = new Date();
}
export class PayLoadUpdateUserDto{
    @ApiProperty({ description: "Tên đăng nhập" })
    @IsNotEmpty()
    @IsString()
    UserName: string;

    @ApiProperty({ description: "Mật khẩu" })
    @IsString()
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/, {
      message: 'Mật khẩu phải chứa chữ hoa, chữ thường và số',
    })
    PassWord: string;

    @ApiProperty({ description: "Họ và tên" })
    @IsNotEmpty()
    @IsString()
    FullName: string;

    @ApiProperty({ description: "Email" })
    @IsNotEmpty()
    @IsString()
    Email: string;

    @ApiProperty({ description: "Số điện thoại" })
    @IsNotEmpty()
    @IsString()
    Phone: string;

    @ApiProperty({ description: "ID địa chỉ" })
    @IsNotEmpty()
    Location_Id: number;

    @ApiProperty({ description: "Quyền quản lý" })
    @IsNotEmpty()   
    IsManagement: number;

    @ApiProperty({ description: "Trạng thái hoạt động" })
    @IsNotEmpty()
    Active: number;

    @ApiProperty({ description: "Người sửa" })
    @IsNotEmpty()
    @IsNumber()
    UpdatedBy: number;

    @ApiProperty({ description: "Ngày sửa" })
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    UpdatedAt: Date = new Date();
}