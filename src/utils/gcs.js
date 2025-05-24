const { Storage } = require('@google-cloud/storage');
const path = require('path');

const bucketName = process.env.GCS_BUCKET;
const storage = new Storage({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucket = storage.bucket(bucketName);

async function uploadFileToGCS(localFilePath, gcsKey, mimetype) {
    await bucket.upload(localFilePath, {
        destination: gcsKey,
        contentType: mimetype,
        public: false,
    });
}

async function getGCSDownloadUrl(gcsKey, expiresInSeconds = 60 * 60) {
    const file = bucket.file(gcsKey);
    const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + expiresInSeconds * 1000,
    });
    return url;
}

module.exports = {
    uploadFileToGCS,
    getGCSDownloadUrl,
};
