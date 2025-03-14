import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import {
    FiUser,
    FiHome,
    FiMail,
    FiList,
    FiFileText,
    FiUsers,
    FiSettings,
    FiLogOut,
    FiMenu,
    FiX
} from 'react-icons/fi';
import { logoutUser, onAuthStateChange } from '@/lib/firebase';

export default function AdminLayout({ children, title }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChange((user) => {
            setCurrentUser(user);
            if (!user) {
                router.push('/admin');
            }
        });

        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        await logoutUser();
        router.push('/admin');
    };

    const navItems = [
        { href: '/admin', text: 'Dashboard', icon: <FiHome /> },
        { href: '/admin/sources', text: 'Content Sources', icon: <FiList /> },
        { href: '/admin/content', text: 'Content', icon: <FiFileText /> },
        { href: '/admin/subscribers', text: 'Subscribers', icon: <FiMail /> },
        { href: '/admin/users', text: 'Admin Users', icon: <FiUsers /> },
        { href: '/admin/settings', text: 'Settings', icon: <FiSettings /> },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <Head>
                <title>{title} - GeoBit Admin</title>
                <meta name="description" content="GeoBit Administration" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="robots" content="noindex, nofollow" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
                {/* Top Navigation */}
                <nav className="bg-gray-800 text-white py-3 px-4 shadow-md">
                    <div className="container mx-auto flex justify-between items-center">
                        <Link href="/admin" className="text-xl font-bold">
                            GeoBit Admin
                        </Link>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden p-2 rounded-md hover:bg-gray-700 focus:outline-none"
                            onClick={toggleMobileMenu}
                        >
                            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>

                        {/* Desktop user info */}
                        {currentUser && (
                            <div className="hidden md:flex items-center space-x-4">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-2">
                                        <FiUser />
                                    </div>
                                    <span className="text-sm font-medium">
                                        {currentUser.displayName || currentUser.email || 'Admin'}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
                                >
                                    <FiLogOut className="mr-1" /> Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </nav>

                <div className="flex flex-1">
                    {/* Sidebar Navigation */}
                    <aside className={`
            bg-gray-800 w-64 shadow-lg fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out z-30
            md:translate-x-0 md:static md:h-auto
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
                        {/* Mobile close button */}
                        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-700">
                            <Link href="/admin" className="text-xl font-bold">
                                GeoBit Admin
                            </Link>
                            <button
                                className="p-2 rounded-md hover:bg-gray-700 focus:outline-none"
                                onClick={toggleMobileMenu}
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Mobile user info */}
                        {currentUser && (
                            <div className="md:hidden flex items-center p-4 border-b border-gray-700">
                                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-2">
                                    <FiUser />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium">
                                        {currentUser.displayName || 'Admin'}
                                    </div>
                                    <div className="text-xs text-gray-400 truncate">
                                        {currentUser.email}
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <FiLogOut size={18} />
                                </button>
                            </div>
                        )}

                        {/* Nav items */}
                        <nav className="mt-5 px-2 space-y-1">
                            {navItems.map((item) => {
                                const isActive = router.pathname === item.href ||
                                    (item.href !== '/admin' && router.pathname.startsWith(item.href));

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`
                      group flex items-center px-4 py-3 text-sm font-medium rounded-md
                      transition-colors duration-150 ease-in-out
                      ${isActive
                                                ? 'bg-gray-700 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                    `}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <span className={`mr-3 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                            {item.icon}
                                        </span>
                                        {item.text}
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 p-4 md:p-8">
                        <div className="container mx-auto">
                            <h1 className="text-2xl font-bold mb-6 text-white">{title}</h1>
                            {children}
                        </div>
                    </main>
                </div>

                {/* Overlay for mobile menu */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}
            </div>
        </>
    );
} 