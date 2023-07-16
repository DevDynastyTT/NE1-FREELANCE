'use client';

import '@styles/home/style.css';
import Header from '@components/home/Header';
import ServicesBanner from '@components/home/ServicesBanner';
import Reassurance from '@components/home/Reassurance';
import GetStarted from '@components/home/GetStarted';
import GlobalFooter from '@components/GlobalFooter';
import { Metadata } from 'next';
import { useEffect, useState } from 'react';
import { fetchCategories, getUserSession } from '@utils/reuseableCode';
import { getCategories } from '@utils/APIRoutes';
import { useRouter } from 'next/navigation';
import { JobCategory, SessionType } from '@utils/types';


export default function MainHomeComponent() {
  const router = useRouter();

  const [session, setSession] = useState<SessionType | undefined>();
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const isAuthenticated = getUserSession();
    setSession(isAuthenticated);

    if (isAuthenticated) {
      router.push('/jobs');
    } else {
      fetchCategories(setJobCategories, getCategories)
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch categories:', error);
        });
    }
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Home">
      <Header />
      <main className="home-main-container">
        {/* Displays 4 SERVICES */}
        <ServicesBanner />
        {/* Text ABOUT THE SERVICES */}
        <Reassurance />
        {/* Login/Sign up banner */}
        <GetStarted />
        <br />
        <br />
        <GlobalFooter />
      </main>
    </div>
  );
}
