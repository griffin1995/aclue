import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to maintenance page
    router.replace('/maintenance');
  }, [router]);

  return null; // Page will redirect to maintenance
}