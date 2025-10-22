import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { SaleNotesService } from './salesnotes.service';
import { CreateSaleNoteDto } from './dto/create-salesnotes.dto';
import { UpdateSaleNoteDto } from './dto/update-salesnotes.dto';

@Controller('sale-notes')
export class SaleNotesController {
  constructor(private readonly saleNotesService: SaleNotesService) {}

  @Post()
  create(@Body() createSaleNoteDto: CreateSaleNoteDto) {
    return this.saleNotesService.create(createSaleNoteDto);
  }

  @Get()
  findAll() {
    return this.saleNotesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.saleNotesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSaleNoteDto: UpdateSaleNoteDto,
  ) {
    return this.saleNotesService.update(id, updateSaleNoteDto);
  }
}

