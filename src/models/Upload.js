const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    shortId: { type: String, required: true, unique: true },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    size: { type: Number, required: true },
    uploadDate: { type: Date, default: Date.now },
    // For Vercel deployment - store file buffer in database
    fileBuffer: { type: Buffer },
    mimetype: { type: String }
});

module.exports = mongoose.model('Upload', uploadSchema);
