const multer = require('multer');
const path = require('path');

// For Vercel deployment, use memory storage (temporary)
// For production with persistent storage, you'd use cloud storage like AWS S3
const storage = process.env.NODE_ENV === 'production' 
    ? multer.memoryStorage() // Vercel - files stored in memory
    : multer.diskStorage({   // Local development - files stored on disk
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname, '../../public/uploads');
            const fs = require('fs');
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});

module.exports = upload;