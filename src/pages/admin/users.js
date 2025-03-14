import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiUser, FiPlus, FiTrash2, FiMail } from 'react-icons/fi';
import { toast } from 'react-toastify';
import AdminLayout from '@/components/AdminLayout';
import { getAdminUsers, addAdminUser, onAuthStateChange, checkIsAdmin } from '@/lib/firebase';

export default function AdminUsersPage() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newEmail, setNewEmail] = useState('');
    const [addingAdmin, setAddingAdmin] = useState(false);
    const [setupToken, setSetupToken] = useState('');
    const [showSetupToken, setShowSetupToken] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check authentication and admin status
        const unsubscribe = onAuthStateChange(async (user) => {
            if (user) {
                const isAdmin = await checkIsAdmin(user);
                if (!isAdmin) {
                    router.push('/admin');
                    toast.error("You don't have admin privileges");
                } else {
                    loadAdminUsers();
                }
            } else {
                router.push('/admin');
            }
        });

        return () => unsubscribe();
    }, [router]);

    const loadAdminUsers = async () => {
        try {
            setLoading(true);
            const result = await getAdminUsers();

            if (result.success) {
                setAdmins(result.admins || []);
            } else {
                toast.error(result.error || "Failed to load admin users");
            }
        } catch (error) {
            console.error('Load admins error:', error);
            toast.error("Failed to load admin users");
        } finally {
            setLoading(false);
        }
    };

    const handleAddAdmin = async (e) => {
        e.preventDefault();

        if (!newEmail) {
            toast.error("Email is required");
            return;
        }

        try {
            setAddingAdmin(true);
            const result = await addAdminUser(newEmail, showSetupToken ? setupToken : undefined);

            if (result.success) {
                toast.success(result.message || "Admin added successfully");
                setNewEmail("");
                loadAdminUsers();
            } else {
                toast.error(result.error || "Failed to add admin");
            }
        } catch (error) {
            console.error('Add admin error:', error);
            toast.error("Failed to add admin");
        } finally {
            setAddingAdmin(false);
        }
    };

    return (
        <AdminLayout title="Admin Users">
            <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-white">Add New Admin</h2>

                <form onSubmit={handleAddAdmin} className="flex flex-col space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-gray-300 mb-2">
                            Email Address
                        </label>
                        <div className="flex">
                            <input
                                id="email"
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="Enter email address"
                                className="flex-grow px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-md focus:ring-blue-500 focus:border-blue-500 text-white"
                                disabled={addingAdmin}
                            />
                            <button
                                type="submit"
                                disabled={addingAdmin || !newEmail}
                                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
                            >
                                {addingAdmin ? "Adding..." : (
                                    <>
                                        <FiPlus className="mr-1" />
                                        Add Admin
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="setup-token-toggle"
                            type="checkbox"
                            checked={showSetupToken}
                            onChange={() => setShowSetupToken(!showSetupToken)}
                            className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="setup-token-toggle" className="ml-2 text-sm text-gray-300">
                            Use setup token (for first admin)
                        </label>
                    </div>

                    {showSetupToken && (
                        <div>
                            <label htmlFor="setup-token" className="block text-gray-300 mb-2">
                                Setup Token
                            </label>
                            <input
                                id="setup-token"
                                type="password"
                                value={setupToken}
                                onChange={(e) => setSetupToken(e.target.value)}
                                placeholder="Enter setup token"
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
                            />
                            <p className="mt-1 text-sm text-gray-400">
                                The setup token is required for adding the first admin user. Contact your system administrator for this token.
                            </p>
                        </div>
                    )}
                </form>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-white">Current Admins</h2>

                {loading ? (
                    <div className="text-center py-4 text-gray-400">Loading admin users...</div>
                ) : admins.length === 0 ? (
                    <div className="text-center py-4 text-gray-400">No admin users found</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 bg-gray-700 text-left text-xs font-medium text-gray-300 uppercase tracking-wider rounded-tl-md">
                                        User
                                    </th>
                                    <th className="px-6 py-3 bg-gray-700 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 bg-gray-700 text-left text-xs font-medium text-gray-300 uppercase tracking-wider rounded-tr-md">
                                        Added
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {admins.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gray-600 rounded-full flex items-center justify-center">
                                                    <FiUser className="h-5 w-5 text-gray-300" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-white">
                                                        {admin.displayName || 'No Name'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-300">
                                                <FiMail className="mr-2" />
                                                {admin.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {admin.addedAt
                                                ? new Date(admin.addedAt.toDate ? admin.addedAt.toDate() : admin.addedAt).toLocaleString()
                                                : 'Unknown'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
} 