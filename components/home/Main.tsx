'use client';

import Header from '@/components/home/Header';
import ServicesBanner from '@/components/home/ServicesBanner';
import Reassurance from '@/components/home/Reassurance';
import GetStarted from '@/components/home/GetStarted';
import GlobalFooter from '@/components/GlobalFooter';
import { useEffect, useState } from 'react';
import { getUserSession } from '@/utils/reuseableCode';
import { useRouter } from 'next/navigation';


export default function MainHomeComponent() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const isAuthenticated = getUserSession();

    if (isAuthenticated) {
      router.push('/jobs');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#fd8700] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1">
        <ServicesBanner />
        <Reassurance />
        <GetStarted />
      </main>
      <GlobalFooter />
    </div>
  );
}
