import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main admin page
    router.replace('/admin');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <Head>
        <title>Redirecting... - GeoBit Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="text-center">
        <p className="text-slate-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}