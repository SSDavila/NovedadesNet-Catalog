import { Controller, Get, Body, Patch, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  find() {
    return this.companyService.find();
  }

  @Patch()
  @UseInterceptors(FileInterceptor('sriCert', {
    storage: diskStorage({
      destination: './uploads/certs',
      filename: (req, file, cb) => {
        const filename = 'firma.p12';
        cb(null, filename);
      },
    }),
  }))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
  update(
    @Body() updateCompanyDto: UpdateCompanyDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
        ],
        fileIsRequired: false,
      }),
    ) file?: Express.Multer.File,
  ) {
    return this.companyService.upsert(updateCompanyDto, file);
  }
}
