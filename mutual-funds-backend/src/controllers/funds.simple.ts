import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import {
  formatResponse,
  formatPaginatedResponse,
  pagination,
  buildSortOrder,
} from '../utils/response';

const getFundsSchema = z.object({
  type: z.string().optional(),
  category: z.string().optional(),
  q: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sort: z.string().optional(),
});

const getFundNavsSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export const getFunds = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    console.log('📥 GET /funds request received');
    const { type, category, q, page, limit, sort } = getFundsSchema.parse(
      req.query
    );
    console.log('✅ Request params validated:', {
      type,
      category,
      q,
      page,
      limit,
      sort,
    });

    const { skip, take } = pagination(page, limit);
    const orderBy = buildSortOrder(sort);

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (type) {
      where.type = type;
    }

    if (category) {
      where.category = category;
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { amfiCode: { contains: q, mode: 'insensitive' } },
      ];
    }

    console.log('🔍 Querying database with where:', where);

    // Get total count
    const total = await prisma.fund.count({ where });
    console.log('📊 Total funds found:', total);

    // Get funds with latest NAV
    const funds = await prisma.fund.findMany({
      where,
      orderBy: orderBy || { createdAt: 'desc' },
      skip,
      take,
      select: {
        id: true,
        amfiCode: true,
        name: true,
        type: true,
        category: true,
        benchmark: true,
        expenseRatio: true,
        inceptionDate: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        performances: {
          orderBy: { date: 'desc' },
          take: 1, // Get only the latest NAV
          select: {
            nav: true,
            date: true,
          },
        },
      },
    });

    console.log('✅ Funds retrieved:', funds.length);

    const response = formatPaginatedResponse(
      funds,
      total,
      page,
      limit,
      'Funds retrieved successfully'
    );

    return res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Validation error:', error.errors);
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('❌ Get funds error:', error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: String(error) });
  }
};

export const getFundById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    console.log('📥 GET /funds/:id request received for id:', id);

    // First try to find the fund
    const fund = await prisma.fund.findUnique({
      where: { id },
    });

    if (!fund) {
      console.log('❌ Fund not found:', id);
      return res.status(404).json({ error: 'Fund not found' });
    }

    console.log('✅ Fund found:', fund.name);

    // Now fetch related data separately to avoid issues with missing relations
    const [holdings, managers, performances] = await Promise.all([
      prisma.holding.findMany({
        where: { fundId: id },
        orderBy: { percent: 'desc' },
        take: 10,
      }),
      prisma.fundManager.findMany({
        where: { fundId: id },
      }),
      prisma.fundPerformance.findMany({
        where: {
          fundId: id,
          date: {
            gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          },
        },
        orderBy: { date: 'desc' },
      }),
    ]);

    console.log(
      `✅ Retrieved ${holdings.length} holdings, ${managers.length} managers, ${performances.length} performance records`
    );

    // Combine the data
    const fundWithRelations = {
      ...fund,
      holdings,
      managedBy: managers,
      performances,
    };

    const response = formatResponse(
      fundWithRelations,
      'Fund retrieved successfully'
    );
    return res.json(response);
  } catch (error) {
    console.error('❌ Get fund by ID error:', error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: String(error) });
  }
};

export const getFundNavs = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { from, to } = getFundNavsSchema.parse(req.query);
    console.log('📥 GET /funds/:id/navs request received for id:', id);

    const dateFilter: any = {};
    if (from) {
      dateFilter.gte = new Date(from);
    }
    if (to) {
      dateFilter.lte = new Date(to);
    }

    const navs = await prisma.fundPerformance.findMany({
      where: {
        fundId: id,
        ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
      },
      orderBy: { date: 'asc' },
      select: {
        date: true,
        nav: true,
      },
    });

    console.log('✅ NAVs retrieved:', navs.length);
    const response = formatResponse(navs, 'Fund NAVs retrieved successfully');
    return res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Validation error:', error.errors);
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('❌ Get fund NAVs error:', error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: String(error) });
  }
};
