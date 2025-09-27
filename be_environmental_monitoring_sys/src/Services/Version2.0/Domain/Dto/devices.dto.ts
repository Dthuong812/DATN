import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsOptional, IsString } from "class-validator";
import { IsUnique } from "../../decorators/is-unique.decorator";
import { DeviceEntity } from "../Models/devices.entity";
import { Type } from "class-transformer";

export class DeviceDto {
  Id?: number;
  Code?: string;
  DeviceType_Code?: string;
  Object_Code?: string;
  Icon_Id?: number;
  Name?: string;
  Series?: string;
  Details_Data?: Record<string, any>;
  Latitude?: number;
  Longitude?: number;
  CreatedBy?: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  UpdatedBy?: number;
  DeletedAt?: Date;
}
export class CreateDeviceDto {
  @ApiProperty({ description: "Mã Code thiết bị" })
  @IsString()
  @IsUnique(DeviceEntity, "Code", { message: "Code đã tồn tại" })
  Code: string;
  @ApiProperty({ description: "Mã Code loại thiết bị" })
  @IsString()
  DeviceType_Code: string;
  @ApiProperty({ description: "Mã Code đối tượng" })
  @IsString()
  Object_Code: string;
  @ApiProperty({ description: "Tên thiết bị" })
  @IsString()
  Name: string;
  @ApiProperty({ description: "Số series" })
  @IsString()
  Series: string;
  @ApiProperty({ description: "Mã icon", required: false, nullable: true })
  @IsOptional()
  Icon_Id?: number;
  @ApiProperty({
    description: "Thông tin chi tiết dạng json",
    required: false,
    nullable: true,
  })
  @IsOptional()
  Details_Data?: Record<string, any>;
  @ApiProperty({ description: "Vĩ độ", required: false, nullable: true })
  @IsOptional()
  Latitude?: number;
  @ApiProperty({ description: "Kinh độ", required: false, nullable: true })
  @IsOptional()
  Longitude?: number;
  CreatedBy: number;
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  CreatedAt?: Date = new Date();
}
export class UpdateDeviceDto {
  @IsOptional()
  Id?: number;
  @ApiProperty({ description: "Mã Code thiết bị" })
  @IsString()
  @IsUnique(DeviceEntity, "Code", { message: "Code đã tồn tại" })
  Code: string;
  @ApiProperty({ description: "Mã Code loại thiết bị" })
  @IsString()
  DeviceType_Code: string;
  @ApiProperty({ description: "Mã Code đối tượng" })
  @IsString()
  Object_Code: string;
  @ApiProperty({ description: "Tên thiết bị" })
  @IsString()
  Name: string;
  @ApiProperty({ description: "Số series" })
  @IsString()
  Series: string;
  @ApiProperty({ description: "Mã icon", required: false, nullable: true })
  @IsOptional()
  Icon_Id?: number;
  @ApiProperty({
    description: "Thông tin chi tiết dạng json",
    required: false,
    nullable: true,
  })
  @IsOptional()
  Details_Data?: Record<string, any>;
  @ApiProperty({ description: "Vĩ độ", required: false, nullable: true })
  @IsOptional()
  Latitude?: number;
  @ApiProperty({ description: "Kinh độ", required: false, nullable: true })
  @IsOptional()
  Longitude?: number;
  UpdatedBy: number;
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  UpdatedAt?: Date = new Date();
}


export class FilterDeviceDto {
  @ApiProperty({ required: false, description: "page" })
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false, description: "pageSize" })
  @IsOptional()
  pageSize?: number;

  @ApiProperty({ description: "Mã Code thiết bị", required: false })
  @IsOptional()
  @IsString()
  Code?: string;
  @ApiProperty({ description: "Mã Code loại thiết bị", required: false })
  @IsOptional()
  @IsString()
  DeviceType_Code?: string
  @ApiProperty({ description: "Mã Code đối tượng", required: false })
  @IsOptional()
  @IsString()
  Object_Code?: string
  @ApiProperty({ description: "Tên thiết bị", required: false })
  @IsOptional()
  @IsString()
  Name?: string;
  @ApiProperty({ description: "Số series", required: false })
  @IsOptional()
  @IsString()
  Series?: string
}