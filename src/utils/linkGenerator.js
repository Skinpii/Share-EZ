function generateLink(fileIdentifier) {
    // Use the new short download route
    const baseUrl = '/d/';
    return `${baseUrl}${fileIdentifier}`;
}

module.exports = generateLink;