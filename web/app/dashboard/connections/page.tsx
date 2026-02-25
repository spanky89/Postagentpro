'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Connection {
  id: string;
  platform: string;
  accountName: string;
  status: string;
  createdAt: string;
}

export default function ConnectionsPage() {
  const router = useRouter();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!api.isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadConnections();
  }, [router]);

  const loadConnections = async () => {
    try {
      const data = await api.getConnections();
      setConnections(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGoogle = async () => {
    setActionLoading('google');
    setError('');
    try {
      const { authUrl } = await api.initiateGoogleAuth();
      window.location.href = authUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect Google');
      setActionLoading(null);
    }
  };

  const handleConnectFacebook = async () => {
    setActionLoading('facebook');
    setError('');
    try {
      const { authUrl } = await api.initiateFacebookAuth();
      window.location.href = authUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect Facebook');
      setActionLoading(null);
    }
  };

  const handleDisconnect = async (id: string, platform: string) => {
    if (!confirm(`Are you sure you want to disconnect your ${platform} account?`)) {
      return;
    }

    setActionLoading(id);
    try {
      await api.disconnectAccount(id);
      await loadConnections();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect');
    } finally {
      setActionLoading(null);
    }
  };

  const isConnected = (platform: string) => {
    return connections.some(c => c.platform === platform && c.status === 'ACTIVE');
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
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Connect Your Accounts</h1>
          <p className="text-gray-600">Link your social media accounts to start auto-posting</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Google Business */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🔵</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Google Business Profile</h3>
                <p className="text-sm text-gray-600">
                  {isConnected('GOOGLE') ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>

            {isConnected('GOOGLE') ? (
              <>
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 text-sm">
                  ✓ Connected as{' '}
                  <strong>
                    {connections.find(c => c.platform === 'GOOGLE')?.accountName}
                  </strong>
                </div>
                <button
                  onClick={() => {
                    const conn = connections.find(c => c.platform === 'GOOGLE');
                    if (conn) handleDisconnect(conn.id, 'Google');
                  }}
                  disabled={actionLoading !== null}
                  className="w-full border border-red-300 text-red-700 py-2 rounded-lg font-semibold hover:bg-red-50 transition disabled:opacity-50"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-600 text-sm mb-4">
                  Post directly to your Google Business Profile. Boost local SEO and reach customers searching for your services.
                </p>
                <button
                  onClick={handleConnectGoogle}
                  disabled={actionLoading !== null}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === 'google' ? 'Connecting...' : 'Connect Google'}
                </button>
              </>
            )}
          </div>

          {/* Facebook */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">📘</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Facebook Page</h3>
                <p className="text-sm text-gray-600">
                  {isConnected('FACEBOOK') ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>

            {isConnected('FACEBOOK') ? (
              <>
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 text-sm">
                  ✓ Connected as{' '}
                  <strong>
                    {connections.find(c => c.platform === 'FACEBOOK')?.accountName}
                  </strong>
                </div>
                <button
                  onClick={() => {
                    const conn = connections.find(c => c.platform === 'FACEBOOK');
                    if (conn) handleDisconnect(conn.id, 'Facebook');
                  }}
                  disabled={actionLoading !== null}
                  className="w-full border border-red-300 text-red-700 py-2 rounded-lg font-semibold hover:bg-red-50 transition disabled:opacity-50"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-600 text-sm mb-4">
                  Share posts on your Facebook Page. Engage with followers and grow your social presence automatically.
                </p>
                <button
                  onClick={handleConnectFacebook}
                  disabled={actionLoading !== null}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === 'facebook' ? 'Connecting...' : 'Connect Facebook'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Coming Soon */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6 text-center">
          <p className="text-gray-600 font-semibold mb-2">Coming Soon</p>
          <p className="text-gray-500 text-sm">Instagram · Twitter · LinkedIn</p>
        </div>
      </main>
    </div>
  );
}
