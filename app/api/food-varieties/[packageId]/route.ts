import { NextRequest, NextResponse } from 'next/server';
import { getPackageById } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { packageId: string } }
) {
  try {
    const { packageId } = params;
    
    const pkg = await getPackageById(packageId);
    if (!pkg) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(pkg.foodVarieties, { status: 200 });
  } catch (error) {
    console.error('Get food varieties error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch food varieties' },
      { status: 500 }
    );
  }
}
