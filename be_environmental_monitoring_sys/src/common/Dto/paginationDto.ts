import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class paginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'Số trang phải lớn hơn 0' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'Số lượng pahir lớn hơn 0' })
  @Max(50, { message: 'Số lượng phải nhỏ hơn hoặc bằng 50' })
  limit?: number;
}
