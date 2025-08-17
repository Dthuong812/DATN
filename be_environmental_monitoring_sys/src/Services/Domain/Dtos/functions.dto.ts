import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsOptional, ValidateNested } from "class-validator";
import { PermissionsDto } from "./permissions.dto";
export class FunctionsDto {
    @ApiProperty({ required: false }) 
    @IsOptional() 
    Id?: number;
  
    @ApiProperty({ description: "Mã code" })
    @IsOptional() 
    Code: string;
  
    @ApiProperty({ description: "Tên chức năng" })
    @IsOptional() 
    Name: string;
  
    @ApiProperty({ description: "Mô tả chức năng" })
    @IsOptional() 
    Description: string;
  
    @ApiProperty({ type: [PermissionsDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PermissionsDto)
    Permissions: PermissionsDto[];
  }