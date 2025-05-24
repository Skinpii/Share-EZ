const crypto = require('crypto');

// In-memory storage for mapping short IDs to filenames
// In a production environment, this should be replaced with a database
const fileMap = new Map();

/**
 * Generates a numeric-only short ID
 * @returns {string} - A short unique numeric ID
 */
function generateShortId() {
    // Generate a random 3-digit number as a string, padded if needed
    return Math.floor(100 + Math.random() * 900).toString(); // 3 digits
}

/**
 * Retrieves the original filename from a short ID
 * @param {string} shortId - The short ID
 * @returns {string|null} - The original filename or null if not found
 */
function getFilenameFromId(shortId) {
    return fileMap.get(shortId) || null;
}

/**
 * Gets all stored mappings (for debugging or admin purposes)
 * @returns {Object} - All ID to filename mappings
 */
function getAllMappings() {
    return Object.fromEntries(fileMap);
}

module.exports = {
    generateShortId,
    getFilenameFromId,
    getAllMappings
};
