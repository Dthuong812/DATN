import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { FunctionsDto } from "./functions.dto";
import { Type } from "class-transformer";

export class RolesDto {
  Id: number;
  Code: string;
  Name: string;
  Description: string;
  CreatedAt: Date;
}

export class PayloadCreateRoleDto {
  @ApiProperty({ description: "Mã code" })
  @IsNotEmpty()
  Code: string;

  @ApiProperty({ description: "Tên vai trò" })
  @IsNotEmpty()
  Name: string;

  @ApiProperty({ description: "Mô tả vai trò" })
  @IsOptional()
  Description: string;

  @ApiProperty({
    description: "Danh sách chức năng",
    type: () => [FunctionsDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FunctionsDto)
  Functions?: FunctionsDto[];

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  CreatedAt?: Date = new Date();
}

export class PayloadUpdateRoleDto {
  @ApiProperty({ description: "Mã code" })
  @IsNotEmpty()
  Code: string;

  @ApiProperty({ description: "Tên vai trò" })
  @IsNotEmpty()
  Name: string;

  @ApiProperty({ description: "Mô tả vai trò" })
  @IsOptional()
  Description: string;

  @ApiProperty({
    description: "Danh sách chức năng",
    type: () => [FunctionsDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FunctionsDto)
  Functions?: FunctionsDto[];
}
