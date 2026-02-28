'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';

interface Photo {
  id: string;
  filename: string;
  url: string;
  uploadedAt: string;
}

export default function UploadPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    setError('');
    setSuccess('');
    setUploading(true);

    try {
      const formData = new FormData();
      
      // Add all files to form data
      Array.from(files).forEach(file => {
        formData.append('photos', file);
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/media/upload-multiple`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${api.getToken()}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      setPhotos(prev => [...result.photos, ...prev]);
      setSuccess(`Successfully uploaded ${result.count} photo(s)!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleGeneratePosts = async () => {
    if (photos.length === 0) {
      setError('Please upload some photos first');
      return;
    }

    setGenerating(true);
    setError('');

    try {
      const photoIds = photos.map(p => p.id);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/bulk-generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${api.getToken()}`
        },
        body: JSON.stringify({ photoIds })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate posts');
      }

      const result = await response.json();
      setSuccess(`Created ${result.count} posts! Redirecting...`);
      
      // Redirect to posts page after 1.5 seconds
      setTimeout(() => {
        router.push('/dashboard/posts');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate posts');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to dashboard
          </Link>
          {photos.length > 0 && (
            <button
              onClick={handleGeneratePosts}
              disabled={generating}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? 'Generating...' : `Generate ${photos.length} Posts`}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Work Photos</h1>
          <p className="text-gray-600">
            Upload photos of your completed projects. We'll create social media posts with AI-generated captions for each one.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Upload Zone */}
        <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-12 mb-8 text-center"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            borderColor: dragActive ? '#3B82F6' : '#D1D5DB',
            backgroundColor: dragActive ? '#EFF6FF' : 'white'
          }}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            disabled={uploading}
          />
          
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="text-xl font-semibold text-gray-700">
              {uploading ? 'Uploading...' : 'Drag & drop photos here'}
            </span>
            <p className="text-gray-500 mt-2">or click to browse</p>
            <p className="text-sm text-gray-400 mt-2">Up to 50 photos • JPEG, PNG, GIF, WebP</p>
          </label>
        </div>

        {/* Photo Gallery */}
        {photos.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Uploaded Photos ({photos.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {photos.map(photo => (
                <div key={photo.id} className="relative group">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${photo.url}`}
                    alt={photo.filename}
                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100">
                      {photo.filename.substring(0, 20)}...
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {photos.length === 0 && !uploading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No photos uploaded yet. Upload some to get started!</p>
          </div>
        )}
      </main>
    </div>
  );
}
