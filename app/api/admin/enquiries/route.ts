import { NextRequest, NextResponse } from 'next/server';
import { getAllEnquiries } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Check admin session
    const adminSession = await getAdminSession();
    if (!adminSession) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const enquiries = await getAllEnquiries();
    return NextResponse.json(enquiries, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch enquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enquiries' },
      { status: 500 }
    );
  }
}
