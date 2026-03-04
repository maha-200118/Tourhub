import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { updateCustomPackageRequestStatus } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const { status } = await request.json();

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const updatedPackage = await updateCustomPackageRequestStatus(
      id,
      status as 'pending' | 'approved' | 'rejected'
    );

    if (!updatedPackage) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPackage, { status: 200 });
  } catch (error) {
    console.error('Update package status error:', error);
    return NextResponse.json(
      { error: 'Failed to update package status' },
      { status: 500 }
    );
  }
}
