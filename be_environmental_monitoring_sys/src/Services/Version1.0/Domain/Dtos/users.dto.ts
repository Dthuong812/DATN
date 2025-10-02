import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  Matches,
  MinLength,
  ValidateNested,
} from "class-validator";
import { UserRoleAssignmentsDto } from "./user_role_assignments.dto";
import { RolesDto } from "./roles.dto";
import { FunctionsDto } from "./functions.dto";

export class UserDto {
  Id: number;
  UserName: string;
  PassWord: string;
  FullName: string;
  Email: string;
  Phone: string;
  ChangePasswordAt: Date;
  Organization_Id: number;
  Department_id?: Number;
  Active: number;
  CreatedBy: number;
  CreatedAt: Date;
  UpdatedBy: number;
  UpdatedAt: Date;
  DeletedAt?: Date;
}

export class ProjectUserDto {
  @ApiProperty({ description: "Dự án" })
  @IsNotEmpty()
  @IsNumber()
  ProjectId: number;
  @ApiProperty({ type: [RolesDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RolesDto)
  Roles: RolesDto[];
}
export class FuncPersUserDto {
  @ApiProperty({ description: "Dự án" })
  @IsNotEmpty()
  @IsNumber()
  ProjectId: number;
  @ApiProperty({
    description: "Danh sách chức năng",
    type: () => [FunctionsDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FunctionsDto)
  Functions?: FunctionsDto[];
}
export class PayLoadCreateUserDto {
  @ApiProperty({ description: "Tên đăng nhập" })
  @IsNotEmpty()
  @IsString()
  UserName: string;

  @ApiProperty({ description: "Mật khẩu" })
  @IsString()
  @MinLength(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/, {
    message: "Mật khẩu phải chứa chữ hoa, chữ thường và số",
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

  @ApiProperty({ description: "ID tổ chức" })
  @IsNotEmpty()
  Organization_Id: number;

  @ApiProperty({ description: "Id phòng ban" })
  @IsOptional()
  Department_Id: number;

  @ApiProperty({ description: "Trạng thái hoạt động" })
  @IsOptional()
  Active: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  CreatedBy?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  CreatedAt?: Date = new Date();

  @ApiProperty({ type: [ProjectUserDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectUserDto)
  Projects: ProjectUserDto[];

  @ApiProperty({ type: [FuncPersUserDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FuncPersUserDto)
  FuncPers: FuncPersUserDto[];
}
export class PayLoadUpdateUserDto {
  @ApiProperty({ description: "Tên đăng nhập" })
  @IsNotEmpty()
  @IsString()
  UserName: string;

  @ApiProperty({ description: "Mật khẩu" })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/, {
    message: "Mật khẩu phải chứa chữ hoa, chữ thường và số",
  })
  PassWord?: string;

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

  @ApiProperty({ description: "ID tổ chức" })
  @IsNotEmpty()
  Organization_Id: number;

  @ApiProperty({ description: "Id phòng ban" })
  @IsNotEmpty()
  Department_Id: number;

  @ApiProperty({ description: "Trạng thái hoạt động" })
  @IsNotEmpty()
  @IsOptional()
  Active: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  UpdatedBy?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  UpdatedAt?: Date = new Date();


  @ApiProperty({ type: [ProjectUserDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectUserDto)
  Projects: ProjectUserDto[];

  @ApiProperty({ type: [FuncPersUserDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FuncPersUserDto)
  FuncPers: FuncPersUserDto[];
}
export class ResetPasswordDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        "Mật khẩu phải có ít nhất 6 ký tự, 1 chữ thường, 1 chữ hoa, 1 sô và 1 ký tự đặc biệt",
    }
  )
  PassWord: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  UpdatedBy?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  UpdatedAt?: Date = new Date();
}
export class ChangePasswordDto {
  Id: number;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Mật khẩu cũ" })
  OldPassWord: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        "Mật khẩu phải có ít nhất 6 ký tự, 1 chữ thường, 1 chữ hoa, 1 sô và 1 ký tự đặc biệt",
    }
  )
  @ApiProperty({ description: "Mật khẩu mới" })
  PassWord: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Nhập lại mật khẩu" })
  PassWordAgain: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  ChangePasswordAt?: Date;
}
export class ForgotPassWordDto {
  @ApiProperty({ description: "Tên đăng nhập" })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  UserName: string;
  @ApiProperty({ description: "Email" })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  Email?: string;
  @ApiProperty({ description: "Phone" })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  Phone?: string;
}
