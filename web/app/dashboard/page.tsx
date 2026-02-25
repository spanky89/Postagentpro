'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!api.isAuthenticated()) {
      router.push('/login');
      return;
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    api.logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">PostAgentPro</h1>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to PostAgentPro</h2>
          <p className="text-gray-600">Let&apos;s get your social media on autopilot</p>
        </div>

        {/* Setup Steps */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">1. Tell us about your business</h3>
            <p className="text-gray-600 text-sm mb-4">
              Share your business type, location, and what you do
            </p>
            <Link href="/dashboard/setup" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
              Complete setup →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">2. Connect your accounts</h3>
            <p className="text-gray-600 text-sm mb-4">
              Link Google Business Profile and Facebook Page
            </p>
            <Link href="/dashboard/connections" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
              Connect accounts →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">3. Generate posts</h3>
            <p className="text-gray-600 text-sm mb-4">
              AI will generate engaging content for your business
            </p>
            <Link href="/dashboard/posts" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
              View posts →
            </Link>
          </div>
        </div>

        {/* Placeholder sections */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Your Posts Will Appear Here
            </h3>
            <p className="text-gray-600">
              Once you connect your accounts, you&apos;ll see your scheduled posts and analytics here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
