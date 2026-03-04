import { NextRequest, NextResponse } from 'next/server';
import { createCustomPackageRequest, getCustomPackageRequestsByUser } from '@/lib/db';
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

    const { basePackageId, basePackageTitle, customPlaces, selectedFoodVarieties, duration, numberOfPeople, budget, specialRequirements, imageUrl } = await request.json();

    if (!basePackageId || !customPlaces || !selectedFoodVarieties || !duration || !numberOfPeople || !budget) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    const customRequest = await createCustomPackageRequest(
      session.userId,
      basePackageId,
      basePackageTitle,
      customPlaces,
      selectedFoodVarieties,
      duration,
      numberOfPeople,
      budget,
      specialRequirements || '',
      imageUrl
    );

    return NextResponse.json(customRequest, { status: 201 });
  } catch (error) {
    console.error('Custom package error:', error);
    return NextResponse.json(
      { error: 'Failed to create custom package request' },
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

    const customRequests = await getCustomPackageRequestsByUser(session.userId);
    return NextResponse.json(customRequests, { status: 200 });
  } catch (error) {
    console.error('Get custom packages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch custom package requests' },
      { status: 500 }
    );
  }
}
