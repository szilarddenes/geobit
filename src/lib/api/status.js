/**
 * API status functions
 */

/**
 * Get the status of the API
 * 
 * @returns {Promise<Object>} - API status information
 */
export async function getApiStatus() {
    // In development mode, we'll simulate a successful response
    if (process.env.NODE_ENV === 'development') {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    status: 'ok',
                    services: {
                        firebase: 'ok',
                        newsletter: 'ok',
                        content: 'ok'
                    },
                    stats: {
                        subscribers: 145,
                        newsletters: 12,
                        articles: 37,
                        openRate: 68.5
                    }
                });
            }, 500);
        });
    }

    // In production, we would call the API
    try {
        const response = await fetch('/api/admin/status', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('geobit_admin_token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get API status');
        }

        return await response.json();
    } catch (error) {
        console.error('Error getting API status:', error);
        throw error;
    }
} 