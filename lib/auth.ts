import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'tourism_session';
const ADMIN_SESSION_COOKIE_NAME = 'admin_session';

export interface Session {
  userId: string;
  email: string;
  name: string;
}

export interface AdminSession {
  adminId: string;
  email: string;
}

export async function createSession(userId: string, email: string, name: string): Promise<void> {
  const session: Session = { userId, email, name };
  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  
  if (!sessionCookie?.value) {
    return null;
  }
  
  try {
    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Admin session functions
export async function createAdminSession(email: string): Promise<void> {
  const adminSession: AdminSession = { adminId: `admin-${Date.now()}`, email };
  const cookieStore = await cookies();
  
  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, JSON.stringify(adminSession), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get(ADMIN_SESSION_COOKIE_NAME);
  
  if (!adminCookie?.value) {
    return null;
  }
  
  try {
    return JSON.parse(adminCookie.value);
  } catch {
    return null;
  }
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE_NAME);
}
