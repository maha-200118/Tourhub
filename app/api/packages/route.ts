import { NextRequest, NextResponse } from 'next/server';
import { getAllPackages, getPackagesByCategory } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    let packages;
    if (category) {
      packages = await getPackagesByCategory(category);
    } else {
      packages = await getAllPackages();
    }

    return NextResponse.json(packages, { status: 200 });
  } catch (error) {
    console.error('Packages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}
