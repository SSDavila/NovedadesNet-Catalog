import { Controller, Get, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { BIDashboardService } from './bi-dashboard.service';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

@Controller('dashboard')
export class BIDashboardController {
  constructor(private readonly dashboardService: BIDashboardService) {}

  @Get('bestsellers')
  async getBestSellers(
    @Query('limit', new DefaultValuePipe(9), ParseIntPipe) limit: number,
  ) {
    return this.dashboardService.getBestSellingProducts(limit);
  }

  @Get('sales-summary')
  async getSalesSummary(
    @Query('month', new DefaultValuePipe(0), ParseIntPipe) monthOffset: number,
  ) {
    const targetDate = subMonths(new Date(), monthOffset);
    const startDate = startOfMonth(targetDate);
    const endDate = endOfMonth(targetDate);

    return this.dashboardService.getSalesAndProfitSummary(startDate, endDate);
  }
}
