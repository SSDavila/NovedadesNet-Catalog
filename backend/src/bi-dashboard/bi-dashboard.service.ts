import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BIDashboardService {
  constructor(private prisma: PrismaService) { }

  /**
   * Obtain best seller products
   * @param limit - number of products to return
   * @param startDate - Optional start date for filtering
   * @param endDate - Optional end date for filtering
   */

  async getBestSellingProducts(limit: number = 10, startDate?: Date, endDate?: Date) {
    const now = new Date();
    const start = startDate || new Date(now.getFullYear(), now.getMonth(), 1);
    const end = endDate || new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const dateFilter = {
      invoice: {
        invoiceCreatedAt: {
          gte: start,
          lte: end,
        },
      },
    };

    const saleNoteDateFilter = {
      saleNote: {
        saleNoteCreatedAt: {
          gte: start,
          lte: end,
        },
      },
    };

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

    const periodDuration = currentPeriodEnd.getTime() - currentPeriodStart.getTime();
    const previousPeriodEnd = new Date(currentPeriodStart.getTime() - 1);
    const previousPeriodStart = new Date(previousPeriodEnd.getTime() - periodDuration);

    // Fetch both periods in one go to reduce database overhead for invoice items
    const [currentPeriodSales, previousPeriodSales, totalCustomers, totalProducts] = await Promise.all([
      this.getSalesAndProfitSummary(currentPeriodStart, currentPeriodEnd),
      this.getSalesAndProfitSummary(previousPeriodStart, previousPeriodEnd),
      this.prisma.customer.count(),
      this.prisma.product.count({ where: { productIsActive: true } }),
    ]);

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
    const startDateRange = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

    const allCustomers = await this.prisma.customer.findMany({
      where: {
        customerCreatedAt: { gte: startDateRange },
      },
      select: {
        customerCreatedAt: true,
      },
    });

    for (let i = months - 1; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

      const count = allCustomers.filter(c =>
        c.customerCreatedAt >= startDate && c.customerCreatedAt <= endDate
      ).length;

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
    const startDateRange = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

    const invoiceItems = await this.prisma.invoiceItem.findMany({
      where: {
        invoice: {
          invoiceCreatedAt: { gte: startDateRange },
          invoiceStatus: { not: 'ANULADO' }
        },
      },
      include: {
        invoice: {
          select: {
            invoiceCreatedAt: true,
          },
        },
        product: {
          select: {
            productCost: true,
          },
        },
      },
    });

    for (let i = months - 1; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

      let totalRevenue = 0;
      let totalCost = 0;

      invoiceItems.forEach(item => {
        const createdAt = item.invoice.invoiceCreatedAt;
        if (createdAt >= startDate && createdAt <= endDate) {
          totalRevenue += item.invoiceItemSubtotal.toNumber();
          const cost = item.product.productCost?.toNumber() || 0;
          totalCost += cost * item.invoiceItemQuantity;
        }
      });

      const totalProfit = totalRevenue - totalCost;

      result.push({
        month: startDate.toLocaleString('es-ES', { month: 'short', year: 'numeric' }),
        revenue: parseFloat(totalRevenue.toFixed(2)),
        profit: parseFloat(totalProfit.toFixed(2)),
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

  /**
   * Get seller commissions and sales summary
   * @param startDate - Optional start date
   * @param endDate - Optional end date
   */
  async getSellerCommissions(startDate?: Date, endDate?: Date) {
    const now = new Date();
    const start = startDate || new Date(now.getFullYear(), now.getMonth(), 1);
    const end = endDate || new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Get all sellers (Users) with roles VENDEDOR or ADMIN
    const sellers = await this.prisma.user.findMany({
      where: {
        userRole: { in: ['VENDEDOR', 'ADMIN'] },
        userIsActive: true,
      },
      select: {
        userId: true,
        userName: true,
        userEmail: true,
      },
    });

    // Get all invoices in range with items and products
    const invoices = await this.prisma.invoice.findMany({
      where: {
        invoiceCreatedAt: { gte: start, lte: end },
        invoiceStatus: { not: 'ANULADO' },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                productId: true,
                productName: true,
                productCommission: true,
              } as any,
            },
          },
        },
      },
    }) as any[];

    // Get all sale notes in range with items and products (excluding those converted to invoices to avoid double counting)
    const saleNotes = await this.prisma.saleNote.findMany({
      where: {
        saleNoteCreatedAt: { gte: start, lte: end },
        saleNoteStatus: { not: 'ANULADO' },
        invoice: null, // Only count proformas that haven't been invoiced yet
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                productId: true,
                productName: true,
                productCommission: true,
              } as any,
            },
          },
        },
      },
    }) as any[];

    // Get all seller-specific product commissions
    const specificCommissions = await (this.prisma as any).sellerProductCommission.findMany();

    const sellerMetrics = new Map<number, {
      userId: number,
      userName: string,
      userEmail: string,
      totalSales: number,
      totalCommission: number,
      salesCount: number
    }>();

    // Initialize map
    sellers.forEach(seller => {
      sellerMetrics.set(seller.userId, {
        userId: seller.userId,
        userName: seller.userName,
        userEmail: seller.userEmail,
        totalSales: 0,
        totalCommission: 0,
        salesCount: 0,
      });
    });

    const processItem = (sellerId: number, item: any) => {
      const metrics = sellerMetrics.get(sellerId);
      if (!metrics) return;

      const subtotal = item.invoiceItemSubtotal?.toNumber() || item.saleNoteItemSubtotal?.toNumber() || 0;
      const commissionRate = specificCommissions.find(
        (sc: any) => sc.userId === sellerId && sc.productId === item.productId
      )?.commission?.toNumber() ?? 0;

      metrics.totalSales += subtotal;
      metrics.totalCommission += subtotal * (commissionRate / 100);
    };

    invoices.forEach(inv => {
      const metrics = sellerMetrics.get(inv.userId);
      if (metrics) metrics.salesCount++;
      inv.items.forEach((item: any) => processItem(inv.userId, item));
    });

    saleNotes.forEach(sn => {
      const metrics = sellerMetrics.get(sn.userId);
      if (metrics) metrics.salesCount++;
      sn.items.forEach((item: any) => processItem(sn.userId, item));
    });

    return Array.from(sellerMetrics.values())
      .map(m => ({
        ...m,
        totalSales: parseFloat(m.totalSales.toFixed(2)),
        totalCommission: parseFloat(m.totalCommission.toFixed(2)),
      }))
      .sort((a, b) => b.totalSales - a.totalSales);
  }

  /**
   * Get detailed itemized sales for a specific seller
   * @param sellerId - ID of the seller
   * @param startDate - Optional start date
   * @param endDate - Optional end date
   */
  async getSellerDetailedSales(sellerId: number, startDate?: Date, endDate?: Date) {
    const now = new Date();
    const start = startDate || new Date(now.getFullYear(), now.getMonth(), 1);
    const end = endDate || new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const invoices = await this.prisma.invoice.findMany({
      where: {
        userId: sellerId,
        invoiceCreatedAt: { gte: start, lte: end },
        invoiceStatus: { not: 'ANULADO' },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                productId: true,
                productName: true,
                productCommission: true,
              } as any,
            },
          },
        },
      },
    }) as any[];

    const saleNotes = await this.prisma.saleNote.findMany({
      where: {
        userId: sellerId,
        saleNoteCreatedAt: { gte: start, lte: end },
        saleNoteStatus: { not: 'ANULADO' },
        invoice: null,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                productId: true,
                productName: true,
                productCommission: true,
              } as any,
            },
          },
        },
      },
    }) as any[];

    const specificCommissions = await (this.prisma as any).sellerProductCommission.findMany({
      where: { userId: sellerId },
    });

    const detailedSales: any[] = [];

    const processItems = (items: any[], docNumber: string, date: Date, type: string) => {
      items.forEach(item => {
        const subtotal = item.invoiceItemSubtotal?.toNumber() || item.saleNoteItemSubtotal?.toNumber() || 0;
        const commissionRate = specificCommissions.find(
          (sc: any) => sc.productId === item.productId
        )?.commission?.toNumber() ?? 0;

        detailedSales.push({
          productId: item.productId,
          productName: item.product.productName,
          quantity: item.invoiceItemQuantity || item.saleNoteItemQuantity,
          unitPrice: item.invoiceItemUnitPrice?.toNumber() || item.saleNoteItemUnitPrice?.toNumber(),
          subtotal: parseFloat(subtotal.toFixed(2)),
          commissionRate,
          commissionAmount: parseFloat((subtotal * (commissionRate / 100)).toFixed(2)),
          documentNumber: docNumber,
          date,
          type,
        });
      });
    };

    invoices.forEach(inv => processItems(inv.items, inv.invoiceNumber, inv.invoiceCreatedAt, 'FACTURA'));
    saleNotes.forEach(sn => processItems(sn.items, sn.saleNoteNumber, sn.saleNoteCreatedAt, 'NOTA_VENTA'));

    return detailedSales.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}
