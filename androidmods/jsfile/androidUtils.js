/**
 * CheatXplorer Android Utilities
 * 
 * This file contains utility functions for handling Android app data,
 * including automatic Play Store icon fetching.
 */

// Default icon to use if Play Store icon fails to load
const DEFAULT_ICON = 'https://play-lh.googleusercontent.com/PlIWrf9AIxmHCB7ORl-O1eLc_kDfOFQesA65LXsf-IO0plUOLDk2ltB2Z1bGqmHUN14=s280';

/**
 * Extracts package name from a Google Play Store URL
 * 
 * @param {string} url - The Google Play Store URL
 * @returns {string} - The package name
 */
function getPackageNameFromUrl(url) {
    const regex = /id=([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
}

/**
 * Formats any Play Store image URL to always use s280 size
 * Handles various formats including w240-h480-rw
 * 
 * @param {string} url - Any Play Store image URL
 * @returns {string} - The formatted URL with s280 size
 */
function formatToS280(url) {
    // First handle URLs with w240-h480-rw or similar format
    url = url.replace(/=w\d+-h\d+(-\w+)?/, '=s280');
    
    // Then handle URLs with other size patterns like s120, s220-rw, etc.
    url = url.replace(/=s\d+(-\w+)?/, '=s280');
    
    return url;
}

/**
 * Generates a direct Play Store icon URL using the package name
 * 
 * @param {string} packageName - The app package name
 * @returns {string} - The direct Play Store icon URL
 */
function getDirectIconUrl(packageName) {
    return `https://play-lh.googleusercontent.com/icon?size=280&hl=en&q=${packageName}`;
}

/**
 * Tries to get a Play Store app page to extract icon URL
 * 
 * @param {string} packageName - The app package name
 * @param {Function} callback - Callback function with icon URL or null
 */
function fetchIconWithFallback(packageName, callback) {
    // Method 1: Direct icon URL - most reliable
    const directUrl = getDirectIconUrl(packageName);
    
    // Check if direct URL works
    imageExists(directUrl, (exists) => {
        if (exists) {
            console.log(`Direct icon URL works for ${packageName}`);
            callback(directUrl);
        } else {
            // If direct URL fails, use default
            console.log(`Icon fetch failed for ${packageName}`);
            callback(DEFAULT_ICON);
        }
    });
}

/**
 * Checks if an image URL exists/can be loaded successfully
 * 
 * @param {string} url - The image URL to check
 * @param {Function} callback - Callback function that receives true if image loads, false otherwise
 */
function imageExists(url, callback) {
    const img = new Image();
    img.onload = function() { callback(true); };
    img.onerror = function() { callback(false); };
    
    // Start loading the image
    img.src = url;
    
    // Set a timeout in case the image loading hangs
    setTimeout(() => {
        if (!img.complete) {
            console.log(`Image load timeout for: ${url}`);
            img.src = '';
            callback(false);
        }
    }, 5000);
}

/**
 * Processes all game thumbnails in the gameData array
 * Fetches missing icons from the Play Store
 * 
 * @param {Function} callback - Function to call when all icons are processed
 */
function processGameIcons(callback) {
    const totalGames = gameData.length;
    let processedGames = 0;
    
    if (totalGames === 0) {
        callback();
        return;
    }
    
    // Process each game
    gameData.forEach(game => {
        // Make sure we have a package name
        if (!game.packageName && game.playStoreUrl) {
            game.packageName = getPackageNameFromUrl(game.playStoreUrl);
        }
        
        // If game already has a thumbnail, format it to s280 size
        if (game.thumbnail) {
            game.thumbnail = formatToS280(game.thumbnail);
        }
        
        // Try to load the thumbnail (either existing or fetch new)
        fetchPlayStoreIcon(game, () => {
            processedGames++;
            if (processedGames === totalGames) callback();
        });
    });
}

/**
 * Fetches and sets a Play Store icon for a specific game
 * Using multiple fallback methods to ensure an icon is always available
 * 
 * @param {Object} game - The game object
 * @param {Function} callback - Function to call when icon is fetched
 */
function fetchPlayStoreIcon(game, callback) {
    if (!game.packageName) {
        console.error('No package name available for:', game.title);
        game.thumbnail = DEFAULT_ICON;
        callback();
        return;
    }
    
    // If there's already a thumbnail, check if it works
    if (game.thumbnail) {
        imageExists(game.thumbnail, (exists) => {
            if (exists) {
                console.log(`Existing thumbnail works for ${game.title}`);
                callback();
            } else {
                // Existing thumbnail doesn't work, get a new one
                console.log(`Existing thumbnail broken for ${game.title}, fetching new one`);
                fetchIconWithFallback(game.packageName, (iconUrl) => {
                    game.thumbnail = iconUrl;
                    callback();
                });
            }
        });
    } else {
        // No existing thumbnail, fetch a new one
        fetchIconWithFallback(game.packageName, (iconUrl) => {
            game.thumbnail = iconUrl;
            callback();
        });
    }
}