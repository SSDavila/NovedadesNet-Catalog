import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdjustStockDto } from './dto/adjust-stock.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('stock')
  @UseGuards(JwtAuthGuard)
  findAllStock() {
    return this.inventoryService.findAllStock();
  }

  @Post('adjust')
  @UseGuards(JwtAuthGuard)
  adjustStock(
    @Body(new ValidationPipe()) items: AdjustStockDto[],
    @Req() req,
  ) {
    const userId = req.user.userId;
    return this.inventoryService.adjustStock(items, userId);
  }
}