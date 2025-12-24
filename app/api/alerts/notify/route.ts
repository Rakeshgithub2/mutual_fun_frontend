import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/alerts/notify - Send email notification for alert
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, userId, alert } = body;

    // Get user email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });

    if (!user || !user.email) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 404 }
      );
    }

    // Check if Resend is available
    let Resend: any;
    let resend: any = null;
    try {
      const ResendModule = require('resend');
      Resend = ResendModule.Resend;
      if (process.env.RESEND_API_KEY) {
        resend = new Resend(process.env.RESEND_API_KEY);
      }
    } catch (error) {
      console.warn('Resend module not available');
    }

    let emailSent = false;
    let warning = '';

    if (resend && process.env.RESEND_API_KEY) {
      try {
        let subject = '';
        let htmlContent = '';

        if (type === 'alert_created') {
          subject = 'Price Alert Created Successfully';
          const condition = JSON.parse(alert.condition);
          htmlContent = `
            <h2>Price Alert Created</h2>
            <p>Hello ${user.name || 'there'},</p>
            <p>Your price alert has been created successfully:</p>
            <ul>
              <li><strong>Fund:</strong> ${alert.fund?.name || 'Selected Fund'}</li>
              <li><strong>Alert Type:</strong> ${alert.type}</li>
              <li><strong>Condition:</strong> ${condition.type} ${condition.value}</li>
            </ul>
            <p>You will receive notifications when this alert is triggered.</p>
            <p><em>MF Analyzer</em></p>
          `;
        } else if (type === 'alert_triggered') {
          subject = `Alert Triggered: ${alert.fund?.name || 'Fund Alert'}`;
          const condition = JSON.parse(alert.condition);
          htmlContent = `
            <h2>Price Alert Triggered!</h2>
            <p>Hello ${user.name || 'there'},</p>
            <p>Your price alert has been triggered:</p>
            <ul>
              <li><strong>Fund:</strong> ${alert.fund?.name || 'Selected Fund'}</li>
              <li><strong>Alert Type:</strong> ${alert.type}</li>
              <li><strong>Condition:</strong> ${condition.type} ${condition.value}</li>
              <li><strong>Current NAV:</strong> ₹${condition.currentNav || 'N/A'}</li>
            </ul>
            <p>Check your portfolio for more details.</p>
            <p><em>MF Analyzer</em></p>
          `;
        }

        await resend.emails.send({
          from: 'MF Analyzer Alerts <onboarding@resend.dev>',
          to: [user.email],
          subject: subject,
          html: htmlContent,
        });

        emailSent = true;
      } catch (emailError) {
        console.error('Error sending email via Resend:', emailError);
        warning = 'Email sending failed';
      }
    } else {
      warning =
        'Email not configured. Set RESEND_API_KEY environment variable to enable email notifications.';
      console.log('Alert notification would be sent to:', user.email);
      console.log('Alert details:', JSON.stringify(alert, null, 2));
    }

    return NextResponse.json({
      success: true,
      emailSent,
      warning: warning || undefined,
      message: emailSent
        ? 'Email notification sent successfully'
        : 'Alert processed but email not sent',
    });
  } catch (error) {
    console.error('Error processing alert notification:', error);
    return NextResponse.json(
      { error: 'Failed to process notification' },
      { status: 500 }
    );
  }
}
