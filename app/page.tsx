'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Package {
  id: string;
  title: string;
  price: number;
  category: string;
  location: string;
  duration: number;
}

interface Session {
  userId: string;
  email: string;
  name: string;
}

export default function Home() {
  const [featuredPackages, setFeaturedPackages] = useState<Package[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch packages
        const packagesRes = await fetch('/api/packages');
        const packagesData = await packagesRes.json();
        setFeaturedPackages(packagesData.slice(0, 3)); // Show first 3 as featured

        // Fetch session
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        setSession(sessionData.session);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">Explore the World with TourHub</h1>
            <p className="text-xl text-blue-100 mb-8">
              Discover amazing travel packages, connect with local guides, and create unforgettable memories. 
              Browse our curated collection of adventure, cultural, heritage, and vacation packages.
            </p>
            <div className="flex gap-4">
              <Link href="/packages">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg px-8 py-3">
                  Browse Packages
                </Button>
              </Link>
              {!session && (
                <Link href="/auth/register">
                  <Button className="bg-blue-500 hover:bg-blue-400 text-white font-bold text-lg px-8 py-3">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Build Your Own Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Can't Find What You Want?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Build your own custom package! Choose any countries in the world, select your preferred cuisines, 
            set your budget, and let our experts create the perfect itinerary just for you.
          </p>
          <Link href="/build-custom-package">
            <Button className="bg-white text-purple-600 hover:bg-purple-50 font-bold text-lg px-8 py-3">
              Build Custom Package
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Why Choose TourHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-lg transition">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Interactive Maps</h3>
              <p className="text-gray-600">
                Explore destinations with our interactive map integration. See exact locations of all our tour packages worldwide.
              </p>
            </Card>
            <Card className="p-8 text-center hover:shadow-lg transition">
              <div className="text-4xl mb-4">✈️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Diverse Packages</h3>
              <p className="text-gray-600">
                Choose from pre-designed packages or build your own custom tour to any country in the world.
              </p>
            </Card>
            <Card className="p-8 text-center hover:shadow-lg transition">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Customization</h3>
              <p className="text-gray-600">
                Send inquiries directly, customize food preferences, and work with our team for personalized trip planning.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Featured Packages</h2>
          
          {isLoading ? (
            <p className="text-center text-gray-600">Loading packages...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {featuredPackages.map(pkg => (
                  <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition">
                    <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white p-4">
                      <div className="text-center">
                        <p className="text-sm font-semibold mb-2">{pkg.category.toUpperCase()}</p>
                        <h3 className="font-bold text-lg">{pkg.title}</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 text-sm mb-3">{pkg.location}</p>
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <p className="text-xs text-gray-600">Price per person</p>
                          <p className="text-2xl font-bold text-blue-600">₹{pkg.price.toLocaleString('en-IN')}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-600">{pkg.duration} days</p>
                      </div>
                      <Link href={`/packages/${pkg.id}`}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Link href="/packages">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-3">
                    View All Packages
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Plan Your Next Adventure?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Create an account today to browse all our packages, send inquiries, and start your journey with TourHub.
          </p>
          <div className="flex gap-4 justify-center">
            {!session ? (
              <>
                <Link href="/auth/register">
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg px-8 py-3">
                    Sign Up Free
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button className="border-2 border-white text-white hover:bg-blue-500 font-bold text-lg px-8 py-3">
                    Sign In
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/dashboard">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg px-8 py-3">
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/packages" className="hover:text-white">Packages</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Packages</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/packages?category=adventure" className="hover:text-white">Adventure</a></li>
                <li><a href="/packages?category=cultural" className="hover:text-white">Cultural</a></li>
                <li><a href="/packages?category=vacation" className="hover:text-white">Vacation</a></li>
                <li><a href="/packages?category=heritage" className="hover:text-white">Heritage</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Account</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {session ? (
                  <>
                    <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
                    <li><Link href="/dashboard/edit-profile" className="hover:text-white">Profile</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link href="/auth/login" className="hover:text-white">Login</Link></li>
                    <li><Link href="/auth/register" className="hover:text-white">Register</Link></li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="text-gray-400 text-sm">Email: info@tourhub.com</p>
              <p className="text-gray-400 text-sm">Phone: +1 (555) 123-4567</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TourHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
