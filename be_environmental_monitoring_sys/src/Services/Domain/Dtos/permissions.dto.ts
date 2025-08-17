import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class PermissionsDto{
    @ApiProperty({ required: false })
    @IsOptional() 
    Id?: number;
    @ApiProperty({ description: "Mã code" })
    @IsOptional() 
    Code: string;
    @ApiProperty({ description: "Tên quyền" })
    @IsOptional() 
    Name: string;
  }