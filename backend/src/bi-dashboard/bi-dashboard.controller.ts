import { Controller, Get, Query, ParseIntPipe, DefaultValuePipe, Param } from '@nestjs/common';
import { BIDashboardService } from './bi-dashboard.service';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

@Controller('dashboard')
export class BIDashboardController {
  constructor(private readonly dashboardService: BIDashboardService) { }

  @Get('bestsellers')
  async getBestSellers(
    @Query('limit', new DefaultValuePipe(9), ParseIntPipe) limit: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.dashboardService.getBestSellingProducts(limit, start, end);
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

  @Get('stats')
  async getDashboardStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.dashboardService.getDashboardStats(start, end);
  }

  @Get('monthly-customers')
  async getMonthlyCustomers(
    @Query('months', new DefaultValuePipe(6), ParseIntPipe) months: number,
  ) {
    return this.dashboardService.getMonthlyCustomers(months);
  }

  @Get('monthly-profit')
  async getMonthlyProfit(
    @Query('months', new DefaultValuePipe(6), ParseIntPipe) months: number,
  ) {
    return this.dashboardService.getMonthlyProfit(months);
  }

  @Get('recent-sales')
  async getRecentSales(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.dashboardService.getRecentSales(limit);
  }

  @Get('seller-commissions')
  async getSellerCommissions(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.dashboardService.getSellerCommissions(start, end);
  }

  @Get('seller-sales-details/:id')
  async getSellerDetailedSales(
    @Param('id', ParseIntPipe) sellerId: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.dashboardService.getSellerDetailedSales(sellerId, start, end);
  }
}
