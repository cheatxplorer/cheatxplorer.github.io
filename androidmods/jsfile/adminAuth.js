/**
 * Admin Authentication System
 * This file manages secure admin login for the Game Manager
 * 
 * IMPORTANT: This file should be obfuscated before deployment
 * using a tool like JavaScript Obfuscator.
 */

// The AdminAuth class handles authentication
class AdminAuth {
    constructor() {
        // Store session in localStorage with a short expiry
        this.storageKey = 'cx_admin_session';
        this.maxSessionTime = 3600000; // 1 hour in milliseconds
        
        // Load session if exists
        this.session = this.loadSession();
    }

    /**
     * Hash a string using a simple algorithm
     * This provides basic obfuscation, but should be enhanced with a proper hashing library
     * 
     * @param {string} str - String to hash
     * @returns {string} - Hashed string
     */
    hash(str) {
        // A basic hash function - replace with a stronger one in production
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(36);
    }

    /**
     * Check if provided credentials match the stored admin credentials
     * 
     * @param {string} username - Admin username
     * @param {string} password - Admin password
     * @returns {boolean} - True if login successful
     */
    login(username, password) {
        // Convert username to lowercase for consistent comparison
        username = username.toLowerCase();
        
        // The correct credentials - CHANGE THESE TO YOUR OWN VALUES BEFORE DEPLOYING
        // These will be obfuscated when this file is processed by JavaScript Obfuscator
        const correctUsername = "cheatxplorer"; // Change this to your preferred username
        const correctPasswordHash = this.hash("CXP!47@hD9e$QzT3pWk#YfM2oN&b"); // Change "CX-AdminPass123!" to your preferred password
        
        // Hash the provided password and compare
        const passwordHash = this.hash(password);
        
        // Check if credentials match
        if (username === correctUsername && passwordHash === correctPasswordHash) {
            // Create a session token
            const token = this.generateToken();
            
            // Save session
            this.saveSession(token);
            return true;
        }
        
        return false;
    }

    /**
     * Generate a random session token
     * 
     * @returns {string} - Random token
     */
    generateToken() {
        // Generate a random token with timestamp
        const timestamp = new Date().getTime();
        const random = Math.random().toString(36).substring(2, 15);
        return `${timestamp}.${random}`;
    }

    /**
     * Save session to localStorage
     * 
     * @param {string} token - Session token
     */
    saveSession(token) {
        const timestamp = new Date().getTime();
        
        // Create session object
        const session = {
            token: token,
            timestamp: timestamp,
            expires: timestamp + this.maxSessionTime
        };
        
        // Save to localStorage
        localStorage.setItem(this.storageKey, JSON.stringify(session));
        this.session = session;
    }

    /**
     * Load session from localStorage
     * 
     * @returns {object|null} - Session object or null if no valid session
     */
    loadSession() {
        try {
            // Get session from localStorage
            const sessionStr = localStorage.getItem(this.storageKey);
            if (!sessionStr) return null;
            
            // Parse session
            const session = JSON.parse(sessionStr);
            
            // Check if session is expired
            const now = new Date().getTime();
            if (now > session.expires) {
                // Session expired, remove it
                localStorage.removeItem(this.storageKey);
                return null;
            }
            
            return session;
        } catch (error) {
            console.error("Error loading session:", error);
            return null;
        }
    }

    /**
     * Check if user is logged in
     * 
     * @returns {boolean} - True if user is logged in
     */
    isLoggedIn() {
        // Load session
        const session = this.loadSession();
        
        // If no session, not logged in
        if (!session) return false;
        
        // Check if session is expired
        const now = new Date().getTime();
        if (now > session.expires) {
            // Session expired, remove it
            localStorage.removeItem(this.storageKey);
            return false;
        }
        
        // Session valid, extend it
        this.extendSession();
        
        return true;
    }

    /**
     * Extend current session
     */
    extendSession() {
        if (!this.session) return;
        
        // Update expiry time
        const now = new Date().getTime();
        this.session.expires = now + this.maxSessionTime;
        
        // Save updated session
        localStorage.setItem(this.storageKey, JSON.stringify(this.session));
    }

    /**
     * Logout user
     */
    logout() {
        // Remove session from localStorage
        localStorage.removeItem(this.storageKey);
        this.session = null;
    }
}

// Create a singleton instance
const adminAuth = new AdminAuth();