'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/utils/adminAuth';
import { getFirestore, collection, query, where, getDocs, getCountFromServer } from 'firebase/firestore';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, loading, isAdmin } = useAdminAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    activeSubscribers: 0,
    totalNewsletters: 0,
    publishedNewsletters: 0,
    totalArticles: 0,
    categoriesCount: {},
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect if not admin and done loading
    if (!loading && !isAdmin) {
      router.push('/login?redirect=admin');
      return;
    }

    if (isAdmin) {
      fetchDashboardStats();
    }
  }, [loading, isAdmin, router]);

  async function fetchDashboardStats() {
    try {
      const db = getFirestore();
      setIsLoading(true);

      // Get subscribers counts
      const subscribersRef = collection(db, 'subscribers');
      const totalSubscribersSnapshot = await getCountFromServer(subscribersRef);
      const activeSubscribersSnapshot = await getCountFromServer(
        query(subscribersRef, where('active', '==', true))
      );

      // Get newsletters counts
      const newslettersRef = collection(db, 'newsletters');
      const totalNewslettersSnapshot = await getCountFromServer(newslettersRef);
      const publishedNewslettersSnapshot = await getCountFromServer(
        query(newslettersRef, where('published', '==', true))
      );

      // Get articles counts
      const articlesRef = collection(db, 'articles');
      const totalArticlesSnapshot = await getCountFromServer(articlesRef);

      // Get category distribution
      const articlesSnapshot = await getDocs(articlesRef);
      const categoriesMap = {};
      
      articlesSnapshot.forEach(doc => {
        const article = doc.data();
        if (article.categories && Array.isArray(article.categories)) {
          article.categories.forEach(category => {
            categoriesMap[category] = (categoriesMap[category] || 0) + 1;
          });
        }
      });

      setStats({
        totalSubscribers: totalSubscribersSnapshot.data().count,
        activeSubscribers: activeSubscribersSnapshot.data().count,
        totalNewsletters: totalNewslettersSnapshot.data().count,
        publishedNewsletters: publishedNewslettersSnapshot.data().count,
        totalArticles: totalArticlesSnapshot.data().count,
        categoriesCount: categoriesMap,
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setIsLoading(false);
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">GeoBit Admin Dashboard</h1>
          <p className="mt-1 text-gray-500">Manage your newsletter and content</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Subscribers</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.totalSubscribers}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link href="/admin/subscribers" className="font-medium text-blue-600 hover:text-blue-500">
                  View all subscribers
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Published Newsletters</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.publishedNewsletters}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link href="/admin/newsletters" className="font-medium text-blue-600 hover:text-blue-500">
                  Manage newsletters
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Articles</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.totalArticles}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link href="/admin/articles" className="font-medium text-blue-600 hover:text-blue-500">
                  Manage articles
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Subscribers</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.activeSubscribers}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link href="/admin/analytics" className="font-medium text-blue-600 hover:text-blue-500">
                  View analytics
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link href="/admin/newsletters/create" className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Create New Newsletter
                </Link>
                <Link href="/admin/articles/create" className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Add New Article
                </Link>
                <Link href="/admin/settings" className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                  Edit Site Settings
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="mt-8">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Content Category Distribution</h3>
              <div className="mt-5">
                {Object.entries(stats.categoriesCount).length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(stats.categoriesCount)
                      .sort((a, b) => b[1] - a[1])
                      .map(([category, count]) => (
                        <div key={category} className="bg-gray-50 px-4 py-3 rounded-md">
                          <div className="text-sm font-medium text-gray-500">{category}</div>
                          <div className="mt-1 text-2xl font-semibold text-gray-900">{count}</div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No categories data available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
