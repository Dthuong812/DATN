import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { IsUnique } from "src/Services/decorators/is-unique.decorator";
import { SensorsTypesEntity } from "../Models/sensor_types.entity";

export class SensorTypesDto {
  Id: number;
  Name: string;
  Description: string;
  Unit: string;
  Min_Value: number;
  Max_Value: number;
  CreatedAt: Date;
  UpdatedAt: Date;
  CreatedBy: number;
  UpdatedBy: number;
  DeletedAt: Date;
  DeletedBy: number;
}

export class payLoadCreateSensorTypeDto {
  @ApiProperty({ description: "Tên loại thiết bị" })
  @IsNotEmpty()
  @IsString()
  @IsUnique(SensorsTypesEntity, "Name", { message: "Tên loại thiết bị đã tồn tại" })
  Name: string;

  @ApiProperty({ description: "Mô tả loại thiết bị" })
  @IsNotEmpty()
  @IsString()
  Description: string;

  @ApiProperty({ description: "Đơn vị đo lường" })
  @IsNotEmpty()
  @IsString()
  Unit: string;

  @ApiProperty({ description: "Giá trị tối thiểu" })
  @IsNotEmpty()
  @IsNumber()
  Min_Value: number;

  @ApiProperty({ description: "Giá trị tối đa" })
  @IsNotEmpty()
  @IsNumber()
  Max_Value: number;

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
export class payLoadUpdateSensorTypeDto {
  @IsOptional()
  Id?: number;

  @ApiProperty({ description: "Tên loại thiết bị" })
  @IsNotEmpty()
  @IsString()
  @IsUnique(SensorsTypesEntity, "Name", { message: "Tên loại thiết bị đã tồn tại" })
  Name: string;

  @ApiProperty({ description: "Mô tả loại thiết bị" })
  @IsNotEmpty()
  @IsString()
  Description: string;

  @ApiProperty({ description: "Đơn vị đo lường" })
  @IsNotEmpty()
  @IsString()
  Unit: string;

  @ApiProperty({ description: "Giá trị tối thiểu" })
  @IsNotEmpty()
  @IsNumber()
  Min_Value: number;

  @ApiProperty({ description: "Giá trị tối đa" })
  @IsNotEmpty()
  @IsNumber()
  Max_Value: number;

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
