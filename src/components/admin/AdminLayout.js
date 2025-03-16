import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiBarChart2, FiUsers, FiFileText, FiCpu, FiSearch, FiLogOut, FiHome, FiSettings, FiMenu } from 'react-icons/fi';
import Head from 'next/head';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    // Clear admin token
    localStorage.removeItem('geobit_admin_token');

    // Redirect to login
    router.push('/admin');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Navigation links
  const navLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <FiBarChart2 /> },
    { href: '/admin/newsletters', label: 'Newsletters', icon: <FiFileText /> },
    {
      href: '/admin/content',
      label: 'Content',
      icon: <FiFileText />,
      sublinks: [
        { href: '/admin/content/process', label: 'Process Content', icon: <FiCpu /> },
        { href: '/admin/content/search', label: 'Search News', icon: <FiSearch /> },
        { href: '/admin/sources', label: 'Content Sources', icon: <FiFileText /> }
      ]
    },
    { href: '/admin/subscribers', label: 'Subscribers', icon: <FiUsers /> },
  ];

  // Check if link is active
  const isActive = (href) => {
    if (href === '/admin/dashboard' && router.pathname === '/admin/dashboard') {
      return true;
    }

    if (href !== '/admin/dashboard' && router.pathname.startsWith(href)) {
      return true;
    }

    return false;
  };

  // Check if a link or any of its sublinks is active
  const isActiveOrHasActiveChild = (link) => {
    if (isActive(link.href)) {
      return true;
    }

    if (link.sublinks) {
      return link.sublinks.some(sublink => router.pathname.startsWith(sublink.href));
    }

    return false;
  };

  return (
    <div className="min-h-screen bg-dark text-light flex flex-col">
      <Head>
        <title>GeoBit Admin</title>
        <meta name="description" content="GeoBit Admin Dashboard" />
      </Head>

      {/* Mobile Menu Button */}
      <div className="lg:hidden p-4 bg-dark-lighter border-b border-dark-border">
        <button
          onClick={toggleSidebar}
          className="p-2 text-light hover:bg-dark-light rounded-md"
        >
          <FiMenu className="h-6 w-6" />
        </button>
      </div>

      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-dark-lighter border-r border-dark-border fixed inset-y-0 left-0 z-20 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:static lg:w-64 lg:min-h-screen overflow-y-auto`}
        >
          <div className="p-6 border-b border-dark-border">
            <h1 className="text-2xl font-bold text-primary">GeoBit Admin</h1>
          </div>

          <nav className="p-4 space-y-1">
            <Link
              href="/admin"
              className="flex items-center p-3 text-light hover:bg-dark-light rounded-md group transition-colors"
            >
              <FiHome className="mr-3 text-lg text-primary" />
              Dashboard
            </Link>
            <Link
              href="/admin/subscribers"
              className="flex items-center p-3 text-light hover:bg-dark-light rounded-md group transition-colors"
            >
              <FiUsers className="mr-3 text-lg text-primary" />
              Subscribers
            </Link>
            <Link
              href="/admin/content"
              className="flex items-center p-3 text-light hover:bg-dark-light rounded-md group transition-colors"
            >
              <FiFileText className="mr-3 text-lg text-primary" />
              Content
            </Link>
            <Link
              href="/admin/analytics"
              className="flex items-center p-3 text-light hover:bg-dark-light rounded-md group transition-colors"
            >
              <FiBarChart2 className="mr-3 text-lg text-primary" />
              Analytics
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center p-3 text-light hover:bg-dark-light rounded-md group transition-colors"
            >
              <FiSettings className="mr-3 text-lg text-primary" />
              Settings
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto h-screen bg-dark p-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}