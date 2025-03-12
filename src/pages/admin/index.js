import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { toast } from 'react-toastify';
import { adminLogin } from '@/lib/firebase';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  // Check if already logged in
  useEffect(() => {
    const adminToken = localStorage.getItem('geobit_admin_token');
    if (adminToken) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!password) {
      toast.error('Please enter the admin password');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await adminLogin({ password });
      
      if (result.data.success) {
        // Store token
        localStorage.setItem('geobit_admin_token', result.data.token);
        
        // Redirect to dashboard
        router.push('/admin/dashboard');
        toast.success('Login successful');
      } else {
        toast.error(result.data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login - GeoBit</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            GeoBit Admin
          </h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter admin password"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}