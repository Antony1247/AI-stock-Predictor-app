// app/api/stocks/route.ts
import { NextResponse } from 'next/server';
import { NseIndia } from 'stock-nse-india';

const nseIndia = new NseIndia();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol') || 'TCS';

  // Calculate date range for last 6 months
  const end = new Date();
  const start = new Date();
  start.setMonth(end.getMonth() - 6);

  try {
    const data = await nseIndia.getEquityHistoricalData(symbol, { start, end });
    // data is an array of daily records

    return NextResponse.json(data);
  } catch (error) {
    console.error('API fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
  }
}