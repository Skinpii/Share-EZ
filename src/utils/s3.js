const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const fs = require('fs');
const path = require('path');

const REGION = process.env.AWS_REGION;
const BUCKET = process.env.AWS_S3_BUCKET;

const s3 = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

async function uploadFileToS3(localFilePath, s3Key, mimetype) {
    const fileStream = fs.createReadStream(localFilePath);
    const uploadParams = {
        Bucket: BUCKET,
        Key: s3Key,
        Body: fileStream,
        ContentType: mimetype,
    };
    await s3.send(new PutObjectCommand(uploadParams));
}

async function getS3DownloadUrl(s3Key, expiresInSeconds = 60 * 60) {
    const command = new GetObjectCommand({ Bucket: BUCKET, Key: s3Key });
    return await getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
}

module.exports = {
    uploadFileToS3,
    getS3DownloadUrl,
};
