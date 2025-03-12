import { useRouter } from 'next/router';
import Link from 'next/link';

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
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/newsletters', label: 'Newsletters' },
    { href: '/admin/sources', label: 'Content Sources' },
    { href: '/admin/subscribers', label: 'Subscribers' },
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

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white">
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-xl font-bold">GeoBit Admin</h1>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-4 py-2 rounded-md transition duration-200 ${
                    isActive(link.href)
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 mt-auto border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 rounded-md transition duration-200"
          >
            Logout
          </button>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}