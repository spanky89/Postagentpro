'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import BottomNav from '@/app/components/BottomNav';

export default function GeneratePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [post, setPost] = useState<any>(null);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');

  useEffect(() => {
    if (!api.isAuthenticated()) {
      router.push('/login');
      return;
    }
    setLoading(false);
    
    // Set default schedule date to tomorrow at 10 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    setScheduleDate(tomorrow.toISOString().slice(0, 16));
  }, [router]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await api.generatePost('general', true);
      setPost(result.post || result);
    } catch (error) {
      console.error('Failed to generate post:', error);
      alert('Failed to generate post. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handlePostNow = async () => {
    if (!post) return;
    
    setLoading(true);
    try {
      await api.publishPostNow(post.id);
      alert('Post published successfully!');
      router.push('/dashboard/home');
    } catch (error) {
      console.error('Failed to publish post:', error);
      alert('Failed to publish post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!post || !scheduleDate) return;
    
    setLoading(true);
    try {
      await api.updatePost(post.id, {
        scheduledFor: new Date(scheduleDate).toISOString(),
        status: 'scheduled'
      });
      alert('Post scheduled successfully!');
      router.push('/dashboard/home');
    } catch (error) {
      console.error('Failed to schedule post:', error);
      alert('Failed to schedule post. Please try again.');
    } finally {
      setLoading(false);
      setScheduling(false);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Create Your Next Post</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {!post ? (
          /* No Post Generated */
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Let AI create your post</h2>
              <p className="text-gray-600 mb-6">
                We'll automatically generate a post using your business info and photos
              </p>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    AI cooking up your post...
                  </span>
                ) : (
                  'Generate Post'
                )}
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>How it works:</strong> Our AI will create a professional post based on your business type, location, and uploaded photos. Takes about 5 seconds.
              </p>
            </div>
          </div>
        ) : (
          /* Post Generated */
          <div className="space-y-6">
            {/* Preview Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-700">Preview</p>
              </div>
              
              <div className="p-4">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                    {post.businessName?.[0] || 'B'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Your Business</p>
                    <p className="text-xs text-gray-500">Just now</p>
                  </div>
                </div>
                
                <p className="text-gray-900 mb-4 whitespace-pre-wrap leading-relaxed">
                  {post.text || post.caption}
                </p>
                
                {post.imageUrl && (
                  <img 
                    src={post.imageUrl} 
                    alt="Post" 
                    className="w-full rounded-lg"
                  />
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {!scheduling ? (
              <div className="space-y-3">
                <button
                  onClick={handlePostNow}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg text-lg transition disabled:opacity-50"
                >
                  {loading ? 'Publishing...' : 'Post Now 🚀'}
                </button>
                
                <button
                  onClick={() => setScheduling(true)}
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 rounded-lg text-lg border-2 border-gray-300 transition"
                >
                  Schedule for Later 📅
                </button>
                
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg border border-gray-300 transition disabled:opacity-50"
                >
                  {generating ? 'Generating...' : 'Generate Different Post'}
                </button>
              </div>
            ) : (
              /* Schedule Form */
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Schedule Post</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    When should we post this?
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  />
                  <p className="mt-2 text-sm text-gray-500">Default: Tomorrow at 10:00 AM</p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleSchedule}
                    disabled={loading || !scheduleDate}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
                  >
                    {loading ? 'Scheduling...' : 'Schedule'}
                  </button>
                  <button
                    onClick={() => setScheduling(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Tip:</strong> Post now to go live immediately, or schedule for a time when your audience is most active (typically 10 AM or 7 PM).
              </p>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
