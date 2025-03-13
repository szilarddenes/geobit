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
// Export functions
exports.default = {
    adminLogin,
    getContentSources,
    addContentSource,
    updateContentSource,
    deleteContentSource,
    getSubscribers
};
//# sourceMappingURL=index.js.map