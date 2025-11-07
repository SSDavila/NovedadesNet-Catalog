import { IsString, IsOptional, IsNumberString, IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  companyTradeName?: string;

  @IsOptional()
  @IsNumberString()
  companyRuc?: string;

  @IsOptional()
  @IsString()
  companyAddress?: string;

  @IsOptional()
  @IsString()
  companyObligedToAccount?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sriEnvironment?: number;

  @IsOptional()
  @IsString()
  sriPassword?: string;
}
