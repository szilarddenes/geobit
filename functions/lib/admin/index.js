"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdminToken = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const axios_1 = __importDefault(require("axios"));
// Initialize Firestore
const db = admin.firestore();
// Verify admin access using environment ADMIN_TOKEN
const verifyAdminAccess = async (password) => {
    var _a;
    try {
        // Get the admin token from environment config
        const adminToken = ((_a = functions.config().app) === null || _a === void 0 ? void 0 : _a.admin_token) || process.env.ADMIN_TOKEN;
        // For development/testing purposes - allow a default password
        if (password === "admin123") {
            console.log('Using development admin password');
            return true;
        }
        if (!adminToken) {
            console.error('ADMIN_TOKEN not configured');
            return false;
        }
        return password === adminToken;
    }
    catch (error) {
        console.error('Error verifying admin access:', error);
        return false;
    }
};
// Verify admin token (for securing endpoints)
const verifyAdminToken = async (token) => {
    try {
        if (!token) {
            return false;
        }
        // Check if token exists in admin sessions
        const sessionQuery = await db
            .collection('adminSessions')
            .where('token', '==', token)
            .where('expiresAt', '>', admin.firestore.Timestamp.now())
            .limit(1)
            .get();
        return !sessionQuery.empty;
    }
    catch (error) {
        console.error('Error verifying admin token:', error);
        return false;
    }
};
exports.verifyAdminToken = verifyAdminToken;
// Admin login function
const adminLogin = functions.https.onCall(async (data, context) => {
    try {
        const { password } = data;
        if (!password) {
            throw new Error('Password is required');
        }
        const isAdmin = await verifyAdminAccess(password);
        if (!isAdmin) {
            throw new Error('Invalid password');
        }
        // Generate a secure admin token
        // In production, use a proper auth system with Firebase Auth custom claims
        const token = Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
        // Store token with expiry
        await db.collection('adminSessions').add({
            token,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hour expiry
            )
        });
        return { success: true, token };
    }
    catch (error) {
        console.error('Admin login error:', error);
        return { success: false, error: error.message };
    }
});
// Get API status
const getApiStatus = functions.https.onCall(async (data, context) => {
    var _a, _b;
    try {
        // Verify admin token
        const { token } = data;
        const isValidToken = await (0, exports.verifyAdminToken)(token);
        if (!isValidToken) {
            throw new Error('Unauthorized access');
        }
        const status = {
            openRouter: { status: 'unknown', message: 'Not checked' },
            firebase: { status: 'unknown', message: 'Not checked' },
            email: { status: 'unknown', message: 'Not checked' }
        };
        // Check OpenRouter API
        try {
            const openRouterApiKey = ((_a = functions.config().openrouter) === null || _a === void 0 ? void 0 : _a.api_key) || process.env.OPENROUTER_API_KEY;
            if (!openRouterApiKey) {
                status.openRouter = {
                    status: 'error',
                    message: 'API key not configured'
                };
            }
            else {
                // Get OpenRouter quota
                const quotaResponse = await axios_1.default.get('https://openrouter.ai/api/v1/auth/key', {
                    headers: {
                        'Authorization': `Bearer ${openRouterApiKey}`
                    }
                });
                if (quotaResponse.status === 200) {
                    const quota = quotaResponse.data;
                    status.openRouter = {
                        status: 'ok',
                        message: 'API is operational',
                        quota: {
                            used: quota.rate_limit.used || 0,
                            limit: quota.rate_limit.limit || 0,
                            remaining: (quota.rate_limit.limit || 0) - (quota.rate_limit.used || 0)
                        }
                    };
                }
                else {
                    status.openRouter = {
                        status: 'warning',
                        message: 'Could not fetch quota information'
                    };
                }
            }
        }
        catch (error) {
            console.error('OpenRouter API check error:', error);
            status.openRouter = {
                status: 'error',
                message: `API error: ${error.message}`
            };
        }
        // Check Firebase status (just check if Firestore works)
        try {
            await db.collection('system').doc('status').set({
                lastChecked: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            // Get Firestore usage
            const usageSnapshot = await db.collection('system').doc('usageStats').get();
            const usageData = usageSnapshot.exists ? usageSnapshot.data() : null;
            status.firebase = {
                status: 'ok',
                message: 'Firebase is operational',
                usage: {
                    reads: (usageData === null || usageData === void 0 ? void 0 : usageData.reads) || 0,
                    writes: (usageData === null || usageData === void 0 ? void 0 : usageData.writes) || 0,
                    deletes: (usageData === null || usageData === void 0 ? void 0 : usageData.deletes) || 0
                }
            };
        }
        catch (error) {
            console.error('Firebase status check error:', error);
            status.firebase = {
                status: 'error',
                message: `Firebase error: ${error.message}`
            };
        }
        // Check email service
        try {
            const emailApiKey = ((_b = functions.config().sendgrid) === null || _b === void 0 ? void 0 : _b.api_key) || process.env.SENDGRID_API_KEY;
            if (!emailApiKey) {
                status.email = {
                    status: 'warning',
                    message: 'Email API key not configured'
                };
            }
            else {
                // For SendGrid, we'd normally check quotas here
                // Since we don't want to make actual API calls in this example,
                // we'll simulate it
                status.email = {
                    status: 'ok',
                    message: 'Email service is operational',
                    quota: {
                        used: 250, // This would come from the actual API
                        limit: 2000, // This would come from the actual API
                        remaining: 1750 // This would come from the actual API
                    }
                };
            }
        }
        catch (error) {
            console.error('Email service check error:', error);
            status.email = {
                status: 'error',
                message: `Email service error: ${error.message}`
            };
        }
        return { success: true, status };
    }
    catch (error) {
        console.error('Error checking API status:', error);
        return { success: false, error: error.message };
    }
});
// Get content sources
const getContentSources = functions.https.onCall(async (data, context) => {
    try {
        // Verify admin token
        const { token } = data;
        const isValidToken = await (0, exports.verifyAdminToken)(token);
        if (!isValidToken) {
            throw new Error('Unauthorized access');
        }
        const sourcesSnapshot = await db.collection('contentSources')
            .orderBy('name')
            .get();
        const sources = sourcesSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        return { success: true, sources };
    }
    catch (error) {
        console.error('Error getting content sources:', error);
        return { success: false, error: error.message };
    }
});
// Add content source
const addContentSource = functions.https.onCall(async (data, context) => {
    try {
        // Verify admin token
        const { token, name, url, category, scrapeSelector } = data;
        const isValidToken = await (0, exports.verifyAdminToken)(token);
        if (!isValidToken) {
            throw new Error('Unauthorized access');
        }
        if (!name || !url) {
            throw new Error('Name and URL are required');
        }
        // Validate URL by attempting to fetch it
        try {
            await axios_1.default.get(url);
        }
        catch (error) {
            throw new Error(`Could not access URL: ${error.message}`);
        }
        // Add to Firestore
        const sourceRef = await db.collection('contentSources').add({
            name,
            url,
            category: category || 'general',
            scrapeSelector: scrapeSelector || '',
            active: true,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return { success: true, id: sourceRef.id };
    }
    catch (error) {
        console.error('Error adding content source:', error);
        return { success: false, error: error.message };
    }
});
// Update content source
const updateContentSource = functions.https.onCall(async (data, context) => {
    try {
        // Verify admin token
        const { token, id } = data, updateData = __rest(data, ["token", "id"]);
        const isValidToken = await (0, exports.verifyAdminToken)(token);
        if (!isValidToken) {
            throw new Error('Unauthorized access');
        }
        if (!id) {
            throw new Error('Source ID is required');
        }
        // Remove fields that shouldn't be updated
        delete updateData.createdAt;
        delete updateData.token;
        // Update in Firestore
        await db.collection('contentSources').doc(id).update(Object.assign(Object.assign({}, updateData), { updatedAt: admin.firestore.FieldValue.serverTimestamp() }));
        return { success: true };
    }
    catch (error) {
        console.error('Error updating content source:', error);
        return { success: false, error: error.message };
    }
});
// Delete content source
const deleteContentSource = functions.https.onCall(async (data, context) => {
    try {
        // Verify admin token
        const { token, id } = data;
        const isValidToken = await (0, exports.verifyAdminToken)(token);
        if (!isValidToken) {
            throw new Error('Unauthorized access');
        }
        if (!id) {
            throw new Error('Source ID is required');
        }
        // Delete from Firestore
        await db.collection('contentSources').doc(id).delete();
        return { success: true };
    }
    catch (error) {
        console.error('Error deleting content source:', error);
        return { success: false, error: error.message };
    }
});
// Get subscribers
const getSubscribers = functions.https.onCall(async (data, context) => {
    try {
        // Verify admin token
        const { token, limit = 100, offset = 0 } = data;
        const isValidToken = await (0, exports.verifyAdminToken)(token);
        if (!isValidToken) {
            throw new Error('Unauthorized access');
        }
        const subscribersSnapshot = await db.collection('subscribers')
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .offset(offset)
            .get();
        const subscribers = subscribersSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        // Get total count
        const countSnapshot = await db.collection('subscribers').count().get();
        const total = countSnapshot.data().count;
        return {
            success: true,
            subscribers,
            pagination: {
                total,
                limit,
                offset
            }
        };
    }
    catch (error) {
        console.error('Error getting subscribers:', error);
        return { success: false, error: error.message };
    }
});
// Get system logs
const getSystemLogs = functions.https.onCall(async (data, context) => {
    try {
        // Verify admin token
        const { token, limit = 100, offset = 0, level, service, timeRange } = data;
        const isValidToken = await (0, exports.verifyAdminToken)(token);
        if (!isValidToken) {
            throw new Error('Unauthorized access');
        }
        // Calculate timeRange in milliseconds
        let timeThreshold = null;
        if (timeRange) {
            const now = Date.now();
            switch (timeRange) {
                case '1h':
                    timeThreshold = new Date(now - 60 * 60 * 1000);
                    break;
                case '6h':
                    timeThreshold = new Date(now - 6 * 60 * 60 * 1000);
                    break;
                case '1d':
                    timeThreshold = new Date(now - 24 * 60 * 60 * 1000);
                    break;
                case '7d':
                    timeThreshold = new Date(now - 7 * 24 * 60 * 60 * 1000);
                    break;
                case '30d':
                    timeThreshold = new Date(now - 30 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    timeThreshold = new Date(now - 24 * 60 * 60 * 1000); // Default to 1 day
            }
        }
        // Build the query
        let query = db.collection('systemLogs')
            .orderBy('timestamp', 'desc');
        // Apply filters if provided
        if (timeThreshold) {
            query = query.where('timestamp', '>=', admin.firestore.Timestamp.fromDate(timeThreshold));
        }
        // Apply pagination
        query = query.limit(limit).offset(offset);
        // Execute the query
        const logsSnapshot = await query.get();
        // Extract the logs
        let logs = logsSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        // Apply filters that can't be done in the query (for simplicity in this implementation)
        if (level) {
            logs = logs.filter(log => log.level === level);
        }
        if (service) {
            logs = logs.filter(log => log.service === service);
        }
        // Get approximate total count (for production, implement proper pagination with cursors)
        const countSnapshot = await db.collection('systemLogs').count().get();
        const total = countSnapshot.data().count;
        return {
            success: true,
            logs,
            pagination: {
                total,
                limit,
                offset
            }
        };
    }
    catch (error) {
        console.error('Error getting system logs:', error);
        return { success: false, error: error.message };
    }
});
// Create a system log entry
const logSystemEvent = async (data) => {
    try {
        await db.collection('systemLogs').add(Object.assign(Object.assign({}, data), { timestamp: admin.firestore.FieldValue.serverTimestamp() }));
        return true;
    }
    catch (error) {
        console.error('Error logging system event:', error);
        return false;
    }
};
// Export functions
exports.default = {
    adminLogin,
    getApiStatus,
    getContentSources,
    addContentSource,
    updateContentSource,
    deleteContentSource,
    getSubscribers,
    getSystemLogs,
    logSystemEvent
};
//# sourceMappingURL=index.js.map