import { Controller, Get, Body, Patch, UsePipes, ValidationPipe } from '@nestjs/common';
import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  find() {
    return this.companyService.find();
  }

  @Patch()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.upsert(updateCompanyDto);
  }
}
