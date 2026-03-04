import { NextResponse } from 'next/server';
import { getCompletedToursByUser } from '@/lib/db';

export async function GET() {
  try {
    const session = globalThis.currentSession;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tours = await getCompletedToursByUser(session.userId);
    return NextResponse.json(tours, { status: 200 });
  } catch (error) {
    console.error('Completed tours error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch completed tours' },
      { status: 500 }
    );
  }
}
