import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/alerts - List all alerts for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    const alerts = await prisma.alert.findMany({
      where: { userId },
      include: {
        fund: {
          select: {
            name: true,
            amfiCode: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, alerts });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

// POST /api/alerts - Create a new alert
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, fundId, type, condition, isActive } = body;

    // Validation
    if (!userId || !type || !condition) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const alert = await prisma.alert.create({
      data: {
        userId,
        fundId: fundId || null,
        type,
        condition: JSON.stringify(condition),
        isActive: isActive !== undefined ? isActive : true,
      },
      include: {
        fund: {
          select: {
            name: true,
            amfiCode: true,
          },
        },
      },
    });

    // Send email notification when alert is created
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/alerts/notify`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'alert_created',
            userId,
            alert,
          }),
        }
      );
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Don't fail the alert creation if email fails
    }

    return NextResponse.json({ success: true, alert }, { status: 201 });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}
