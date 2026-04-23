import { NextResponse } from 'next/server';
import { getTokenStats } from '@/app/lib/db/tokens';

export async function GET() {
  try {
    const stats = await getTokenStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
