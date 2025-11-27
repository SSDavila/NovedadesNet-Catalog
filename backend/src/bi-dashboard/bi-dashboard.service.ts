import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BIDashboardService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtain best seller products
   * @param limit - number of products to return
   * @param startDate - Optional start date for filtering
   * @param endDate - Optional end date for filtering
   */

  async getBestSellingProducts(limit: number = 10, startDate?: Date, endDate?: Date) {
    const dateFilter = startDate && endDate ? {
      invoice: {
        invoiceCreatedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    } : {};

    const saleNoteDateFilter = startDate && endDate ? {
      saleNote: {
        saleNoteCreatedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    } : {};

    const saleNoteSales = await this.prisma.saleNoteItem.groupBy({
      by: ['productId'],
      where: saleNoteDateFilter,
      _sum: {
        saleNoteItemQuantity: true,
      },
      orderBy: {
        _sum: {
          saleNoteItemQuantity: 'desc',
        },
      },
    });

    const invoiceSales = await this.prisma.invoiceItem.groupBy({
      by: ['productId'],
      where: dateFilter,
      _sum: {
        invoiceItemQuantity: true,
      },
      orderBy: {
        _sum: {
          invoiceItemQuantity: 'desc',
        },
      },
    });

    const combinedSales = new Map<string, number>();

    saleNoteSales.forEach(item => {
      const currentSales = combinedSales.get(item.productId) || 0;
      combinedSales.set(item.productId, currentSales + item._sum.saleNoteItemQuantity);
    });

    invoiceSales.forEach(item => {
      const currentSales = combinedSales.get(item.productId) || 0;
      combinedSales.set(item.productId, currentSales + item._sum.invoiceItemQuantity);
    });

    const sortedSales = Array.from(combinedSales.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit);

    const productIds = sortedSales.map(([productId]) => productId);
    
    const bestSellersDetails = await this.prisma.product.findMany({
      where: {
        productId: {
          in: productIds,
        },
      },
      include: {
        images: true,
        category: true,
      },
    });
    const result = bestSellersDetails.map(product => {
      const sale = sortedSales.find(([id]) => id === product.productId);
      return {
        ...product,
        totalSold: sale ? sale[1] : 0,
      };
    }).sort((a, b) => b.totalSold - a.totalSold); 

    return result;
  }

  /**
   * Calculate total sales for a period of time
   * @param startDate - Start date of period.
   * @param endDate - End Date of period.
   */

  async getSalesAndProfitSummary(startDate: Date, endDate: Date) {

    const invoiceItems = await this.prisma.invoiceItem.findMany({
      where: {
        invoice: {
          invoiceCreatedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
      include: {
        product: {
          select: {
            productCost: true,
          },
        },
      },
    });

    let totalRevenue = 0;
    let totalCost = 0;

    invoiceItems.forEach(item => {
      totalRevenue += item.invoiceItemSubtotal.toNumber();
      const cost = item.product.productCost?.toNumber() || 0;
      totalCost += cost * item.invoiceItemQuantity;
    });

    const totalProfit = totalRevenue - totalCost;

    return {
      period: {
        from: startDate.toISOString(),
        to: endDate.toISOString(),
      },
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalProfit: parseFloat(totalProfit.toFixed(2)),
      numberOfSales: invoiceItems.length,
    };
  }

  /**
   * Get overall dashboard statistics
   * @param startDate - Optional start date for custom range
   * @param endDate - Optional end date for custom range
   */
  async getDashboardStats(startDate?: Date, endDate?: Date) {
    const now = new Date();
    
    // Use provided dates or default to current month
    const currentPeriodStart = startDate || new Date(now.getFullYear(), now.getMonth(), 1);
    const currentPeriodEnd = endDate || new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Calculate comparison period (same duration, shifted back)
    const periodDuration = currentPeriodEnd.getTime() - currentPeriodStart.getTime();
    const previousPeriodEnd = new Date(currentPeriodStart.getTime() - 1);
    const previousPeriodStart = new Date(previousPeriodEnd.getTime() - periodDuration);

    // Current period sales
    const currentPeriodSales = await this.getSalesAndProfitSummary(currentPeriodStart, currentPeriodEnd);
    
    // Previous period sales for comparison
    const previousPeriodSales = await this.getSalesAndProfitSummary(previousPeriodStart, previousPeriodEnd);

    // Total customers
    const totalCustomers = await this.prisma.customer.count();

    // Total active products
    const totalProducts = await this.prisma.product.count({
      where: { productIsActive: true },
    });

    // Calculate percentage changes
    const revenueChange = previousPeriodSales.totalRevenue > 0
      ? ((currentPeriodSales.totalRevenue - previousPeriodSales.totalRevenue) / previousPeriodSales.totalRevenue) * 100
      : 0;

    const profitChange = previousPeriodSales.totalProfit > 0
      ? ((currentPeriodSales.totalProfit - previousPeriodSales.totalProfit) / previousPeriodSales.totalProfit) * 100
      : 0;

    return {
      totalRevenue: currentPeriodSales.totalRevenue,
      totalProfit: currentPeriodSales.totalProfit,
      totalCustomers,
      totalProducts,
      revenueChange: parseFloat(revenueChange.toFixed(1)),
      profitChange: parseFloat(profitChange.toFixed(1)),
      profitMargin: currentPeriodSales.totalRevenue > 0
        ? parseFloat(((currentPeriodSales.totalProfit / currentPeriodSales.totalRevenue) * 100).toFixed(1))
        : 0,
    };
  }

  /**
   * Get monthly new customers trend
   * @param months - Number of months to retrieve
   */
  async getMonthlyCustomers(months: number = 6) {
    const result = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

      const count = await this.prisma.customer.count({
        where: {
          customerCreatedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      result.push({
        month: startDate.toLocaleString('es-ES', { month: 'short', year: 'numeric' }),
        count,
      });
    }

    return result;
  }

  /**
   * Get monthly profit trend
   * @param months - Number of months to retrieve
   */
  async getMonthlyProfit(months: number = 6) {
    const result = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

      const summary = await this.getSalesAndProfitSummary(startDate, endDate);

      result.push({
        month: startDate.toLocaleString('es-ES', { month: 'short', year: 'numeric' }),
        revenue: summary.totalRevenue,
        profit: summary.totalProfit,
      });
    }

    return result;
  }

  /**
   * Get recent sales/invoices
   * @param limit - Number of recent sales to return
   */
  async getRecentSales(limit: number = 10) {
    const recentInvoices = await this.prisma.invoice.findMany({
      take: limit,
      orderBy: {
        invoiceCreatedAt: 'desc',
      },
      include: {
        customer: {
          select: {
            customerName: true,
          },
        },
      },
    });

    return recentInvoices.map(invoice => ({
      invoiceId: invoice.invoiceId,
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customer.customerName,
      total: parseFloat(invoice.invoiceTotal.toFixed(2)),
      status: invoice.invoiceStatus,
      createdAt: invoice.invoiceCreatedAt,
    }));
  }
}
