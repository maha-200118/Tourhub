'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Session {
  userId: string;
  email: string;
  name: string;
}

export default function Navigation() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        setSession(data.session);
      } catch (err) {
        console.error('Failed to fetch session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setSession(null);
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-blue-600">🌍 TourHub</div>
          </Link>

          {/* Menu */}
          <div className="flex items-center gap-6">
            {/* Links shown only after login */}
            {!isLoading && session && (
              <>
                <Link href="/packages" className="text-gray-700 hover:text-blue-600 font-medium">
                  Packages
                </Link>
                <Link href="/build-custom-package" className="text-gray-700 hover:text-blue-600 font-medium">
                  Build Custom Package
                </Link>
              </>
            )}

            {!isLoading && (
              <>
                {session ? (
                  <>
                    <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                      Dashboard
                    </Link>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Hi, {session.name}</span>
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="text-gray-700 border-gray-300 hover:bg-gray-100 bg-transparent"
                      >
                        Logout
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/admin/login">
                      <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-100 bg-transparent">
                        Admin
                      </Button>
                    </Link>
                    <Link href="/auth/login">
                      <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-100 bg-transparent">
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">Register</Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
