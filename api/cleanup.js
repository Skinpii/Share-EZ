const Upload = require('../src/models/Upload');

module.exports = async (req, res) => {
    // Verify this is a cron request
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        console.log('Starting automatic file cleanup...');
        
        // Clean up files older than 1 minute (60 seconds)
        const cutoffTime = new Date(Date.now() - 1 * 60 * 1000);
        
        // Find old records
        const oldUploads = await Upload.find({
            uploadDate: { $lt: cutoffTime }
        });

        let cleanedCount = 0;
        for (const upload of oldUploads) {
            try {
                // Delete the record from MongoDB (file data is stored in buffer)
                await Upload.deleteOne({ shortId: upload.shortId });
                console.log(`Deleted record for shortId: ${upload.shortId}`);
                cleanedCount++;
            } catch (error) {
                console.error(`Error deleting ${upload.shortId}:`, error);
            }
        }

        console.log(`Cleaned up ${cleanedCount} old files`);
        
        return res.status(200).json({ 
            success: true, 
            cleanedCount,
            message: `Successfully cleaned up ${cleanedCount} files older than 1 minute`
        });
    } catch (error) {
        console.error('Error in cleanup cron:', error);
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};
