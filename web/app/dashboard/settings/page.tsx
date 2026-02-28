'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import BottomNav from '@/app/components/BottomNav';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'business' | 'photos' | 'accounts'>('business');
  
  const [businessData, setBusinessData] = useState({
    name: '',
    type: 'general_contractor',
    description: '',
    locationCity: '',
    locationState: ''
  });

  const [connections, setConnections] = useState({ facebook: false, google: false });
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const businessTypes = [
    { value: 'general_contractor', label: 'General Contractor' },
    { value: 'plumber', label: 'Plumber' },
    { value: 'electrician', label: 'Electrician' },
    { value: 'hvac', label: 'HVAC' },
    { value: 'roofer', label: 'Roofer' },
    { value: 'landscaper', label: 'Landscaper' },
    { value: 'painter', label: 'Painter' },
    { value: 'carpenter', label: 'Carpenter' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    if (!api.isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const [business, connectionsData] = await Promise.all([
        api.getBusinessProfile().catch(() => null),
        api.getConnections().catch(() => ({ connections: [] }))
      ]);

      if (business) {
        setBusinessData({
          name: business.name || '',
          type: business.type || 'general_contractor',
          description: business.description || '',
          locationCity: business.locationCity || '',
          locationState: business.locationState || ''
        });
      }

      setConnections({
        facebook: connectionsData.connections?.some((c: any) => c.type === 'facebook' && c.status === 'active') || false,
        google: connectionsData.connections?.some((c: any) => c.type === 'google' && c.status === 'active') || false
      });
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.saveBusinessProfile(businessData);
      alert('Business info saved successfully!');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleConnectFacebook = async () => {
    try {
      const result = await api.initiateFacebookAuth();
      if (result.authUrl) {
        window.location.href = result.authUrl;
      }
    } catch (error) {
      console.error('Failed to connect Facebook:', error);
      alert('Failed to connect Facebook. Please try again.');
    }
  };

  const handleConnectGoogle = async () => {
    try {
      const result = await api.initiateGoogleAuth();
      if (result.authUrl) {
        window.location.href = result.authUrl;
      }
    } catch (error) {
      console.error('Failed to connect Google:', error);
      alert('Failed to connect Google. Please try again.');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const newFiles = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    
    setPhotos(prev => [...prev, ...newFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
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
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('business')}
              className={`py-4 border-b-2 font-medium text-sm transition ${
                activeTab === 'business'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Business Info
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`py-4 border-b-2 font-medium text-sm transition ${
                activeTab === 'photos'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveTab('accounts')}
              className={`py-4 border-b-2 font-medium text-sm transition ${
                activeTab === 'accounts'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Accounts
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {activeTab === 'business' && (
          <form onSubmit={handleSaveBusiness} className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  required
                  value={businessData.name}
                  onChange={(e) => setBusinessData({ ...businessData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Mike's Plumbing"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Business Type
                </label>
                <select
                  required
                  value={businessData.type}
                  onChange={(e) => setBusinessData({ ...businessData, type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {businessTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  required
                  value={businessData.description}
                  onChange={(e) => setBusinessData({ ...businessData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What does your business do?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={businessData.locationCity}
                    onChange={(e) => setBusinessData({ ...businessData, locationCity: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={businessData.locationState}
                    onChange={(e) => setBusinessData({ ...businessData, locationState: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={2}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg text-lg transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}

        {activeTab === 'photos' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Upload Photos</h3>
              
              <label className="block">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition">
                  <div className="text-5xl mb-3">📷</div>
                  <p className="text-gray-700 font-semibold mb-1">Click to upload photos</p>
                  <p className="text-sm text-gray-500">Add photos of your work, equipment, or team</p>
                </div>
              </label>
            </div>

            {previews.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Your Photos ({previews.length})
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'accounts' && (
          <div className="space-y-6">
            {/* Facebook */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
                    f
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Facebook Page</h3>
                    <p className="text-sm text-gray-600">
                      {connections.facebook ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                {connections.facebook && (
                  <div className="text-green-600">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {connections.facebook ? (
                <button className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-semibold py-3 rounded-lg border border-red-200 transition">
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={handleConnectFacebook}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                >
                  Connect Facebook
                </button>
              )}
            </div>

            {/* Google */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-2xl">
                    G
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Google Business</h3>
                    <p className="text-sm text-gray-600">
                      {connections.google ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                {connections.google && (
                  <div className="text-green-600">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {connections.google ? (
                <button className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-semibold py-3 rounded-lg border border-red-200 transition">
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={handleConnectGoogle}
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 rounded-lg border-2 border-gray-300 transition"
                >
                  Connect Google
                </button>
              )}
            </div>

            {/* Cancel Subscription */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Cancel Subscription</h3>
              <p className="text-sm text-gray-600 mb-4">
                Cancel anytime. Your posts will continue until the end of your billing period.
              </p>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition">
                Manage Subscription
              </button>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
