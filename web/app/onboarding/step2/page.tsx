'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingStep2() {
  const router = useRouter();
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    
    setPhotos(prev => [...prev, ...newFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    // Save photos info to localStorage (in real app, upload to server)
    localStorage.setItem('onboarding_photos', JSON.stringify({ count: photos.length }));
    router.push('/onboarding/step3');
  };

  const handleSkip = () => {
    router.push('/onboarding/step3');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step 2 of 3</span>
            <span className="text-sm text-gray-500">Add Photos</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '66%' }}></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📸</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload your work photos</h1>
          <p className="text-gray-600">Add 3-10 photos of projects, equipment, or your team. We'll use these in your posts.</p>
        </div>

        <div className="space-y-6">
          {/* Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`bg-white rounded-lg shadow-sm border-2 border-dashed p-12 text-center transition ${
              dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <div className="text-6xl mb-4">☁️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Drag & drop photos here
            </h3>
            <p className="text-gray-500 mb-4">or</p>
            <label className="inline-block">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
              <span className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg cursor-pointer inline-block transition">
                Browse Files
              </span>
            </label>
            <p className="text-sm text-gray-500 mt-4">
              {photos.length === 0 
                ? 'Minimum 3 photos recommended' 
                : `${photos.length} photo${photos.length !== 1 ? 's' : ''} added`}
            </p>
          </div>

          {/* Photo Grid */}
          {previews.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Your Photos</h3>
              <div className="grid grid-cols-3 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Upload ${index + 1}`}
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

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleNext}
              disabled={photos.length === 0}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg text-lg transition disabled:opacity-50 disabled:bg-gray-400"
            >
              {photos.length === 0 
                ? 'Add at least 1 photo to continue' 
                : `Continue with ${photos.length} photo${photos.length !== 1 ? 's' : ''} →`}
            </button>
            
            <button
              onClick={handleSkip}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 rounded-lg text-lg border border-gray-300 transition"
            >
              Skip for now (use stock photos)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
