import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsUnique } from "../../decorators/is-unique.decorator";
import { LocationsEntity } from "../Models/locations.entity";

export class LocationsDto {
  Id: number;
  Name: string;
  CreatedAt: Date;
  DeletedAt: Date;
}

export class PayloadCreateLocationDto {
  @ApiProperty({ description: "Tên khu vực" })
  @IsString()
  @IsNotEmpty()
  @IsUnique(LocationsEntity, "Name", { message: "Tên khu vực đã tồn tại" })
  Name: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  CreatedAt?: Date = new Date();
}

export class PayloadUpdateLocationDto {
  @IsOptional()
  Id?: number;

  @ApiProperty({ description: "Tên khu vực" })
  @IsString()
  @IsNotEmpty()
  @IsUnique(LocationsEntity, "Name", { message: "Tên khu vực đã tồn tại" })
  Name: string;
}
