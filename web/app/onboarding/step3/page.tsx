'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function OnboardingStep3() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [connections, setConnections] = useState({
    facebook: false,
    google: false
  });

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      const data = await api.getConnections();
      setConnections({
        facebook: data.connections?.some((c: any) => c.type === 'facebook' && c.status === 'active') || false,
        google: data.connections?.some((c: any) => c.type === 'google' && c.status === 'active') || false
      });
    } catch (error) {
      console.error('Failed to load connections:', error);
    }
  };

  const handleConnectFacebook = async () => {
    setLoading(true);
    try {
      const result = await api.initiateFacebookAuth();
      if (result.authUrl) {
        window.location.href = result.authUrl;
      }
    } catch (error) {
      console.error('Failed to initiate Facebook auth:', error);
      alert('Failed to connect Facebook. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGoogle = async () => {
    setLoading(true);
    try {
      const result = await api.initiateGoogleAuth();
      if (result.authUrl) {
        window.location.href = result.authUrl;
      }
    } catch (error) {
      console.error('Failed to initiate Google auth:', error);
      alert('Failed to connect Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    localStorage.setItem('onboarding_complete', 'true');
    router.push('/onboarding/success');
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_complete', 'true');
    router.push('/dashboard/home');
  };

  const allConnected = connections.facebook && connections.google;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step 3 of 3</span>
            <span className="text-sm text-gray-500">Connect Accounts</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔗</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Connect your accounts</h1>
          <p className="text-gray-600">Link your social media so we can post on your behalf</p>
        </div>

        <div className="space-y-6">
          {/* Facebook Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl">
                  f
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Facebook Page</h3>
                  <p className="text-sm text-gray-600">Post to your business page</p>
                </div>
              </div>
              {connections.facebook && (
                <div className="flex items-center text-green-600">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {!connections.facebook ? (
              <button
                onClick={handleConnectFacebook}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Connecting...' : 'Connect Facebook'}
              </button>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-800 font-semibold">✓ Connected</p>
              </div>
            )}
          </div>

          {/* Google Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-4xl">
                  G
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Google Business</h3>
                  <p className="text-sm text-gray-600">Post to your Google Business Profile</p>
                </div>
              </div>
              {connections.google && (
                <div className="flex items-center text-green-600">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {!connections.google ? (
              <button
                onClick={handleConnectGoogle}
                disabled={loading}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 rounded-lg border-2 border-gray-300 transition disabled:opacity-50"
              >
                {loading ? 'Connecting...' : 'Connect Google'}
              </button>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-800 font-semibold">✓ Connected</p>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Why do we need this?</strong><br />
              PostAgentPro posts directly to your accounts on your behalf. We never see your password — we use secure OAuth authentication.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {allConnected ? (
              <button
                onClick={handleFinish}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg text-lg transition"
              >
                All Set! Continue →
              </button>
            ) : (
              <button
                onClick={handleSkip}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 rounded-lg text-lg transition"
              >
                Skip for now (connect later)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
