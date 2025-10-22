import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SaleNotesService } from './salesnotes.service';
import { CreateSaleNoteDto } from './dto/create-salesnotes.dto';
import { UpdateSaleNoteDto } from './dto/update-salesnotes.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sale-notes')
export class SaleNotesController {
  constructor(private readonly saleNotesService: SaleNotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createSaleNoteDto: CreateSaleNoteDto, @Req() req) {
    const sellerId = req.user.userId;
    return this.saleNotesService.create(createSaleNoteDto, sellerId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.saleNotesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.saleNotesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSaleNoteDto: UpdateSaleNoteDto,
  ) {
    return this.saleNotesService.update(id, updateSaleNoteDto);
  }
}
