import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { getNewsletters } from '@/lib/firebase';

// Admin components
import AdminLayout from '@/components/admin/AdminLayout';

export default function NewslettersPage() {
    const [newsletters, setNewsletters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Check if logged in
    useEffect(() => {
        const adminToken = localStorage.getItem('geobit_admin_token');
        if (!adminToken) {
            router.push('/admin');
            return;
        }

        fetchNewsletters(adminToken);
    }, [router]);

    const fetchNewsletters = async (token) => {
        setIsLoading(true);

        try {
            const result = await getNewsletters({ token });

            if (result.data.success) {
                setNewsletters(result.data.newsletters);
            } else {
                toast.error(result.data.error || 'Failed to load newsletters');
            }
        } catch (error) {
            console.error('Error fetching newsletters:', error);
            toast.error('Failed to load newsletters. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout>
            <Head>
                <title>Newsletters - GeoBit Admin</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex justify-between items-center mb-6">
} 