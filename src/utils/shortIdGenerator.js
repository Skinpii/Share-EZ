const { nanoid } = require('nanoid');

/**
 * Generates a unique short ID (10 characters)
 * @returns {string}
 */
function generateShortId() {
    return nanoid(10);
}

module.exports = { generateShortId };
