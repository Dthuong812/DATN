import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { IsUnique } from "../../decorators/is-unique.decorator";
import { DevicesEntity } from "../Models/devices.entity";

export class DevicesDto {
  Id: number;
  Name: string;
  Series: string;
  Description: string;
  Sim: string;
  StationId: number;
  LastConnectedAt: Date;
  Status: number;
  CreatedAt: Date;
  CreatedBy: number;
  UpdatedAt: Date;
  UpdatedBy: number;
  DeletedAt: Date;
  DeletedBy: number;
}

export class PayLoadDeviceCreateDto {
  @ApiProperty({ description: "Tên thiết bị" })
  @IsNotEmpty()
  @IsString()
  Name: string;

  @ApiProperty({ description: "Số seri thiết bị" })
  @IsNotEmpty()
  @IsString()
  @IsUnique(DevicesEntity, "Series", { message: "Số seri thiết bị đã tồn tại" })
  Series: string;


  @ApiProperty({ description: "Mô tả thiết bị" })
  @IsNotEmpty()
  @IsString()
  Description: string;

  @ApiProperty({ description: "Số sim" })
  @IsNotEmpty()
  @IsString()
  @IsUnique(DevicesEntity, "Sim", { message: "Số Sim đã tồn tại" })
  Sim: string;

  @ApiProperty({ description: "ID Trạm" })
  @IsNotEmpty()
  @IsNumber()
  StationId: number;

  @ApiProperty({ description: "Trạng thái thiết bị" })
  @IsNotEmpty()
  @IsNumber()
  Status: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  CreatedBy?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  CreatedAt?: Date = new Date();
}

export class PayLoadDeviceUpdateDto {
  @IsOptional()
  Id?: number;

  @ApiProperty({ description: "Tên thiết bị" })
  @IsNotEmpty()
  @IsString()
  Name: string;

  @ApiProperty({ description: "Số seri thiết bị" })
  @IsNotEmpty()
  @IsString()
  @IsUnique(DevicesEntity, "Series", { message: "Số seri thiết bị đã tồn tại" })
  Series: string;

  @ApiProperty({ description: "Mô tả thiết bị" })
  @IsNotEmpty()
  @IsString()
  Description: string;

  @ApiProperty({ description: "Số sim" })
  @IsNotEmpty()
  @IsString()
  @IsUnique(DevicesEntity, "Sim", { message: "Số Sim đã tồn tại" })
  Sim: string;

  @ApiProperty({ description: "ID Trạm" })
  @IsNotEmpty()
  @IsNumber()
  StationId: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  UpdatedBy?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  UpdatedAt?: Date = new Date();
}
