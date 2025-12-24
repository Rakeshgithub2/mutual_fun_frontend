import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/alerts/[id] - Get a single alert
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const alert = await prisma.alert.findUnique({
      where: { id },
      include: {
        fund: {
          select: {
            name: true,
            amfiCode: true,
          },
        },
      },
    });

    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, alert });
  } catch (error) {
    console.error('Error fetching alert:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alert' },
      { status: 500 }
    );
  }
}

// PUT /api/alerts/[id] - Update an alert
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { type, condition, isActive } = body;

    const existingAlert = await prisma.alert.findUnique({
      where: { id },
    });

    if (!existingAlert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    const updateData: any = {};
    if (type !== undefined) updateData.type = type;
    if (condition !== undefined)
      updateData.condition = JSON.stringify(condition);
    if (isActive !== undefined) updateData.isActive = isActive;

    const alert = await prisma.alert.update({
      where: { id },
      data: updateData,
      include: {
        fund: {
          select: {
            name: true,
            amfiCode: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, alert });
  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json(
      { error: 'Failed to update alert' },
      { status: 500 }
    );
  }
}

// DELETE /api/alerts/[id] - Delete an alert
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const existingAlert = await prisma.alert.findUnique({
      where: { id },
    });

    if (!existingAlert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    await prisma.alert.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Alert deleted' });
  } catch (error) {
    console.error('Error deleting alert:', error);
    return NextResponse.json(
      { error: 'Failed to delete alert' },
      { status: 500 }
    );
  }
}
