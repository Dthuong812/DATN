import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class refreshDto
{
  @ApiProperty({ required: false }) 
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}