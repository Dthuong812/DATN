import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class ParamBaoCaoTongHopTrungBinh {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startTime: string;
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endTime: string;
  @ApiProperty({ required: false })
  @IsOptional()
  objectCode: string;
  @ApiProperty({ required: true, default: 1 })
  @IsOptional()
  @IsNumber()
  Page: number;

  @ApiProperty({ required: true, default: 10 })
  @IsOptional()
  @IsNumber()
  PageSize: number;
}
