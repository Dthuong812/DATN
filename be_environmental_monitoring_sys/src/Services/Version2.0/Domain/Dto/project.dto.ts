import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { ProjectEntity } from "../Models/project.entity";
import { IsUnique } from "../../decorators/is-unique.decorator";

export class ProjectDto {
  @ApiProperty({ required: false })
  @IsOptional() 
  Id: number;
  Code: string;
  Name: string;
  Description: string;
}

export class CreateProjectDto {
  @ApiProperty({ description: "Mã Code dự án" })
  @IsString()
  @IsUnique(ProjectEntity, "Code", { message: "Code dự án đã tồn tại" })
  Code: string;
  @ApiProperty({ description: "Tên dự án" })
  @IsString()
  Name: string;
  @ApiProperty({ description: "Mô tả" })
  @IsString()
  Description: string;
}
export class UpdateProjectDto {
  @IsOptional()
  Id?: number;
  @ApiProperty({ description: "Mã Code dự án" })
  @IsString()
  @IsUnique(ProjectEntity, "Code", { message: "Code dự án đã tồn tại" })
  Code: string;
  @ApiProperty({ description: "Tên dự án" })
  @IsString()
  Name: string;
  @ApiProperty({ description: "Mô tả" })
  @IsString()
  Description: string;
}
