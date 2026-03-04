import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/db';
import { createSession } from '@/lib/auth';
import admin from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { idToken, email, name } = await request.json();

    if (!idToken || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log('Firebase token verified for:', decodedToken.email);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    let user = await getUserByEmail(email);
    if (!user) {
      user = await createUser(email, '', name || 'Google User', '', '');
    }

    await createSession(user.id, user.email, user.name);

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { error: 'Google sign-in failed' },
      { status: 500 }
    );
  }
}