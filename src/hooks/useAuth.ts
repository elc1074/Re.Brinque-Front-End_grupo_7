"use client";

import { useState, useEffect } from 'react';
import { getCurrentAuth } from '@/lib/auth-utils';

export function useAuth() {
  const [auth, setAuth] = useState(getCurrentAuth());

  useEffect(() => {
    const handleStorageChange = () => {
      setAuth(getCurrentAuth());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return auth;
}