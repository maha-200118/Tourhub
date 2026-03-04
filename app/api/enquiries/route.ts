import { NextRequest, NextResponse } from 'next/server';
import { createEnquiry, getEnquiriesByUser } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { packageId, numberOfPeople, travelDate, message } = await request.json();

    if (!packageId || !numberOfPeople || !travelDate || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const enquiry = await createEnquiry(
      session.userId,
      packageId,
      numberOfPeople,
      travelDate,
      message
    );

    return NextResponse.json(enquiry, { status: 201 });
  } catch (error) {
    console.error('Enquiry error:', error);
    return NextResponse.json(
      { error: 'Failed to create enquiry' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const enquiries = await getEnquiriesByUser(session.userId);
    return NextResponse.json(enquiries, { status: 200 });
  } catch (error) {
    console.error('Get enquiries error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enquiries' },
      { status: 500 }
    );
  }
}
