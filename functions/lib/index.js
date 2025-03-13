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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWeeklyNewsletter = exports.admin = exports.newsletter = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const newsletter_1 = __importDefault(require("./newsletter"));
const admin_1 = __importDefault(require("./admin"));
const dotenv = __importStar(require("dotenv"));
// Load environment variables from .env file if present
dotenv.config();
// Initialize Firebase Admin
exports.admin.initializeApp();
// Print a log for the API key presence (without revealing the key)
console.log(`OpenRouter API Key configured: ${Boolean(process.env.OPENROUTER_API_KEY)}`);
// Export newsletter functions
exports.newsletter = newsletter_1.default;
// Export admin functions
exports.admin = admin_1.default;
// Example scheduled function to generate weekly newsletter
exports.generateWeeklyNewsletter = functions.pubsub
    .schedule('every monday 09:00')
    .timeZone('America/New_York')
    .onRun(async () => {
    try {
        // Will be implemented in newsletter/index.ts
        await newsletter_1.default.generateNewsletter();
        return null;
    }
    catch (error) {
        console.error('Error generating weekly newsletter:', error);
        return null;
    }
});
//# sourceMappingURL=index.js.map