'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import BottomNav from '@/app/components/BottomNav';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState({ facebook: false, google: false });
  const [lastPost, setLastPost] = useState<any>(null);
  const [autoPostEnabled, setAutoPostEnabled] = useState(true);

  useEffect(() => {
    if (!api.isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const [connectionsData, postsData] = await Promise.all([
        api.getConnections(),
        api.getPosts('published').catch(() => ({ posts: [] }))
      ]);

      setConnections({
        facebook: connectionsData.connections?.some((c: any) => c.type === 'facebook' && c.status === 'active') || false,
        google: connectionsData.connections?.some((c: any) => c.type === 'google' && c.status === 'active') || false
      });

      if (postsData.posts && postsData.posts.length > 0) {
        setLastPost(postsData.posts[0]);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    router.push('/');
  };

  const toggleAutoPost = () => {
    setAutoPostEnabled(!autoPostEnabled);
    // TODO: Save to server
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">PostAgentPro</h1>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900 font-medium text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Connection Status Cards */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">Connected Accounts</h2>
          
          <div className={`bg-white rounded-lg shadow-sm border p-4 flex items-center justify-between ${
            connections.facebook ? 'border-green-200' : 'border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl">
                f
              </div>
              <div>
                <p className="font-semibold text-gray-900">Facebook</p>
                <p className="text-sm text-gray-600">
                  {connections.facebook ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            {connections.facebook ? (
              <div className="text-green-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            ) : (
              <Link href="/dashboard/settings" className="text-blue-600 font-semibold text-sm">
                Connect
              </Link>
            )}
          </div>

          <div className={`bg-white rounded-lg shadow-sm border p-4 flex items-center justify-between ${
            connections.google ? 'border-green-200' : 'border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-xl">
                G
              </div>
              <div>
                <p className="font-semibold text-gray-900">Google Business</p>
                <p className="text-sm text-gray-600">
                  {connections.google ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            {connections.google ? (
              <div className="text-green-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            ) : (
              <Link href="/dashboard/settings" className="text-blue-600 font-semibold text-sm">
                Connect
              </Link>
            )}
          </div>
        </div>

        {/* Last Post Preview */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">Latest Post</h2>
          
          {lastPost ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                  {lastPost.businessName?.[0] || 'B'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Your Business</p>
                  <p className="text-xs text-gray-500">
                    {lastPost.publishedAt ? new Date(lastPost.publishedAt).toLocaleDateString() : 'Posted'}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-3 whitespace-pre-wrap">{lastPost.text || lastPost.caption}</p>
              {lastPost.imageUrl && (
                <img src={lastPost.imageUrl} alt="Post" className="w-full rounded-lg" />
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-4">Generate your first post to get started!</p>
              <Link 
                href="/dashboard/generate"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                Create First Post
              </Link>
            </div>
          )}
        </div>

        {/* Auto-Post Toggle */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Auto-post weekly</h3>
              <p className="text-sm text-gray-600">
                AI generates and posts 3 times per week automatically (Mon, Wed, Fri at 10 AM)
              </p>
            </div>
            <button
              onClick={toggleAutoPost}
              className={`ml-4 relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autoPostEnabled ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-7 w-7 transform rounded-full bg-white transition duration-200 ease-in-out ${
                  autoPostEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Quick Action */}
        <Link
          href="/dashboard/generate"
          className="block bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg shadow-lg p-6 text-center"
        >
          <div className="text-4xl mb-2">✨</div>
          <h3 className="text-xl font-bold mb-1">Generate & Post Now</h3>
          <p className="text-sm text-white/90">Create a new post with AI</p>
        </Link>
      </main>

      <BottomNav />
    </div>
  );
}
