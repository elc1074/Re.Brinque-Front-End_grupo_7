"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GoogleSyncHandler() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleGoogleLogin = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        
        if (error) {
          alert(`Falha no login Google: ${error}. Tente novamente.`);
          router.push('/login');
          return;
        }
        
        if (code) {          
          try {
            const syncResponse = await fetch('https://back-rebrinque.onrender.com/api/auth/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                code: code,
                redirect_uri: 'https://front-re-brinque.vercel.app/google-callback'
              }),
            });
    
            if (syncResponse.ok) {
              const data = await syncResponse.json();
              
              sessionStorage.setItem('user', JSON.stringify(data.usuario));
              sessionStorage.setItem('auth_type', 'google');
              
              window.history.replaceState({}, '', '/');
              window.location.href = '/tela-inicial';
              
            } else {
              const errorText = await syncResponse.text();              
              alert('Erro no servidor: ' + errorText);
              router.push('/login');
            }

          } catch (error) {
            alert('Erro de conexão com o servidor.');
            router.push('/login');
          }
        }

      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    handleGoogleLogin();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300">
          Processando login Google...
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          Isso pode levar alguns segundos
        </p>
      </div>
    );
  }

  return null;
}