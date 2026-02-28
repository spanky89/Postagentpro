'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function OnboardingRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!api.isAuthenticated()) {
      router.push('/login');
    } else {
      router.push('/onboarding/step1');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-600">Loading...</div>
    </div>
  );
}
