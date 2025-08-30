import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, ValidateIf } from "class-validator";

export class AuthDto {
  @ApiPropertyOptional({ default: "dathuong" })
  @ValidateIf((o) => !o.Email && !o.Phone)
  @IsNotEmpty()
  @IsString()
  UserName?: string;

  @ApiPropertyOptional({ default: "thuongthanthien812@gmail.com" })
  @ValidateIf((o) => !o.UserName && !o.Phone)
  @IsNotEmpty()
  @IsString()
  Email?: string;

  @ApiPropertyOptional({ default: "0359821702" })
  @ValidateIf((o) => !o.UserName && !o.Email)
  @IsNotEmpty()
  @IsString()
  Phone?: string;

  @ApiProperty({ required: true, default: "?1T7f,6fPZW4" })
  @IsNotEmpty()
  @IsString()
  PassWord: string;

  
  recaptchaToken:string
}
export type JWTpayload = {
  sub: number;
  iat: string;
  exp: string;
  permissions: Array<string>
};
