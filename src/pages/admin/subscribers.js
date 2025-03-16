import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { FiUsers, FiUserPlus, FiUserMinus, FiEdit, FiTrash, FiDownload, FiUpload, FiSearch } from 'react-icons/fi';

export default function SubscribersPage() {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newSubscriber, setNewSubscriber] = useState({ email: '', name: '' });

    // Mock data for development
    useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                setLoading(true);

                // In a real implementation, this would call a Firebase function
                // Mock data for development
                const mockSubscribers = [
                    { id: '1', email: 'john.doe@example.com', name: 'John Doe', status: 'active', joinDate: '2023-02-15', lastNewsletter: '2023-05-01' },
                    { id: '2', email: 'jane.smith@example.com', name: 'Jane Smith', status: 'active', joinDate: '2023-03-10', lastNewsletter: '2023-05-01' },
                    { id: '3', email: 'alex.brown@example.com', name: 'Alex Brown', status: 'inactive', joinDate: '2023-01-20', lastNewsletter: '2023-04-15' },
                    { id: '4', email: 'sarah.johnson@example.com', name: 'Sarah Johnson', status: 'active', joinDate: '2023-04-05', lastNewsletter: '2023-05-01' },
                    { id: '5', email: 'michael.wilson@example.com', name: 'Michael Wilson', status: 'active', joinDate: '2023-02-28', lastNewsletter: '2023-05-01' },
                ];

                // Simulate API delay
                setTimeout(() => {
                    setSubscribers(mockSubscribers);
                    setLoading(false);
                }, 1000);
            } catch (err) {
                console.error('Error fetching subscribers:', err);
                setError('Failed to load subscribers. Please try again later.');
                setLoading(false);
            }
        };

        fetchSubscribers();
    }, []);

    // Filter subscribers based on search term
    const filteredSubscribers = subscribers.filter(subscriber =>
        subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscriber.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddSubscriber = (e) => {
        e.preventDefault();

        // Validate input
        if (!newSubscriber.email || !newSubscriber.email.includes('@')) {
            alert('Please enter a valid email address');
            return;
        }

        // Add subscriber to the list
        const newId = (Math.max(0, ...subscribers.map(s => parseInt(s.id))) + 1).toString();
        const today = new Date().toISOString().split('T')[0];

        setSubscribers([
            ...subscribers,
            {
                id: newId,
                email: newSubscriber.email,
                name: newSubscriber.name || 'Unnamed Subscriber',
                status: 'active',
                joinDate: today,
                lastNewsletter: 'None'
            }
        ]);

        // Reset form
        setNewSubscriber({ email: '', name: '' });
        setShowAddForm(false);
    };

    const handleDeleteSubscriber = (id) => {
        if (window.confirm('Are you sure you want to delete this subscriber?')) {
            setSubscribers(subscribers.filter(s => s.id !== id));
        }
    };

    const handleStatusToggle = (id) => {
        setSubscribers(subscribers.map(s =>
            s.id === id
                ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' }
                : s
        ));
    };

    return (
        <AdminLayout title="Subscriber Management">
            <div className="space-y-6">
                {/* Header with stats */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="bg-dark-lighter p-4 rounded-lg shadow flex-1 min-w-[200px] border border-dark-border">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-light-muted text-sm">Total Subscribers</p>
                                <p className="text-2xl font-bold text-light">{subscribers.length}</p>
                            </div>
                            <FiUsers className="text-primary text-3xl" />
                        </div>
                    </div>

                    <div className="bg-dark-lighter p-4 rounded-lg shadow flex-1 min-w-[200px] border border-dark-border">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-light-muted text-sm">Active Subscribers</p>
                                <p className="text-2xl font-bold text-light">
                                    {subscribers.filter(s => s.status === 'active').length}
                                </p>
                            </div>
                            <FiUserPlus className="text-green-500 text-3xl" />
                        </div>
                    </div>

                    <div className="bg-dark-lighter p-4 rounded-lg shadow flex-1 min-w-[200px] border border-dark-border">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-light-muted text-sm">Inactive Subscribers</p>
                                <p className="text-2xl font-bold text-light">
                                    {subscribers.filter(s => s.status === 'inactive').length}
                                </p>
                            </div>
                            <FiUserMinus className="text-red-500 text-3xl" />
                        </div>
                    </div>
                </div>

                {/* Tools */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search subscribers..."
                                className="w-full p-3 pl-10 rounded bg-dark border border-dark-border text-light focus:outline-none focus:ring-2 focus:ring-primary"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FiSearch className="absolute left-3 top-3.5 text-light-muted" />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            className="p-2.5 bg-primary hover:bg-primary/80 rounded text-dark font-medium transition-colors flex items-center"
                            onClick={() => setShowAddForm(true)}
                        >
                            <FiUserPlus className="mr-1" />
                            Add Subscriber
                        </button>

                        <button className="p-2.5 bg-dark-border hover:bg-dark-border/80 rounded text-light font-medium transition-colors flex items-center">
                            <FiUpload className="mr-1" />
                            Import
                        </button>

                        <button className="p-2.5 bg-dark-border hover:bg-dark-border/80 rounded text-light font-medium transition-colors flex items-center">
                            <FiDownload className="mr-1" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Add subscriber form */}
                {showAddForm && (
                    <div className="bg-dark-lighter border border-dark-border rounded-lg p-4 mb-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-light mb-4">Add New Subscriber</h3>
                        <form onSubmit={handleAddSubscriber} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-light-muted mb-1">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={newSubscriber.email}
                                    onChange={(e) => setNewSubscriber({ ...newSubscriber, email: e.target.value })}
                                    className="w-full p-2.5 rounded bg-dark border border-dark-border text-light focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-light-muted mb-1">Name (Optional)</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={newSubscriber.name}
                                    onChange={(e) => setNewSubscriber({ ...newSubscriber, name: e.target.value })}
                                    className="w-full p-2.5 rounded bg-dark border border-dark-border text-light focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-4 py-2 bg-dark-border hover:bg-dark-border/80 rounded text-light transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary hover:bg-primary/80 rounded text-dark font-medium transition-colors"
                                >
                                    Add Subscriber
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Subscribers table */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-900/20 border border-red-900/30 text-red-500 p-4 rounded-lg">
                        {error}
                    </div>
                ) : (
                    <div className="bg-dark-lighter border border-dark-border rounded-lg overflow-hidden shadow-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-dark-border">
                                <thead className="bg-dark">
                                    <tr>
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
                                            Join Date
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-muted uppercase tracking-wider">
                                            Last Newsletter
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-light-muted uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dark-border">
                                    {filteredSubscribers.length > 0 ? (
                                        filteredSubscribers.map((subscriber) => (
                                            <tr key={subscriber.id} className="hover:bg-dark-card transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-light">
                                                    {subscriber.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-light">
                                                    {subscriber.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${subscriber.status === 'active'
                                                            ? 'bg-green-900/20 text-green-500'
                                                            : 'bg-red-900/20 text-red-500'
                                                        }`}>
                                                        {subscriber.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-light-muted">
                                                    {subscriber.joinDate}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-light-muted">
                                                    {subscriber.lastNewsletter}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleStatusToggle(subscriber.id)}
                                                            className={`p-1.5 rounded ${subscriber.status === 'active'
                                                                    ? 'text-green-500 hover:bg-green-900/20'
                                                                    : 'text-red-500 hover:bg-red-900/20'
                                                                }`}
                                                            title={subscriber.status === 'active' ? 'Deactivate' : 'Activate'}
                                                        >
                                                            {subscriber.status === 'active' ? <FiUserMinus /> : <FiUserPlus />}
                                                        </button>
                                                        <button
                                                            className="p-1.5 text-blue-500 hover:bg-blue-900/20 rounded"
                                                            title="Edit"
                                                        >
                                                            <FiEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteSubscriber(subscriber.id)}
                                                            className="p-1.5 text-red-500 hover:bg-red-900/20 rounded"
                                                            title="Delete"
                                                        >
                                                            <FiTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-light">
                                                No subscribers found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
} 