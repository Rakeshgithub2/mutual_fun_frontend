import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("http://localhost:3002/api/market-indices", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Backend API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching market indices:", error);

    // Return fallback data if backend fails
    return NextResponse.json(
      {
        success: true,
        data: {
          nifty50: {
            name: "Nifty 50",
            value: 24413.5,
            change: 142.3,
            changePercent: 0.59,
            high: 24450.2,
            low: 24280.15,
            open: 24300.0,
            previousClose: 24271.2,
            volume: 42500000,
          },
          sensex: {
            name: "S&P BSE Sensex",
            value: 80456.75,
            change: 234.15,
            changePercent: 0.29,
            high: 80512.3,
            low: 80234.5,
            open: 80300.0,
            previousClose: 80222.6,
            volume: 35000000,
          },
        },
        timestamp: new Date().toISOString(),
        source: "Fallback Data",
      },
      { status: 200 }
    );
  }
}
