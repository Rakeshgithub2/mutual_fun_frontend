import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { feedback, userName, userEmail } = await request.json();

    if (!feedback || !feedback.trim()) {
      return NextResponse.json(
        { error: 'Feedback is required' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const name =
      userName && userName !== 'Anonymous' ? userName : 'Anonymous User';
    const email =
      userEmail && userEmail !== 'No email provided'
        ? userEmail
        : 'No email provided';

    // Send feedback to backend API
    // NEXT_PUBLIC_API_URL already includes /api, so just add /feedback
    const BASE_URL = 'https://mutualfun-backend.vercel.app';
    const backendUrl = (
      process.env.NEXT_PUBLIC_API_URL || `${BASE_URL}/api`
    ).replace(/\/+$/, '');

    console.log('📤 Sending feedback to backend:', `${backendUrl}/feedback`);

    const response = await fetch(`${backendUrl}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        feedback,
        userName: name,
        userEmail: email,
        timestamp,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend response not OK:', response.status, errorText);
      throw new Error(`Backend error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Feedback sent successfully to backend');

    return NextResponse.json({
      success: true,
      message: 'Feedback sent successfully',
      ...data, // Include backend response (e.g., warning about email config)
    });
  } catch (error) {
    console.error('❌ Error processing feedback:', error);
    return NextResponse.json(
      {
        error: 'Failed to send feedback',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
