import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LocationsDto {
  Id: number;
  Name: string;
  CreatedAt: Date;
}

export class PayloadCreateLocationDto {
  @ApiProperty({ description: "Tên khu vực" })
  @IsString()
  @IsNotEmpty()
  Name: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  CreatedAt?: Date = new Date();
}

export class PayloadUpdateLocationDto {
  @ApiProperty({ description: "Tên khu vực" })
  @IsString()
  @IsNotEmpty()
  Name: string;
}
