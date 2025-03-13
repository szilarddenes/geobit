import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { toast } from 'react-toastify';
import { 
  FiRefreshCw, 
  FiUsers, 
  FiMail, 
  FiTrendingUp, 
  FiBarChart2, 
  FiPieChart, 
  FiDownload,
  FiCalendar
} from 'react-icons/fi';
import AdminLayout from '@/components/admin/AdminLayout';
import { verifyAdminTokenLocally } from '@/lib/firebase';

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d, 1y
  const router = useRouter();

  useEffect(() => {
    const adminToken = localStorage.getItem('geobit_admin_token');
    if (!adminToken) {
      router.push('/admin');
      return;
    }

    fetchAnalytics();
  }, [router, timeRange]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const adminToken = localStorage.getItem('geobit_admin_token');
      
      // In a real implementation, you would call your Firebase function here
      // const response = await getAnalytics({ token: adminToken, timeRange });
      
      // Development implementation with sample analytics data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      if (verifyAdminTokenLocally(adminToken)) {
        // Generate sample analytics data
        const mockData = generateMockAnalytics(timeRange);
        setDashboardData(mockData);
      } else {
        toast.error('Unauthorized access');
        router.push('/admin');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to fetch analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockAnalytics = (range) => {
    // Generate appropriate date range for labels
    const now = new Date();
    const labels = [];
    const subscriberData = [];
    const openRateData = [];
    const clickRateData = [];
    
    let days;
    let step;
    
    switch (range) {
      case '7d':
        days = 7;
        step = 1;
        break;
      case '30d':
        days = 30;
        step = 1;
        break;
      case '90d':
        days = 90;
        step = 7;
        break;
      case '1y':
        days = 365;
        step = 30;
        break;
      default:
        days = 30;
        step = 1;
    }
    
    // Generate sample trend data
    let subscribers = 200 + Math.floor(Math.random() * 100);
    const baseOpenRate = 30 + Math.floor(Math.random() * 10);
    const baseClickRate = 5 + Math.floor(Math.random() * 5);
    
    for (let i = days; i >= 0; i -= step) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      if (step === 1) {
        // Daily format
        labels.push(date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
      } else if (step === 7) {
        // Weekly format
        labels.push(`Week ${Math.ceil((days - i) / 7)}`);
      } else {
        // Monthly format
        labels.push(date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' }));
      }
      
      // Simulate subscriber growth
      const growth = Math.random() * 10 - 2; // -2 to 8 new subscribers per period
      subscribers += Math.max(0, Math.floor(growth));
      subscriberData.push(subscribers);
      
      // Simulate fluctuating open and click rates
      const openRateVar = (Math.random() * 10) - 5; // -5 to 5% variation
      const clickRateVar = (Math.random() * 4) - 2; // -2 to 2% variation
      
      openRateData.push(Math.max(15, Math.min(70, baseOpenRate + openRateVar)));
      clickRateData.push(Math.max(1, Math.min(20, baseClickRate + clickRateVar)));
    }
    
    // Content preferences
    const contentPreferences = [
      { category: 'Research Papers', percentage: 35 + Math.floor(Math.random() * 10) },
      { category: 'Industry News', percentage: 25 + Math.floor(Math.random() * 10) },
      { category: 'Technological Advancements', percentage: 20 + Math.floor(Math.random() * 5) },
      { category: 'Field Studies', percentage: 15 + Math.floor(Math.random() * 5) },
      { category: 'Other', percentage: 5 + Math.floor(Math.random() * 3) }
    ];
    
    // Normalize to 100%
    const total = contentPreferences.reduce((sum, item) => sum + item.percentage, 0);
    contentPreferences.forEach(item => {
      item.percentage = Math.round((item.percentage / total) * 100);
    });
    
    // Most engaged content
    const popularContent = [
      { 
        title: 'Recent Advancements in Seismic Monitoring', 
        openRate: 65 + Math.floor(Math.random() * 10),
        clickRate: 32 + Math.floor(Math.random() * 10)
      },
      { 
        title: 'New Research on Climate Impact on Geological Formations', 
        openRate: 58 + Math.floor(Math.random() * 10),
        clickRate: 27 + Math.floor(Math.random() * 10)
      },
      { 
        title: 'Breakthrough in Mineral Extraction Technologies', 
        openRate: 52 + Math.floor(Math.random() * 10),
        clickRate: 24 + Math.floor(Math.random() * 10)
      },
      { 
        title: 'Understanding Deep Ocean Geological Processes', 
        openRate: 49 + Math.floor(Math.random() * 10),
        clickRate: 20 + Math.floor(Math.random() * 10)
      }
    ];
    
    // Summary metrics
    const currentSubscribers = subscribers;
    const avgOpenRate = openRateData.reduce((sum, val) => sum + val, 0) / openRateData.length;
    const avgClickRate = clickRateData.reduce((sum, val) => sum + val, 0) / clickRateData.length;
    
    const growth = {};
    if (range === '7d') {
      growth.subscribers = Math.floor((subscriberData[subscriberData.length - 1] - subscriberData[0]) / subscriberData[0] * 100);
      growth.openRate = ((openRateData[openRateData.length - 1] - openRateData[0]) / openRateData[0] * 100).toFixed(1);
      growth.clickRate = ((clickRateData[clickRateData.length - 1] - clickRateData[0]) / clickRateData[0] * 100).toFixed(1);
    } else {
      const halfwayIndex = Math.floor(subscriberData.length / 2);
      const firstHalf = subscriberData.slice(0, halfwayIndex);
      const secondHalf = subscriberData.slice(halfwayIndex);
      
      const firstHalfAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
      
      growth.subscribers = Math.floor((secondHalfAvg - firstHalfAvg) / firstHalfAvg * 100);
      
      const firstHalfOpenAvg = openRateData.slice(0, halfwayIndex).reduce((sum, val) => sum + val, 0) / firstHalf.length;
      const secondHalfOpenAvg = openRateData.slice(halfwayIndex).reduce((sum, val) => sum + val, 0) / secondHalf.length;
      growth.openRate = ((secondHalfOpenAvg - firstHalfOpenAvg) / firstHalfOpenAvg * 100).toFixed(1);
      
      const firstHalfClickAvg = clickRateData.slice(0, halfwayIndex).reduce((sum, val) => sum + val, 0) / firstHalf.length;
      const secondHalfClickAvg = clickRateData.slice(halfwayIndex).reduce((sum, val) => sum + val, 0) / secondHalf.length;
      growth.clickRate = ((secondHalfClickAvg - firstHalfClickAvg) / firstHalfClickAvg * 100).toFixed(1);
    }
    
    return {
      summary: {
        currentSubscribers,
        avgOpenRate,
        avgClickRate,
        growth
      },
      charts: {
        labels,
        subscriberData,
        openRateData,
        clickRateData
      },
      contentPreferences,
      popularContent
    };
  };

  const handleExportAnalytics = () => {
    if (!dashboardData) return;
    
    // Convert analytics summary to CSV
    const headers = [
      'Metric', 'Value', 'Growth'
    ];
    
    const summary = dashboardData.summary;
    const csvContent = [
      headers.join(','),
      ['Subscribers', summary.currentSubscribers, `${summary.growth.subscribers}%`].join(','),
      ['Avg. Open Rate', `${summary.avgOpenRate.toFixed(1)}%`, `${summary.growth.openRate}%`].join(','),
      ['Avg. Click Rate', `${summary.avgClickRate.toFixed(1)}%`, `${summary.growth.clickRate}%`].join(','),
      [],
      ['Content Preferences', '', ''],
      ['Category', 'Percentage', ''],
      ...dashboardData.contentPreferences.map(item => [
        item.category, `${item.percentage}%`, ''
      ].join(','))
    ].join('\n');
    
    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `geobit-analytics-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <Head>
        <title>Analytics - GeoBit Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
        <div className="flex space-x-3">
          <div className="flex items-center">
            <FiCalendar className="text-gray-400 mr-2" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
          
          <button
            onClick={fetchAnalytics}
            disabled={isLoading}
            className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 px-4 rounded-md transition"
          >
            <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
          
          <button
            onClick={handleExportAnalytics}
            disabled={isLoading || !dashboardData}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition disabled:opacity-50"
          >
            <FiDownload />
            Export
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FiRefreshCw className="inline-block animate-spin text-blue-600 mb-3" size={24} />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      ) : dashboardData ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FiUsers className="text-blue-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900">Subscribers</h3>
                    <p className="text-gray-500 text-sm">Total subscribers</p>
                  </div>
                </div>
                <div className={`flex items-center ${dashboardData.summary.growth.subscribers >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <FiTrendingUp className="mr-1" />
                  <span>{dashboardData.summary.growth.subscribers}%</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData.summary.currentSubscribers.toLocaleString()}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <FiMail className="text-green-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900">Open Rate</h3>
                    <p className="text-gray-500 text-sm">Average open rate</p>
                  </div>
                </div>
                <div className={`flex items-center ${dashboardData.summary.growth.openRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <FiTrendingUp className="mr-1" />
                  <span>{dashboardData.summary.growth.openRate}%</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData.summary.avgOpenRate.toFixed(1)}%
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <FiBarChart2 className="text-purple-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900">Click Rate</h3>
                    <p className="text-gray-500 text-sm">Average click rate</p>
                  </div>
                </div>
                <div className={`flex items-center ${dashboardData.summary.growth.clickRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <FiTrendingUp className="mr-1" />
                  <span>{dashboardData.summary.growth.clickRate}%</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData.summary.avgClickRate.toFixed(1)}%
              </p>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                <FiTrendingUp className="mr-2" /> Subscriber Growth
              </h2>
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">
                  Charts would be implemented using a library like recharts or Chart.js
                </p>
                {/* In a real implementation, you would render a line chart here */}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                <FiBarChart2 className="mr-2" /> Engagement Metrics
              </h2>
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">
                  Charts would be implemented using a library like recharts or Chart.js
                </p>
                {/* In a real implementation, you would render a bar chart here */}
              </div>
            </div>
          </div>
          
          {/* Content Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                <FiPieChart className="mr-2" /> Content Preferences
              </h2>
              
              <div>
                {dashboardData.contentPreferences.map((item, index) => (
                  <div key={index} className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-gray-700">{item.category}</span>
                      <span className="text-gray-500">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                <FiBarChart2 className="mr-2" /> Top Performing Content
              </h2>
              
              <div className="space-y-4">
                {dashboardData.popularContent.map((item, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">{item.title}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Open Rate</p>
                        <div className="flex items-center">
                          <span className="text-lg font-bold mr-2">{item.openRate}%</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${item.openRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Click Rate</p>
                        <div className="flex items-center">
                          <span className="text-lg font-bold mr-2">{item.clickRate}%</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${item.clickRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Development Mode Notice */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-700 text-sm">
              <strong>Development Mode:</strong> In production, the charts would be implemented using libraries like recharts, Chart.js or D3.js. The data would be fetched from Firebase and actual analytics services.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
          Failed to load analytics data.
        </div>
      )}
    </AdminLayout>
  );
}