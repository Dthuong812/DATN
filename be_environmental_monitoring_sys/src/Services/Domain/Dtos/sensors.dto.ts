import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { IsUnique } from "src/Services/decorators/is-unique.decorator";
import { SensorsEntity } from "../Models/sensors.entity";

export class SensorsDto {
  Id: number;
  Name: string;
  StationId: number;
  TypeId: number;
  Series: string;
  NhaSX: string;
  Model: string;
  Status: number;
  CreatedAt: Date;
  UpdatedAt: Date;
  CreatedBy: number;
  UpdatedBy: number;
  DeletedAt: Date;
  DeletedBy: number;
}
export class PayLoadCreateSensorDto {
  @IsNotEmpty()
  @ApiProperty({ description: "Tên cảm biến" })
  Name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: "ID Trạm" })
  StationId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: "ID Loại cảm biến" })
  TypeId: number;

  @IsNotEmpty()
  @ApiProperty({ description: "Series " })
  @IsString()
  @IsUnique(SensorsEntity, "Series", { message: "Series đã tồn tại" })
  Series: string;

  @IsNotEmpty()
  @ApiProperty({ description: "Nhà sản xuất " })
  @IsString()
  NhaSX: string;

  @IsNotEmpty()
  @ApiProperty({ description: "Model cảm biến" })
  @IsString()
  Model: string;
  @ApiProperty({ description: "Trạng thái cảm biến" })
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

export class PayLoadUpdateSensorDto {
  @IsOptional()
  Id?: number;
  @IsNotEmpty()
  @ApiProperty({ description: "Tên cảm biến" })
  Name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: "ID Trạm" })
  StationId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: "ID Loại cảm biến" })
  TypeId: number;

  @IsNotEmpty()
  @ApiProperty({ description: "Series " })
  @IsString()
  @IsUnique(SensorsEntity, "Series", { message: "Series đã tồn tại" })
  Series: string;

  @IsNotEmpty()
  @ApiProperty({ description: "Nhà sản xuất " })
  @IsString()
  NhaSX: string;

  @IsNotEmpty()
  @ApiProperty({ description: "Model cảm biến" })
  @IsString()
  Model: string;
  @ApiProperty({ description: "Trạng thái cảm biến" })
  @IsNotEmpty()
  @IsNumber()
  Status: number;

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
