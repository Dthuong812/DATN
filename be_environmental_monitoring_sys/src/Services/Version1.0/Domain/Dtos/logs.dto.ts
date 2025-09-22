import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";

export class LogsDto {
  Id: number;
  LogTypeId: number;
  Service?: string;
  Action: string;
  Method: string;
  Content: string;
  Data: string;
  CreatedAt: Date;
  CreatedBy: number;
}

export class WriteLogsDto {
  LogTypeId: number;
  Service?: string;
  Action: string;
  Method: string;
  Content: string;
  Data: string;
  CreatedAt: Date;
  CreatedBy: number;
}
export class FilterLogsDto {
  @ApiProperty({ required: false, description: "page" })
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false, description: "pageSize" })
  @IsOptional()
  pageSize?: number;

  @ApiProperty({ required: false, description: "LogTypeName" })
  @IsOptional()
  LogTypeId?: number;

  @ApiProperty({ required: false, description: " Action" })
  @IsOptional()
  Action?: string;

  @ApiProperty({ required: false, description: "Service" })
  @IsOptional()
  Service?: string;

  @ApiProperty({ required: false, description: "Method" })
  @IsOptional()
  Method?: string;

  @ApiProperty({ required: false, description: "Ngày bắt đầu (YYYY-MM-DD)" })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false, description: "Ngày kết thúc (YYYY-MM-DD)" })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
