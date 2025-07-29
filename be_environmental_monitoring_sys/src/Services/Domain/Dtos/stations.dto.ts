import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class StationsDto {
  Id: number;
  Name: string;
  Address: string;
  LocationId: number;
  Lat: number;
  Lng: number;
  CreatedAt: Date;
  UpdatedAt: Date;
  CreatedBy: number;
  UpdatedBy: number;
  DeletedAt: Date;
  DeletedBy: number;
  Status: number;
}
export class PayLoadCreateStationDto {
  @ApiProperty({ description: "Tên trạm" })
  @IsNotEmpty()
  @IsString()
  Name: string;

  @ApiProperty({ description: "Địa chỉ trạm" })
  @IsNotEmpty()
  @IsString()
  Address: string;

  @ApiProperty({ description: "ID của đơn vị quản lí" })
  @IsNumber()
  @IsNotEmpty()
  LocationId: number;

  @ApiProperty({ description: "Vĩ độ" })
  @IsNumber()
  @IsNotEmpty()
  Lat: number;

  @ApiProperty({ description: "Kinh độ" })
  @IsNumber()
  @IsNotEmpty()
  Lng: number;

  @ApiProperty({ description: "Trạng thái" })
  @IsNotEmpty()
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
export class PayLoadUpdateStationDto {
  @ApiProperty({ description: "Tên trạm" })
  @IsNotEmpty()
  @IsOptional()
  Name?: string;

  @ApiProperty({ description: "Địa chỉ trạm" })
  @IsNotEmpty()
  @IsOptional()
  Address?: string;

  @ApiProperty({ description: "ID của đơn vị quản lí" })
  @IsNumber()
  @IsOptional()
  LocationId?: number;

  @ApiProperty({ description: "Vĩ độ" })
  @IsNumber()
  @IsOptional()
  Lat?: number;

  @ApiProperty({ description: "Kinh độ" })
  @IsNumber()
  @IsOptional()
  Lng?: number;

  @ApiProperty({ description: "Trạng thái" })
  @IsOptional()
  Status?: number;


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
export class DeleteMultipleStationsDto {
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  ids: number[];
}