import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiBarChart2, FiUsers, FiFileText, FiCpu, FiSearch, FiLogOut } from 'react-icons/fi';
import Head from 'next/head';

export default function AdminLayout({ children }) {
  const router = useRouter();

  const handleLogout = () => {
    // Clear admin token
    localStorage.removeItem('geobit_admin_token');

    // Redirect to login
    router.push('/admin');
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
    <div className="min-h-screen bg-dark flex">
      <Head>
        <title>GeoBit Admin</title>
        <meta name="description" content="GeoBit Administration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Sidebar */}
      <aside className="w-64 bg-dark-lighter border-r border-dark-border">
        <div className="p-4 border-b border-dark-border">
          <Link href="/" className="block">
            <img
              src="/logo3.svg"
              alt="GeoBit Logo"
              width={200}
              height={50}
              className="h-12 w-auto"
            />
          </Link>
          <h1 className="text-xl font-bold text-primary mt-2">Admin Area</h1>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center px-4 py-2 rounded-md transition duration-200 ${isActiveOrHasActiveChild(link)
                      ? 'bg-primary text-dark font-bold'
                      : 'text-light hover:bg-dark-light'
                    }`}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </Link>

                {/* Display sublinks if present and parent is active or has active child */}
                {link.sublinks && (
                  <ul className="ml-4 mt-1 space-y-1">
                    {link.sublinks.map((sublink) => (
                      <li key={sublink.href}>
                        <Link
                          href={sublink.href}
                          className={`flex items-center px-4 py-1 text-sm rounded-md transition duration-200 ${router.pathname.startsWith(sublink.href)
                              ? 'bg-dark-light text-primary'
                              : 'text-light-muted hover:bg-dark-light hover:text-light'
                            }`}
                        >
                          <span className="mr-2">{sublink.icon}</span>
                          {sublink.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 mt-auto border-t border-dark-border">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-left text-light-muted hover:bg-dark-light hover:text-light rounded-md transition duration-200"
          >
            <FiLogOut className="mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto bg-dark">
        {children}
      </main>
    </div>
  );
}