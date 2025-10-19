import { IsString, IsOptional, IsNumberString, IsNumber } from 'class-validator';

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
  @IsNumber()
  sriEnvironment?: number;
}
