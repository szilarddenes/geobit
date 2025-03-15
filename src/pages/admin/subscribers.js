import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useRouter } from 'next/router';
import { FiUsers, FiUserPlus, FiMail, FiCheck, FiAlertTriangle, FiXCircle, FiDownload, FiUpload } from 'react-icons/fi';
import { verifyAdminTokenLocally } from '../../lib/auth';

export default function AdminSubscribers() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [subscribers, setSubscribers] = useState([]);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newSubscriber, setNewSubscriber] = useState({ email: '', name: '' });
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const [selectedSubscribers, setSelectedSubscribers] = useState([]);
    const [isExporting, setIsExporting] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [isImporting, setIsImporting] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const adminToken = localStorage.getItem('geobit_admin_token');

        if (!adminToken) {
            router.push('/admin');
            return;
        }

        const checkAdmin = async () => {
            try {
                const isAdmin = await verifyAdminTokenLocally(adminToken);
                if (!isAdmin) {
                    localStorage.removeItem('geobit_admin_token');
                    router.push('/admin');
                    return;
                }

                fetchSubscribers();
            } catch (err) {
                console.error("Error verifying admin:", err);
                setError("Error verifying admin status");
                setIsLoading(false);
            }
        };

        checkAdmin();
    }, [router]);

    const fetchSubscribers = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // In development, use mock data
            if (process.env.NODE_ENV === 'development') {
                await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

                const mockSubscribers = [
                    { id: '1', email: 'john.doe@example.com', name: 'John Doe', status: 'active', subscribedDate: '2023-01-15', lastActivity: '2023-05-10' },
                    { id: '2', email: 'jane.smith@example.com', name: 'Jane Smith', status: 'active', subscribedDate: '2023-02-20', lastActivity: '2023-04-30' },
                    { id: '3', email: 'michael.brown@example.com', name: 'Michael Brown', status: 'inactive', subscribedDate: '2023-01-05', lastActivity: '2023-02-15' },
                    { id: '4', email: 'emily.jones@example.com', name: 'Emily Jones', status: 'active', subscribedDate: '2023-03-10', lastActivity: '2023-05-05' },
                    { id: '5', email: 'robert.wilson@example.com', name: 'Robert Wilson', status: 'active', subscribedDate: '2023-02-28', lastActivity: '2023-04-28' },
                    { id: '6', email: 'sophia.garcia@example.com', name: 'Sophia Garcia', status: 'active', subscribedDate: '2023-03-15', lastActivity: '2023-05-01' },
                    { id: '7', email: 'david.martinez@example.com', name: 'David Martinez', status: 'inactive', subscribedDate: '2023-01-20', lastActivity: '2023-02-20' },
                    { id: '8', email: 'olivia.miller@example.com', name: 'Olivia Miller', status: 'active', subscribedDate: '2023-02-10', lastActivity: '2023-04-15' },
                    { id: '9', email: 'james.taylor@example.com', name: 'James Taylor', status: 'active', subscribedDate: '2023-03-05', lastActivity: '2023-05-08' },
                    { id: '10', email: 'emma.anderson@example.com', name: 'Emma Anderson', status: 'active', subscribedDate: '2023-02-15', lastActivity: '2023-04-25' }
                ];

                setSubscribers(mockSubscribers);
            } else {
                // In production, fetch real data
                const response = await fetch('/api/admin/subscribers', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('geobit_admin_token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch subscribers');
                }

                const data = await response.json();
                setSubscribers(data.subscribers);
            }
        } catch (err) {
            console.error('Error fetching subscribers:', err);
            setError(err.message || 'Failed to load subscribers data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSubscriber = async (e) => {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(null);

        // Simple validation
        if (!newSubscriber.email) {
            setFormError('Email is required');
            return;
        }

        try {
            // Mock API call in development
            if (process.env.NODE_ENV === 'development') {
                await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

                // Add subscriber to the local state
                const newId = (subscribers.length + 1).toString();
                const now = new Date().toISOString().split('T')[0];

                const addedSubscriber = {
                    id: newId,
                    email: newSubscriber.email,
                    name: newSubscriber.name || '',
                    status: 'active',
                    subscribedDate: now,
                    lastActivity: now
                };

                setSubscribers([...subscribers, addedSubscriber]);
                setFormSuccess(`Subscriber ${newSubscriber.email} added successfully!`);
                setNewSubscriber({ email: '', name: '' });
                setShowAddForm(false);
            } else {
                // In production, make real API call
                const response = await fetch('/api/admin/subscribers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('geobit_admin_token')}`
                    },
                    body: JSON.stringify(newSubscriber)
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to add subscriber');
                }

                const data = await response.json();
                setSubscribers([...subscribers, data.subscriber]);
                setFormSuccess(`Subscriber ${newSubscriber.email} added successfully!`);
                setNewSubscriber({ email: '', name: '' });
                setShowAddForm(false);
            }
        } catch (err) {
            console.error('Error adding subscriber:', err);
            setFormError(err.message || 'Failed to add subscriber');
        }
    };

    const handleDeleteSubscriber = async (id) => {
        if (!confirm('Are you sure you want to delete this subscriber?')) {
            return;
        }

        try {
            // Mock API call in development
            if (process.env.NODE_ENV === 'development') {
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

                // Remove from local state
                setSubscribers(subscribers.filter(sub => sub.id !== id));
            } else {
                // In production, make real API call
                const response = await fetch(`/api/admin/subscribers/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('geobit_admin_token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete subscriber');
                }

                setSubscribers(subscribers.filter(sub => sub.id !== id));
            }
        } catch (err) {
            console.error('Error deleting subscriber:', err);
            setError(err.message || 'Failed to delete subscriber');
        }
    };

    const handleExportSubscribers = async () => {
        setIsExporting(true);

        try {
            const selectedData = selectedSubscribers.length > 0
                ? subscribers.filter(sub => selectedSubscribers.includes(sub.id))
                : subscribers;

            const csvContent = [
                ['ID', 'Email', 'Name', 'Status', 'Subscribed Date', 'Last Activity'],
                ...selectedData.map(sub => [
                    sub.id,
                    sub.email,
                    sub.name,
                    sub.status,
                    sub.subscribedDate,
                    sub.lastActivity
                ])
            ]
                .map(row => row.join(','))
                .join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('hidden', '');
            a.setAttribute('href', url);
            a.setAttribute('download', 'subscribers.csv');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (err) {
            console.error('Error exporting subscribers:', err);
            setError(err.message || 'Failed to export subscribers');
        } finally {
            setIsExporting(false);
        }
    };

    const handleImportSubscribers = async (e) => {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(null);

        if (!importFile) {
            setFormError('Please select a CSV file to import');
            return;
        }

        setIsImporting(true);

        try {
            // For development, simulate import
            if (process.env.NODE_ENV === 'development') {
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

                setFormSuccess('Successfully imported 5 subscribers');
                setImportFile(null);
            } else {
                // In production, make real API call
                const formData = new FormData();
                formData.append('file', importFile);

                const response = await fetch('/api/admin/subscribers/import', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('geobit_admin_token')}`
                    },
                    body: formData
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to import subscribers');
                }

                const data = await response.json();
                setFormSuccess(`Successfully imported ${data.imported} subscribers`);
                setImportFile(null);
                fetchSubscribers(); // Refresh the list
            }
        } catch (err) {
            console.error('Error importing subscribers:', err);
            setFormError(err.message || 'Failed to import subscribers');
        } finally {
            setIsImporting(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="text-light bg-dark-light p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Error</h2>
                    <p>{error}</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-light">Subscribers</h1>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="bg-primary hover:bg-primary/80 text-dark font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-primary transition-colors flex items-center"
                        >
                            <FiUserPlus className="mr-2" />
                            Add Subscriber
                        </button>

                        <button
                            onClick={handleExportSubscribers}
                            disabled={isExporting}
                            className="bg-dark-light hover:bg-dark-light/80 text-light font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-primary transition-colors flex items-center disabled:opacity-50"
                        >
                            {isExporting ? (
                                <span className="flex items-center">
                                    <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-primary rounded-full"></span>
                                    Exporting...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <FiDownload className="mr-2" />
                                    Export
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Success Message */}
                {formSuccess && (
                    <div className="bg-green-900/20 text-green-500 p-4 rounded-lg flex items-start">
                        <FiCheck className="mr-2 mt-1 flex-shrink-0" />
                        <p>{formSuccess}</p>
                    </div>
                )}

                {/* Import Section */}
                <div className="bg-dark-lighter border border-dark-border rounded-lg p-4 shadow-lg">
                    <h2 className="text-lg font-bold text-light mb-3">Import Subscribers</h2>
                    <form onSubmit={handleImportSubscribers} className="flex flex-col md:flex-row items-end gap-4">
                        <div className="flex-1">
                            <label className="block text-light mb-1 font-medium">CSV File</label>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={(e) => setImportFile(e.target.files[0])}
                                className="w-full p-2 rounded bg-dark border border-dark-border text-light focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            {formError && (
                                <p className="text-red-500 text-sm mt-1">{formError}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={isImporting || !importFile}
                            className="bg-dark-border hover:bg-dark-border/80 text-light font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-primary transition-colors flex items-center disabled:opacity-50"
                        >
                            {isImporting ? (
                                <span className="flex items-center">
                                    <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-primary rounded-full"></span>
                                    Importing...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <FiUpload className="mr-2" />
                                    Import
                                </span>
                            )}
                        </button>
                    </form>
                </div>

                {/* Add Subscriber Form */}
                {showAddForm && (
                    <div className="bg-dark-lighter border border-dark-border rounded-lg p-6 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-light">Add New Subscriber</h2>
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="text-light-muted hover:text-light"
                            >
                                <FiXCircle className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddSubscriber} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-light mb-1 font-medium">
                                    Email *
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="w-full p-2 rounded bg-dark border border-dark-border text-light focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="subscriber@example.com"
                                    value={newSubscriber.email}
                                    onChange={(e) => setNewSubscriber({ ...newSubscriber, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label htmlFor="name" className="block text-light mb-1 font-medium">
                                    Name (optional)
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    className="w-full p-2 rounded bg-dark border border-dark-border text-light focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Subscriber's name"
                                    value={newSubscriber.name}
                                    onChange={(e) => setNewSubscriber({ ...newSubscriber, name: e.target.value })}
                                />
                            </div>

                            {formError && (
                                <div className="text-red-500 text-sm">{formError}</div>
                            )}

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-primary hover:bg-primary/80 text-dark font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-primary transition-colors flex items-center"
                                >
                                    <FiUserPlus className="mr-2" />
                                    Add Subscriber
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Subscribers Table */}
                <div className="bg-dark-lighter border border-dark-border rounded-lg overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-dark-border">
                            <thead className="bg-dark-light">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-muted uppercase tracking-wider">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 accent-primary rounded border-dark-border bg-dark"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedSubscribers(subscribers.map(s => s.id));
                                                } else {
                                                    setSelectedSubscribers([]);
                                                }
                                            }}
                                            checked={selectedSubscribers.length === subscribers.length && subscribers.length > 0}
                                        />
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-muted uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-muted uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-muted uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-muted uppercase tracking-wider">
                                        Subscribed Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-muted uppercase tracking-wider">
                                        Last Activity
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-light-muted uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-border">
                                {subscribers.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-light-muted">
                                            No subscribers found
                                        </td>
                                    </tr>
                                ) : (
                                    subscribers.map((subscriber) => (
                                        <tr key={subscriber.id} className="hover:bg-dark-light/50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 accent-primary rounded border-dark-border bg-dark"
                                                    checked={selectedSubscribers.includes(subscriber.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedSubscribers([...selectedSubscribers, subscriber.id]);
                                                        } else {
                                                            setSelectedSubscribers(selectedSubscribers.filter(id => id !== subscriber.id));
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FiMail className="text-light-muted mr-2" />
                                                    <span className="text-light">{subscriber.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-light">
                                                {subscriber.name || <span className="text-light-muted">Not provided</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${subscriber.status === 'active'
                                                    ? 'bg-green-900/20 text-green-500'
                                                    : 'bg-red-900/20 text-red-500'
                                                    }`}>
                                                    {subscriber.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-light-muted">
                                                {formatDate(subscriber.subscribedDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-light-muted">
                                                {formatDate(subscriber.lastActivity)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleDeleteSubscriber(subscriber.id)}
                                                    className="text-red-500 hover:text-red-400"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 