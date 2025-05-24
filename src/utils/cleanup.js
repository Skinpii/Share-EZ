const fs = require('fs');
const path = require('path');
const Upload = require('../models/Upload');

class CleanupService {
    // Clean up a specific file by shortId
    static async cleanupFile(shortId) {
        try {
            const uploadDoc = await Upload.findOne({ shortId });
            if (!uploadDoc) {
                console.log(`No record found for shortId: ${shortId}`);
                return { success: false, message: 'File not found in database' };
            }

            // Delete the physical file
            const filePath = path.join(__dirname, '../../public/uploads', uploadDoc.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Deleted file: ${uploadDoc.filename}`);
            }

            // Delete the record from MongoDB
            await Upload.deleteOne({ shortId });
            console.log(`Deleted record for shortId: ${shortId}`);

            return { success: true, message: 'File cleaned up successfully' };
        } catch (error) {
            console.error('Error in cleanupFile:', error);
            return { success: false, message: error.message };
        }
    }

    // Clean up files older than specified minutes (default: 60 minutes)
    static async cleanupOldFiles(maxAgeMinutes = 60) {
        try {
            const cutoffTime = new Date(Date.now() - maxAgeMinutes * 60 * 1000);
            
            // Find old records
            const oldUploads = await Upload.find({
                uploadDate: { $lt: cutoffTime }
            });

            let cleanedCount = 0;
            for (const upload of oldUploads) {
                const result = await this.cleanupFile(upload.shortId);
                if (result.success) {
                    cleanedCount++;
                }
            }

            console.log(`Cleaned up ${cleanedCount} old files`);
            return { success: true, cleanedCount };
        } catch (error) {
            console.error('Error in cleanupOldFiles:', error);
            return { success: false, message: error.message };
        }
    }

    // Clean up orphaned files (files that exist physically but not in database)
    static async cleanupOrphanedFiles() {
        try {
            const uploadsDir = path.join(__dirname, '../../public/uploads');
            if (!fs.existsSync(uploadsDir)) {
                return { success: true, message: 'Uploads directory does not exist' };
            }

            const files = fs.readdirSync(uploadsDir);
            let cleanedCount = 0;

            for (const file of files) {
                // Check if file exists in database
                const uploadDoc = await Upload.findOne({ filename: file });
                if (!uploadDoc) {
                    // File exists physically but not in database - delete it
                    const filePath = path.join(uploadsDir, file);
                    fs.unlinkSync(filePath);
                    console.log(`Deleted orphaned file: ${file}`);
                    cleanedCount++;
                }
            }

            console.log(`Cleaned up ${cleanedCount} orphaned files`);
            return { success: true, cleanedCount };
        } catch (error) {
            console.error('Error in cleanupOrphanedFiles:', error);
            return { success: false, message: error.message };
        }
    }

    // Start automatic cleanup service
    static startAutomaticCleanup(intervalMinutes = 30, maxAgeMinutes = 60) {
        console.log(`Starting automatic cleanup service - interval: ${intervalMinutes}min, max age: ${maxAgeMinutes}min`);
        
        setInterval(async () => {
            console.log('Running automatic cleanup...');
            await this.cleanupOldFiles(maxAgeMinutes);
            await this.cleanupOrphanedFiles();
        }, intervalMinutes * 60 * 1000);
    }
}

module.exports = CleanupService;
