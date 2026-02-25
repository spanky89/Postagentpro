'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';

interface Post {
  id: string;
  content: string;
  scheduledFor: string;
  status: string;
  mediaUrl?: string;
  platform: string;
  account: {
    platform: string;
    accountName: string;
  };
}

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!api.isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadPosts();
  }, [router]);

  const loadPosts = async () => {
    try {
      const data = await api.getPosts();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePost = async () => {
    setGenerating(true);
    setError('');
    try {
      await api.generatePost('general', true);
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate post');
    } finally {
      setGenerating(false);
    }
  };

  const handleBulkGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      await api.bulkGeneratePosts(7, ['general', 'educational', 'seasonal']);
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate posts');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    
    try {
      await api.deletePost(id);
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      case 'publishing': return 'bg-purple-100 text-purple-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Posts</h1>
            <p className="text-gray-600">Manage your scheduled social media posts</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleGeneratePost}
              disabled={generating}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {generating ? 'Generating...' : '+ Generate Post'}
            </button>
            <button
              onClick={handleBulkGenerate}
              disabled={generating}
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate 7 Days'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Posts Yet</h3>
            <p className="text-gray-600 mb-6">
              Generate your first post to get started with AI-powered social media content
            </p>
            <button
              onClick={handleGeneratePost}
              disabled={generating}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate First Post'}
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex gap-6">
                  {post.mediaUrl && (
                    <div className="flex-shrink-0">
                      <img
                        src={post.mediaUrl}
                        alt="Post image"
                        className="w-48 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(post.status)}`}>
                          {post.status.toUpperCase()}
                        </span>
                        <span className="ml-3 text-sm text-gray-500">
                          📅 {formatDate(post.scheduledFor)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>

                    <p className="text-gray-900 whitespace-pre-wrap mb-3">
                      {post.content}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>📱 {post.account.accountName}</span>
                      <span>🌐 {post.platform}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
