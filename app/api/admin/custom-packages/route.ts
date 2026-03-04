import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getAllCustomPackageRequests, getUserById } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const customPackages = await getAllCustomPackageRequests();
    
    // Enrich with user details
    const enrichedPackages = await Promise.all(
      customPackages.map(async (pkg) => {
        const user = await getUserById(pkg.userId);
        return {
          ...pkg,
          user: user ? {
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
          } : null,
        };
      })
    );

    return NextResponse.json(enrichedPackages, { status: 200 });
  } catch (error) {
    console.error('Get custom packages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch custom packages' },
      { status: 500 }
    );
  }
}
