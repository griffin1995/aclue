import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();

  // Redirect to maintenance page
  useEffect(() => {
    router.push('/maintenance');
  }, [router]);

  return null;
}