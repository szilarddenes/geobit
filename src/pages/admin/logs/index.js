import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { toast } from 'react-toastify';
import {
  FiRefreshCw,
  FiFilter,
  FiSearch,
  FiDownload,
  FiAlertCircle,
  FiInfo,
  FiXCircle,
  FiCheckCircle
} from 'react-icons/fi';
import AdminLayout from '@/components/admin/AdminLayout';
import { verifyAdminTokenLocally } from '@/lib/firebase';
import withAdminAuth from '@/components/admin/withAdminAuth';

export default withAdminAuth(function SystemLogsPage() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('1d'); // 1h, 6h, 1d, 7d, 30d
  const router = useRouter();

  useEffect(() => {
    const adminToken = localStorage.getItem('geobit_admin_token');
    if (!adminToken) {
      router.push('/admin');
      return;
    }

    fetchLogs();
  }, [router, timeRange]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const adminToken = localStorage.getItem('geobit_admin_token');

      // In a real implementation, you would call your Firebase function here
      // const response = await getLogs({ token: adminToken, timeRange });

      // Development implementation with sample log data
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call

      if (verifyAdminTokenLocally(adminToken)) {
        // Generate sample logs based on time range
        const mockLogs = generateMockLogs(timeRange);
        setLogs(mockLogs);
        toast.info('Using development mode with sample log data');
      } else {
        toast.error('Unauthorized access');
        router.push('/admin');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('Failed to fetch system logs');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockLogs = (range) => {
    // Generate appropriate number of logs based on time range
    const count = range === '1h' ? 20 :
      range === '6h' ? 50 :
        range === '1d' ? 100 :
          range === '7d' ? 200 : 300;

    const now = new Date();
    const logs = [];

    // Determine the start time based on range
    const getStartTime = () => {
      switch (range) {
        case '1h': return new Date(now.getTime() - 60 * 60 * 1000);
        case '6h': return new Date(now.getTime() - 6 * 60 * 60 * 1000);
        case '1d': return new Date(now.getTime() - 24 * 60 * 60 * 1000);
        case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        default: return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }
    };

    const startTime = getStartTime();
    const timeSpan = now.getTime() - startTime.getTime();

    const services = ['api', 'firebase', 'email', 'scraper', 'scheduler'];
    const levels = ['info', 'warning', 'error'];
    const messageTemplates = {
      info: [
        'API request completed successfully',
        'Newsletter generation started',
        'Newsletter published successfully',
        'User subscription confirmed',
        'Content collection completed',
        'Scheduled task executed',
        'API quota usage updated',
        'Firebase read operation executed',
        'Authentication successful'
      ],
      warning: [
        'API rate limit approaching threshold',
        'Slow API response detected',
        'Newsletter generation taking longer than expected',
        'Email delivery delayed',
        'Content source unreachable, skipping',
        'Firebase quota usage high',
        'API response partially successful',
        'Scheduled task delayed'
      ],
      error: [
        'API request failed',
        'Newsletter generation failed',
        'Email delivery failed',
        'Authentication error',
        'Database operation failed',
        'Content source returned error',
        'API quota exceeded',
        'Scheduled task failed',
        'Invalid content format detected'
      ]
    };

    // Generate random logs
    for (let i = 0; i < count; i++) {
      const level = levels[Math.floor(Math.random() * 10) > 8 ? 2 : // 10% errors
        Math.floor(Math.random() * 10) > 7 ? 1 : 0]; // 20% warnings, 70% info
      const service = services[Math.floor(Math.random() * services.length)];
      const randomTime = new Date(startTime.getTime() + Math.random() * timeSpan);

      const messages = messageTemplates[level];
      const message = messages[Math.floor(Math.random() * messages.length)];

      // Generate a more detailed random reason for errors and warnings
      let details = '';
      if (level === 'error') {
        const errorReasons = [
          'Connection timeout',
          'Invalid authentication token',
          'Service unavailable',
          'Rate limit exceeded',
          'Internal server error',
          'Bad request format'
        ];
        details = errorReasons[Math.floor(Math.random() * errorReasons.length)];
      } else if (level === 'warning') {
        const warningReasons = [
          'Response time > 2000ms',
          'Quota usage at 85%',
          'Retry attempt #2',
          'Partial data returned',
          'Rate limiting applied'
        ];
        details = warningReasons[Math.floor(Math.random() * warningReasons.length)];
      }

      logs.push({
        id: `log-${i}`,
        timestamp: randomTime.toISOString(),
        level,
        service,
        message,
        details
      });
    }

    // Sort logs by timestamp (newest first)
    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const handleExportLogs = () => {
    const filteredData = getFilteredLogs();

    // Convert logs to CSV
    const headers = ['Timestamp', 'Level', 'Service', 'Message', 'Details'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(log => [
        new Date(log.timestamp).toLocaleString(),
        log.level,
        log.service,
        `"${log.message.replace(/"/g, '""')}"`,
        `"${(log.details || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `geobit-logs-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFilteredLogs = () => {
    return logs.filter(log => {
      // Filter by level
      if (levelFilter !== 'all' && log.level !== levelFilter) {
        return false;
      }

      // Filter by service
      if (serviceFilter !== 'all' && log.service !== serviceFilter) {
        return false;
      }

      // Filter by search term (in message or details)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const messageMatch = log.message.toLowerCase().includes(searchLower);
        const detailsMatch = log.details && log.details.toLowerCase().includes(searchLower);

        if (!messageMatch && !detailsMatch) {
          return false;
        }
      }

      return true;
    });
  };

  const getLogIcon = (level) => {
    switch (level) {
      case 'error':
        return <FiXCircle className="text-red-500" />;
      case 'warning':
        return <FiAlertCircle className="text-amber-500" />;
      case 'info':
        return <FiInfo className="text-blue-500" />;
      default:
        return <FiCheckCircle className="text-gray-500" />;
    }
  };

  const filteredLogs = getFilteredLogs();

  return (
    <AdminLayout>
      <Head>
        <title>System Logs - GeoBit Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">System Logs</h1>
        <div className="flex space-x-3">
          <button
            onClick={fetchLogs}
            disabled={isLoading}
            className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 px-4 rounded-md transition"
          >
            <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>

          <button
            onClick={handleExportLogs}
            disabled={isLoading || filteredLogs.length === 0}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition disabled:opacity-50"
          >
            <FiDownload />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search in logs..."
                className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center">
              <FiFilter className="text-gray-400 mr-2" />
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="info">Info</option>
                <option value="warning">Warnings</option>
                <option value="error">Errors</option>
              </select>
            </div>

            <div className="flex items-center">
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Services</option>
                <option value="api">API</option>
                <option value="firebase">Firebase</option>
                <option value="email">Email</option>
                <option value="scraper">Scraper</option>
                <option value="scheduler">Scheduler</option>
              </select>
            </div>

            <div className="flex items-center">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1h">Last Hour</option>
                <option value="6h">Last 6 Hours</option>
                <option value="1d">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Logs list */}
      <div className="bg-white rounded-lg shadow-md">
        {isLoading ? (
          <div className="p-6 text-center">
            <FiRefreshCw className="inline-block animate-spin text-blue-600 mb-3" size={24} />
            <p className="text-gray-600">Loading system logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-6 text-center">
            <FiInfo className="inline-block text-gray-400 mb-3" size={24} />
            <p className="text-gray-600">No logs found with the current filters.</p>
            {searchTerm || levelFilter !== 'all' || serviceFilter !== 'all' ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setLevelFilter('all');
                  setServiceFilter('all');
                }}
                className="mt-3 text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        ) : (
          <>
            <div className="p-4 border-b bg-gray-50">
              <div className="text-sm text-gray-500">
                Showing {filteredLogs.length} of {logs.length} logs
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className={`hover:bg-gray-50 ${log.level === 'error' ? 'bg-red-50' :
                        log.level === 'warning' ? 'bg-amber-50' : ''
                      }`}>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                        <div className="text-xs text-gray-400">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getLogIcon(log.level)}
                          <span className={`ml-2 capitalize ${log.level === 'error' ? 'text-red-700' :
                              log.level === 'warning' ? 'text-amber-700' :
                                'text-blue-700'
                            }`}>
                            {log.level}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {log.service}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {log.message}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {log.details || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination would go here */}
            <div className="px-4 py-3 bg-gray-50 border-t text-right">
              <div className="text-sm text-gray-500">
                Showing most recent logs for the selected time period.
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
});