const path = require('path');
const fs = require('fs');
const { generateShortId } = require('../utils/shortIdGenerator');
const Upload = require('../models/Upload');

class UploadController {
    async handleUpload(req, res) {
        try {
            const file = req.file;
            if (!file) {
                return res.status(400).json({ message: 'No file uploaded.' });
            }

            // Generate a short numeric ID
            const shortId = generateShortId();

            // For memory storage (Vercel), we need to store file data differently
            const fileData = {
                shortId,
                filename: file.filename || `${Date.now()}_${file.originalname}`,
                originalName: file.originalname,
                size: file.size,
                // Store file buffer for memory storage
                ...(file.buffer && { fileBuffer: file.buffer }),
                mimetype: file.mimetype
            };

            // Save upload info to MongoDB
            await Upload.create(fileData);

            // Generate a short download link using the shortest path
            const downloadLink = `/${shortId}`;
            // Use req.protocol and req.get('host') for a global link
            const shortUrl = `${req.protocol}://${req.get('host')}${downloadLink}`;
            return res.status(200).json({
                message: 'File uploaded successfully.',
                file: fileData.filename,
                downloadLink,
                shortUrl
            });
        } catch (error) {
            console.error('Error in handleUpload:', error);
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
