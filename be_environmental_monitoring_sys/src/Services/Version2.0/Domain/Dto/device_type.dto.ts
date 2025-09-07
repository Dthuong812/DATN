import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { DeviceTypeEntity } from "../Models/device_type.entity";
import { IsUnique } from "../../decorators/is-unique.decorator";

export class DeviceTypeDto {
  Id: number;
  Code: string;
  Name: string;
}
export class CreateDeviceTypeDto {
  @ApiProperty({ description: "Mã Code loại thiết bị" })
  @IsString()
  @IsUnique(DeviceTypeEntity, "Code", {
    message: "Code loại thiết bị đã tồn tại",
  })
  Code: string;
  @ApiProperty({ description: "Tên loại thiết bị" })
  @IsString()
  Name: string;
}
export class UpdateDeviceTypeDto {
  @IsOptional()
  Id?: number;
  @ApiProperty({ description: "Mã Code loại thiết bị" })
  @IsString()
  @IsUnique(DeviceTypeEntity, "Code", {
    message: "Code loại thiết bị đã tồn tại",
  })
  Code: string;
  @ApiProperty({ description: "Tên loại thiết bị" })
  @IsString()
  Name: string;
}
