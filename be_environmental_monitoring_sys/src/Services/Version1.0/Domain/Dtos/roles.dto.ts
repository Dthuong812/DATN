import { Function } from './../../../../../../fe_environmental_monitoring_sys/src/types/types';
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
  @ApiProperty({ required: false })
  @IsOptional() 
  Id: number;
  Code: string;
  Name: string;
  Description: string;
  CreatedAt: Date;
}
export class ProjectsDto{
  @ApiProperty({ required: false })
  @IsOptional()
  Id?: number;
  Name?: string;
  Code?: string;
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
    description: "Danh sách dự án",
    type: () => [ProjectsDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectsDto)
  Projects?: ProjectsDto[];

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
    description: "Danh sách dự án",
    type: () => [ProjectsDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectsDto)
  Projects?: ProjectsDto[];
}
