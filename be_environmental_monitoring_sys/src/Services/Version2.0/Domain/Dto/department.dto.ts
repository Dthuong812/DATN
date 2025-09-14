import { ApiProperty } from "@nestjs/swagger";
import { IsUnique } from "../../decorators/is-unique.decorator";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";
import { DepartmentEntity } from "../Models/department.entity";
import { Type } from "class-transformer";

export class DepartmentDto {
    Id?: number;
    Code?: string
    Name?: string;
    Phone?: string;
    Email?: string
    Parent_Id?: number;
    Organization_Id?: number;
    CreatedBy?: number;
    CreatedAt?: Date;
    UpdatedBy?: number;
    UpdatedAt?: Date;
    DeletedAt?: Date;
}

export class CreateDepartmentDto {
    @ApiProperty({ description: "Mã Code phòng ban" })
    @IsString()
    @IsUnique(DepartmentEntity, "Code", { message: "Code đã tồn tại" })
    Code: string;
    @ApiProperty({ description: "Tên phòng ban" })
    @IsString()
    Name: string;
    @ApiProperty({ description: "Số điện thoại" })
    @IsString() 
    @IsUnique(DepartmentEntity, "Phone", { message: "Phone đã tồn tại" })
    Phone: string;
    @ApiProperty({ description: "Email" })
    @IsString()
    @IsUnique(DepartmentEntity, "Email", { message: "Email đã tồn tại" })
    Email: string;
    @ApiProperty({ description: "Parent_Id", required: false, nullable: true })
    @IsOptional()
    @IsNumber()
    Parent_Id?: number | null;
    @ApiProperty({ description: "Organization_Id" })
    @IsNumber()
    Organization_Id: number;
    CreatedBy: number;
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    CreatedAt?: Date = new Date();
}
export class UpdateDepartmentDto {
    @IsOptional()
    Id?: number;
    @ApiProperty({ description: "Mã Code phòng ban" })
    @IsString()
    @IsUnique(DepartmentEntity, "Code", { message: "Code đã tồn tại" })
    Code: string;
    @ApiProperty({ description: "Tên phòng ban" })
    @IsString()
    Name: string;
    @ApiProperty({ description: "Số điện thoại" })
    @IsString() 
    @IsUnique(DepartmentEntity, "Phone", { message: "Phone đã tồn tại" })
    Phone: string;
    @ApiProperty({ description: "Email" })
    @IsString()
    @IsUnique(DepartmentEntity, "Email", { message: "Email đã tồn tại" })
    Email: string;
    @ApiProperty({ description: "Parent_Id", required: false, nullable: true })
    @IsOptional()
    @IsNumber()
    Parent_Id?: number | null;
    @ApiProperty({ description: "Organization_Id" })
    @IsNumber()
    Organization_Id: number;
    UpdatedBy: number;
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    UpdatedAt?: Date = new Date();
}

export class PayloadFilterDepartmentDto {
    @ApiProperty({ required: false, description: "page" })
    @IsOptional()
    page?: number;
  
    @ApiProperty({ required: false, description: "pageSize" })
    @IsOptional()
    pageSize?: number;
  
    @IsOptional()
    @ApiProperty({ required: false })
    Organization_Id?: number;
  
    @ApiProperty({ required: false, description: "Trường sort" })
    @IsOptional()
    sortField?: string;
  
    @ApiProperty({ required: false, description: "Kiểu sort DESC/ASC" })
    @IsOptional()
    sortOrder?: string;
  }
  