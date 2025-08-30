import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { IsUnique } from "../../decorators/is-unique.decorator";
import { OrganizationEntity } from "../Models/organization.entity";
import { ProjectDto } from "./project.dto";

export class OrganizationDto {
  Id?: number;
  Local_Id?: number;
  Code?: string;
  Parent_Id?: number;
  Name?: string;
  Phone?: string;
  Email?: string;
  CreatedBy?: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  UpdatedBy?: number;
  DeletedAt?: Date;
}
export class CreateOrganizationDto {
  @ApiProperty({ description: "Local_Id" })
  @IsNumber()
  @IsUnique(OrganizationEntity, "Local_Id", { message: "Local_Id đã tồn tại" })
  Local_Id: number;
  @ApiProperty({ description: "Mã Code dự án" })
  @IsString()
  @IsUnique(OrganizationEntity, "Code", { message: "Code đã tồn tại" })
  Code: string;
  @ApiProperty({ description: "Parent_Id", required: false, nullable: true })
  @IsOptional()
  @IsNumber()
  Parent_Id?: number | null;  
  @ApiProperty({ description: "Tên tổ chức" , nullable: true})
  @IsString()
  Name: string;
  @ApiProperty({ description: "Số điện thoại" })
  @IsString()
  Phone: string;
  @ApiProperty({ description: "Email" })
  @IsString()
  Email: string;
  CreatedBy: number;
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  CreatedAt?: Date = new Date();
  @ApiProperty({ type: [ProjectDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectDto)
  Project: ProjectDto[];
}
export class UpdateOrganizationDto {
  @IsOptional()
  Id?: number;
  @ApiProperty({ description: "Local_Id" })
  @IsNumber()
  Local_Id: number;
  @ApiProperty({ description: "Mã Code dự án" })
  @IsString()
  @IsUnique(OrganizationEntity, "Code", { message: "Code đã tồn tại" })
  Code: string;
  @ApiProperty({ description: "Parent_Id", required: false, nullable: true })
  @IsOptional()
  @IsNumber()
  Parent_Id?: number | null;  
  @ApiProperty({ description: "Tên tổ chức" })
  @IsString()
  Name: string;
  @ApiProperty({ description: "Số điện thoại" })
  @IsString()
  Phone: string;
  @IsUnique(OrganizationEntity, "Phone", { message: "Phone đã tồn tại" })
  @ApiProperty({ description: "Email" })
  @IsString()
  @IsUnique(OrganizationEntity, "Email", { message: "Email đã tồn tại" })
  Email: string;
  UpdatedBy: number;
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  UpdatedAt?: Date = new Date();
  @ApiProperty({ type: [ProjectDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectDto)
  Project: ProjectDto[];
}
