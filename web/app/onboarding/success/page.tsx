'use client';

import { useRouter } from 'next/navigation';

export default function OnboardingSuccess() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/dashboard/generate');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        {/* Success Animation */}
        <div className="mb-8 animate-bounce">
          <div className="inline-block bg-white rounded-full p-8 shadow-2xl">
            <svg className="w-24 h-24 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-5xl font-bold text-white mb-4">
          You're All Set! 🎉
        </h1>
        <p className="text-2xl text-white/90 mb-8">
          PostAgentPro is ready to handle your social media
        </p>

        {/* What's Next */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-6">What happens now?</h2>
          <div className="space-y-4 text-left max-w-md mx-auto">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
              <div>
                <p className="font-semibold">AI generates your first post</p>
                <p className="text-sm text-white/80">Using your business info and photos</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl">🚀</span>
              </div>
              <div>
                <p className="font-semibold">Posts go live automatically</p>
                <p className="text-sm text-white/80">3 times per week, every week</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl">📈</span>
              </div>
              <div>
                <p className="font-semibold">You do absolutely nothing</p>
                <p className="text-sm text-white/80">Check in when you want, or never</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleGetStarted}
          className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-5 px-12 rounded-full text-xl transition transform hover:scale-105 shadow-xl"
        >
          Generate My First Post →
        </button>
      </div>
    </div>
  );
}
