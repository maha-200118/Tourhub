import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/db';
import { createSession } from '@/lib/auth';
import admin from '@/lib/firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  
  if (!serviceAccountKey) {
    console.error('FIREBASE_SERVICE_ACCOUNT_KEY is not set');
  } else {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      console.error('Failed to initialize Firebase Admin:', error);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { idToken, email, name } = await request.json();

    if (!idToken || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the ID token with Firebase Admin SDK
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log('[v0] Firebase token verified for email:', decodedToken.email);
    } catch (error) {
      console.error('[v0] Token verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Check if user already exists
    let user = await getUserByEmail(email);

    // If user doesn't exist, create a new one
    if (!user) {
      console.log('[v0] Creating new Google user:', email);
      user = await createUser(
        email,
        '', // No password for OAuth users
        name || 'Google User',
        '', // phone
        '' // address
      );
    } else {
      console.log('[v0] User already exists:', email);
    }

    // Create session
    await createSession(user.id, user.email, user.name);

    // Return success response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

    return response;
  } catch (error) {
    console.error('[v0] Google auth error:', error);
    return NextResponse.json(
      { error: 'Google sign-in failed' },
      { status: 500 }
    );
  }
}
