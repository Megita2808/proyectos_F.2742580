'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
require('dotenv').config();

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/cliente/principal');
  }, [router]);

  return null;
}
