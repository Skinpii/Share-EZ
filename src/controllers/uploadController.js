const path = require('path');
const fs = require('fs');
const { generateShortId } = require('../utils/shortIdGenerator');
const Upload = require('../models/Upload');

class UploadController {
    async handleUpload(req, res) {
        try {
            console.log('Received upload request:', { file: req.file });
            const file = req.file;
            console.log('Request file object:', file);
            if (!file) {
                return res.status(400).json({ message: 'No file uploaded.' });
            }

            // Generate a unique short numeric ID
            let shortId;
            do {
                shortId = generateShortId();
            } while (await Upload.exists({ shortId }));
            console.log('Using shortId:', shortId);

            // Prepare file data for storage
            const fileData = {
                shortId,
                filename: file.filename || `${Date.now()}_${file.originalname}`,
                originalName: file.originalname,
                size: file.size,
                // Store file buffer for memory storage
                ...(file.buffer && { fileBuffer: file.buffer }),
                mimetype: file.mimetype
            };
            console.log('Prepared fileData:', fileData);

            // Save upload info to MongoDB
            await Upload.create(fileData);

            // Return only the numeric code (shortId)
            return res.status(200).json({
                message: 'File uploaded successfully.',
                file: fileData.filename,
                code: shortId
            });
        } catch (error) {
            console.error('Error in handleUpload:', error.stack || error);
            return res.status(500).json({ message: 'Error uploading file.', error: error.message });
        }
    }    async handleDownload(req, res) {
        try {
            const { shortId } = req.params;
            console.log('Download request for shortId:', shortId);
            
            if (!shortId) {
                return res.status(400).json({ message: 'File ID is required.' });
            }

            // Get the file info from MongoDB
            const uploadDoc = await Upload.findOne({ shortId });
            console.log('Found upload document:', uploadDoc);
            
            if (!uploadDoc) {
                return res.status(404).json({ message: 'Invalid download link or file has expired.' });
            }

            // Check if we have a file buffer (memory storage - Vercel)
            if (uploadDoc.fileBuffer) {
                // Serve file from memory buffer
                res.setHeader('Content-Disposition', `attachment; filename="${uploadDoc.originalName}"`);
                res.setHeader('Content-Type', uploadDoc.mimetype || 'application/octet-stream');
                res.send(uploadDoc.fileBuffer);
            } else {
                // Serve file from disk (local development)
                const fileName = uploadDoc.filename;
                const expectedFilePath = path.join(__dirname, '../../public/uploads', fileName);
                
                if (fs.existsSync(expectedFilePath)) {
                    res.download(expectedFilePath, uploadDoc.originalName, (err) => {
                        if (err && !res.headersSent && err.code !== 'ECONNABORTED') {
                            return res.status(500).json({ message: 'Error processing download.', error: err.message });
                        }
                    });
                } else {
                    return res.status(404).json({ message: 'File not found on server.' });
                }
            }        } catch (error) {
            if (!res.headersSent) {
                return res.status(500).json({ message: 'Error downloading file.', error: error.message });
            }
        }
    }    async cleanupFile(req, res) {
        try {
            const { shortId } = req.params;
            if (!shortId) {
                return res.status(400).json({ message: 'File ID is required.' });
            }

            // Remove file from MongoDB
            const uploadDoc = await Upload.findOneAndDelete({ shortId });
            
            if (uploadDoc) {
                return res.status(200).json({ message: 'File cleaned up successfully.' });
            } else {
                return res.status(404).json({ message: 'File not found or already cleaned up.' });
            }
        } catch (error) {
            console.error('Error in cleanupFile endpoint:', error);
            return res.status(500).json({ message: 'Error cleaning up file.', error: error.message });
        }
    }
}

module.exports = new UploadController();

// No code change needed here; ensure uploads are saved to public/uploads and tmp/ is not used.
