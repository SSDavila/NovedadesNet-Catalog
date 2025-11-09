import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BIDashboardService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtain best seller products
   * @param limit - number of products to return
   */

  async getBestSellingProducts(limit: number = 10) {
    const saleNoteSales = await this.prisma.saleNoteItem.groupBy({
      by: ['productId'],
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
}
