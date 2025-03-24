import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { FiSave, FiRefreshCw, FiSliders, FiMail, FiServer, FiLock, FiGlobe, FiCalendar, FiGrid } from 'react-icons/fi';
import AdminLayout from '../../../components/admin/AdminLayout';
import withAdminAuth from '@/components/admin/withAdminAuth';

function SettingsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState({
        newsletter: {
            defaultDeliveryDay: 'wednesday',
            defaultDeliveryTime: '09:00',
            defaultTimezone: 'UTC',
            maxItemsPerDigest: 10,
            maxIndustryItems: 2,
            emailFormat: 'html',
            colorScheme: 'earth',
            includeEvents: true,
            maxCategoriesPerItem: 3
        },
        api: {
            refreshInterval: 15,
            maxResultsPerQuery: 50,
            enableCaching: true,
            cacheExpiration: 60,
            logLevel: 'info'
        },
        system: {
            autoBackup: true,
            backupFrequency: 'daily',
            retentionDays: 30,
            imageCompression: true,
            imageMaxWidth: 800
        }
    });

    // Simulate loading settings from API
    useEffect(() => {
        const loadSettings = async () => {
            try {
                // In a real app, you'd fetch settings from an API
                // For now, we'll just simulate a delay
                await new Promise(resolve => setTimeout(resolve, 800));
                setIsLoading(false);
            } catch (error) {
                console.error('Error loading settings:', error);
                toast.error('Failed to load settings');
                setIsLoading(false);
            }
        };

        loadSettings();
    }, []);

    const handleSettingChange = (section, key, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    };

    const handleSaveSettings = async () => {
        setIsSaving(true);
        try {
            // In a real app, you'd save settings to an API
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Settings saved successfully');
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
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

    return (
        <AdminLayout>
            <div className="space-y-6 overflow-y-auto pb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-light">System Settings</h1>

                    <button
                        onClick={handleSaveSettings}
                        disabled={isSaving}
                        className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-dark font-medium py-2 px-4 rounded-md transition-colors"
                    >
                        {isSaving ? (
                            <>
                                <FiRefreshCw className="animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <FiSave />
                                <span>Save Settings</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Newsletter Settings */}
                <div className="bg-dark-lighter border border-dark-border rounded-lg p-6 shadow-lg">
                    <div className="flex items-center mb-4">
                        <FiMail className="text-primary text-xl mr-2" />
                        <h2 className="text-xl font-bold text-light">Newsletter Configuration</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-light-muted mb-2">Default Delivery Day</label>
                                <select
                                    value={settings.newsletter.defaultDeliveryDay}
                                    onChange={(e) => handleSettingChange('newsletter', 'defaultDeliveryDay', e.target.value)}
                                    className="bg-dark border border-dark-border text-light rounded-md w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="monday">Monday</option>
                                    <option value="tuesday">Tuesday</option>
                                    <option value="wednesday">Wednesday</option>
                                    <option value="thursday">Thursday</option>
                                    <option value="friday">Friday</option>
                                    <option value="saturday">Saturday</option>
                                    <option value="sunday">Sunday</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-light-muted mb-2">Default Delivery Time</label>
                                <input
                                    type="time"
                                    value={settings.newsletter.defaultDeliveryTime}
                                    onChange={(e) => handleSettingChange('newsletter', 'defaultDeliveryTime', e.target.value)}
                                    className="bg-dark border border-dark-border text-light rounded-md w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-light-muted mb-2">Default Timezone</label>
                                <select
                                    value={settings.newsletter.defaultTimezone}
                                    onChange={(e) => handleSettingChange('newsletter', 'defaultTimezone', e.target.value)}
                                    className="bg-dark border border-dark-border text-light rounded-md w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="UTC">UTC</option>
                                    <option value="EST">Eastern Time (EST)</option>
                                    <option value="CST">Central Time (CST)</option>
                                    <option value="MST">Mountain Time (MST)</option>
                                    <option value="PST">Pacific Time (PST)</option>
                                    <option value="GMT">Greenwich Mean Time (GMT)</option>
                                    <option value="CET">Central European Time (CET)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-light-muted mb-2">Email Format</label>
                                <div className="flex space-x-4">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            checked={settings.newsletter.emailFormat === 'html'}
                                            onChange={() => handleSettingChange('newsletter', 'emailFormat', 'html')}
                                            className="h-4 w-4 text-primary bg-dark border-dark-border focus:ring-0"
                                        />
                                        <span className="ml-2 text-light">HTML</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            checked={settings.newsletter.emailFormat === 'text'}
                                            onChange={() => handleSettingChange('newsletter', 'emailFormat', 'text')}
                                            className="h-4 w-4 text-primary bg-dark border-dark-border focus:ring-0"
                                        />
                                        <span className="ml-2 text-light">Plain Text</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            checked={settings.newsletter.emailFormat === 'both'}
                                            onChange={() => handleSettingChange('newsletter', 'emailFormat', 'both')}
                                            className="h-4 w-4 text-primary bg-dark border-dark-border focus:ring-0"
                                        />
                                        <span className="ml-2 text-light">Both</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-light-muted mb-2">Items Per Digest</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={settings.newsletter.maxItemsPerDigest}
                                    onChange={(e) => handleSettingChange('newsletter', 'maxItemsPerDigest', parseInt(e.target.value))}
                                    className="bg-dark border border-dark-border text-light rounded-md w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <p className="text-xs text-light-muted mt-1">Maximum number of items to include in each digest (GeoBit standard: 10)</p>
                            </div>

                            <div>
                                <label className="block text-light-muted mb-2">Max Industry Items</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="5"
                                    value={settings.newsletter.maxIndustryItems}
                                    onChange={(e) => handleSettingChange('newsletter', 'maxIndustryItems', parseInt(e.target.value))}
                                    className="bg-dark border border-dark-border text-light rounded-md w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <p className="text-xs text-light-muted mt-1">Maximum number of industry items per digest (GeoBit standard: 2)</p>
                            </div>

                            <div>
                                <label className="block text-light-muted mb-2">Max Categories Per Item</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={settings.newsletter.maxCategoriesPerItem}
                                    onChange={(e) => handleSettingChange('newsletter', 'maxCategoriesPerItem', parseInt(e.target.value))}
                                    className="bg-dark border border-dark-border text-light rounded-md w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <p className="text-xs text-light-muted mt-1">Maximum number of categories per content item (GeoBit standard: 3)</p>
                            </div>

                            <div>
                                <label className="flex items-center text-light cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.newsletter.includeEvents}
                                        onChange={(e) => handleSettingChange('newsletter', 'includeEvents', e.target.checked)}
                                        className="h-4 w-4 text-primary bg-dark border-dark-border rounded focus:ring-0"
                                    />
                                    <span className="ml-2">Always include upcoming events section</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* API Settings */}
                <div className="bg-dark-lighter border border-dark-border rounded-lg p-6 shadow-lg">
                    <div className="flex items-center mb-4">
                        <FiServer className="text-primary text-xl mr-2" />
                        <h2 className="text-xl font-bold text-light">API Settings</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-light-muted mb-2">API Refresh Interval (minutes)</label>
                                <input
                                    type="number"
                                    min="5"
                                    max="60"
                                    value={settings.api.refreshInterval}
                                    onChange={(e) => handleSettingChange('api', 'refreshInterval', parseInt(e.target.value))}
                                    className="bg-dark border border-dark-border text-light rounded-md w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-light-muted mb-2">Maximum Results Per Query</label>
                                <input
                                    type="number"
                                    min="10"
                                    max="100"
                                    value={settings.api.maxResultsPerQuery}
                                    onChange={(e) => handleSettingChange('api', 'maxResultsPerQuery', parseInt(e.target.value))}
                                    className="bg-dark border border-dark-border text-light rounded-md w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center text-light cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.api.enableCaching}
                                        onChange={(e) => handleSettingChange('api', 'enableCaching', e.target.checked)}
                                        className="h-4 w-4 text-primary bg-dark border-dark-border rounded focus:ring-0"
                                    />
                                    <span className="ml-2">Enable API response caching</span>
                                </label>
                            </div>

                            <div>
                                <label className="block text-light-muted mb-2">Cache Expiration (minutes)</label>
                                <input
                                    type="number"
                                    min="5"
                                    max="1440"
                                    value={settings.api.cacheExpiration}
                                    onChange={(e) => handleSettingChange('api', 'cacheExpiration', parseInt(e.target.value))}
                                    disabled={!settings.api.enableCaching}
                                    className={`bg-dark border border-dark-border text-light rounded-md w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-primary ${!settings.api.enableCaching ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                            </div>

                            <div>
                                <label className="block text-light-muted mb-2">Log Level</label>
                                <select
                                    value={settings.api.logLevel}
                                    onChange={(e) => handleSettingChange('api', 'logLevel', e.target.value)}
                                    className="bg-dark border border-dark-border text-light rounded-md w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="error">Error</option>
                                    <option value="warn">Warning</option>
                                    <option value="info">Info</option>
                                    <option value="debug">Debug</option>
                                    <option value="verbose">Verbose</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Settings */}
                <div className="bg-dark-lighter border border-dark-border rounded-lg p-6 shadow-lg">
                    <div className="flex items-center mb-4">
                        <FiSliders className="text-primary text-xl mr-2" />
                        <h2 className="text-xl font-bold text-light">System Preferences</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center text-light cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.system.autoBackup}
                                        onChange={(e) => handleSettingChange('system', 'autoBackup', e.target.checked)}
                                        className="h-4 w-4 text-primary bg-dark border-dark-border rounded focus:ring-0"
                                    />
                                    <span className="ml-2">Enable automatic backups</span>
                                </label>
                            </div>

                            <div>
                                <label className="block text-light-muted mb-2">Backup Frequency</label>
                                <select
                                    value={settings.system.backupFrequency}
                                    onChange={(e) => handleSettingChange('system', 'backupFrequency', e.target.value)}
                                    disabled={!settings.system.autoBackup}
                                    className={`bg-dark border border-dark-border text-light rounded-md w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-primary ${!settings.system.autoBackup ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-light-muted mb-2">Retention Period (days)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="365"
                                    value={settings.system.retentionDays}
                                    onChange={(e) => handleSettingChange('system', 'retentionDays', parseInt(e.target.value))}
                                    disabled={!settings.system.autoBackup}
                                    className={`bg-dark border border-dark-border text-light rounded-md w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-primary ${!settings.system.autoBackup ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center text-light cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.system.imageCompression}
                                        onChange={(e) => handleSettingChange('system', 'imageCompression', e.target.checked)}
                                        className="h-4 w-4 text-primary bg-dark border-dark-border rounded focus:ring-0"
                                    />
                                    <span className="ml-2">Enable image compression</span>
                                </label>
                            </div>

                            <div>
                                <label className="block text-light-muted mb-2">Maximum Image Width (pixels)</label>
                                <input
                                    type="number"
                                    min="300"
                                    max="2000"
                                    step="100"
                                    value={settings.system.imageMaxWidth}
                                    onChange={(e) => handleSettingChange('system', 'imageMaxWidth', parseInt(e.target.value))}
                                    disabled={!settings.system.imageCompression}
                                    className={`bg-dark border border-dark-border text-light rounded-md w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-primary ${!settings.system.imageCompression ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                                <p className="text-xs text-light-muted mt-1">GeoBit guidelines limit newsletter images to 1 per digest</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSaveSettings}
                        disabled={isSaving}
                        className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-dark font-medium py-2 px-6 rounded-md transition-colors"
                    >
                        {isSaving ? (
                            <>
                                <FiRefreshCw className="animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <FiSave />
                                <span>Save All Settings</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
}

export default withAdminAuth(SettingsPage); 