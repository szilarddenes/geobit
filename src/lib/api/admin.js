/**
 * Admin API functions
 */

/**
 * Generate a newsletter on demand
 * 
 * @returns {Promise<Object>} - Result of the newsletter generation
 */
export async function generateNewsletterOnDemand() {
    // In development mode, we'll simulate a successful response
    if (process.env.NODE_ENV === 'development') {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Newsletter generated successfully! It has been sent to 145 subscribers.'
                });
            }, 2000);
        });
    }

    // In production, we would call the Firebase function
    try {
        const response = await fetch('/api/admin/generate-newsletter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('geobit_admin_token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to generate newsletter');
        }

        return await response.json();
    } catch (error) {
        console.error('Error generating newsletter:', error);
        throw error;
    }
} 