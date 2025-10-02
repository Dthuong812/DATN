import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class DeviceDataDto {
  Id?: number;
  Devices_Code?: string;
  Project_Code?: string;
  Object_Code?: string;
  DataJson?: Record<string, any>;
  Times?: Date;
  Speed?: number;
  DataType?: number;
  Latitude?: number;
  Longitude?: number;
}
export class FilterDeviceDataDto {
  @ApiProperty({ required: false, description: "page" })
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false, description: "pageSize" })
  @IsOptional()
  pageSize?: number;

  @ApiProperty({ description: "Mã Code thiết bị", required: false })
  @IsOptional()
  @IsString()
  Devices_Code?: string;
  @ApiProperty({ description: "Mã Code dự án ", required: false })
  @IsOptional()
  @IsString()
  Project_Code?: string;
  @ApiProperty({ description: "Mã Code đối tượng", required: false })
  @IsOptional()
  @IsString()
  Object_Code?: string;
  @ApiProperty({ description: "Loại dữ liệu", required: false })
  @IsOptional()
  DataType?: number;
}
