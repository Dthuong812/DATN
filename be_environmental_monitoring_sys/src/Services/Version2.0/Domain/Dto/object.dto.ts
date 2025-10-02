import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";
import { IsUnique } from "../../decorators/is-unique.decorator";
import { ObjectEntity } from "../Models/object.entity";
import { Type } from "class-transformer";

export class ObjectDto {
  Id?: number;
  Code?: string;
  Name?: string;
  Project_Code?: string;
  Organization_Code?: string;
  Status?: number;
  Latitude?: number;
  Longitude?: number;
  Details_Value?: Record<string, any>;
  CreatedBy?: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  UpdatedBy?: number;
  DeletedAt?: Date;
}

export class CreateObjectDto {
  @ApiProperty({ description: "Mã Code đối tượng" })
  @IsString()
  @IsUnique(ObjectEntity, "Code", { message: "Code đã tồn tại" })
  Code: string;
  @ApiProperty({ description: "Tên đối tượng" })
  @IsString()
  Name: string;
  @ApiProperty({ description: "Mã dự án" })
  @IsString()
  Project_Code: string;
  @ApiProperty({ description: "Mã tổ chức" })
  @IsString()
  Organization_Code: string;
  @ApiProperty({ description: "Trạng thái" })
  @IsNumber()
  @Type(() => Number)
  Status: number;
  @ApiProperty({ description: "Vĩ độ" })
  @IsNumber()
  @Type(() => Number)
  Latitude: number;
  @ApiProperty({ description: "Kinh độ" })
  @IsNumber()
  @Type(() => Number)
  Longitude: number;
  @ApiProperty({
    description: "Thông tin chi tiết dạng json",
    required: false,
    nullable: true,
  })
  @IsOptional()
  Details_Value: Record<string, any>;
  CreatedBy: number;
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  CreatedAt?: Date = new Date();
}
export class UpdateObjectDto {
  @IsOptional()
  Id?: number;
  @ApiProperty({ description: "Mã Code đối tượng" })
  @IsString()
  @IsUnique(ObjectEntity, "Code", { message: "Code đã tồn tại" })
  Code: string;
  @ApiProperty({ description: "Tên đối tượng" })
  @IsString()
  Name: string;
  @ApiProperty({ description: "Mã dự án" })
  @IsString()
  Project_Code: string;
  @ApiProperty({ description: "Mã tổ chức" })
  @IsString()
  Organization_Code: string;
  @ApiProperty({ description: "Trạng thái" })
  @IsNumber()
  @Type(() => Number)
  Status: number;
  @ApiProperty({ description: "Vĩ độ" })
  @IsNumber()
  @Type(() => Number)
  Latitude: number;
  @ApiProperty({ description: "Kinh độ" })
  @IsNumber()
  @Type(() => Number)
  Longitude: number;
  @ApiProperty({
    description: "Thông tin chi tiết dạng json",
    required: false,
    nullable: true,
  })
  @IsOptional()
  Details_Value: Record<string, any>;
  UpdatedBy: number;
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  UpdatedAt?: Date = new Date();
}
export class FilterObjectDto {
  @ApiProperty({ required: false, description: "page" })
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false, description: "pageSize" })
  @IsOptional()
  pageSize?: number;

  @ApiProperty({ required: false, description: "Code" })
  @IsOptional()
  Code?: number;

  @ApiProperty({ required: false, description: "Name" })
  @IsOptional()
  Name?: number;

  @ApiProperty({ required: false, description: "Organization_Code" })
  @IsOptional()
  Organization_Code?: number;

  @ApiProperty({ required: false, description: "Project_Code" })
  @IsOptional()
  Project_Code?: string;

  @ApiProperty({ required: false, description: "Status" })
  @IsOptional()
  Status?: number;

  @ApiProperty({ required: false, description: "Address" })
  @IsOptional()
  Address?: string;

  @ApiProperty({ required: false, description: "Connection_Type" })
  @IsOptional()
  Connection_Type?: string;

  @ApiProperty({ required: false, description: "Ngày cài đặt (YYYY-MM-DD)" })
  @IsOptional()
  @IsDateString()
  Installation_Date?: string;

  @ApiProperty({ required: false, description: "Ngày bảo trì (YYYY-MM-DD)" })
  @IsOptional()
  @IsDateString()
  Last_Maintenance_Date?: string;
}