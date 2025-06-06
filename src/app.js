const express = require('express');
const path = require('path');
const uploadRoutes = require('./routes/uploadRoutes');
require('dotenv').config();
console.log('NODE_ENV:', process.env.NODE_ENV);

// MongoDB connection (use MongoDB Atlas for production)
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/file-share-app';
console.log('Connecting to MongoDB with URI:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs

const mongoose = require('mongoose');
const uploadController = require('./controllers/uploadController');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        // Don't exit process on Vercel, just log the error
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    });

// Serve static files from both public directory
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint for debugging
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', env: process.env.NODE_ENV });
});

// Handle uploads route
app.use('/upload', uploadRoutes);

// Serve the index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

// Add a root-level short download route for minimal URLs like /abc123
app.get('/:shortId', (req, res, next) => {
    // Only match 10-character alphanumeric IDs (nanoid format)
    if (/^[A-Za-z0-9]{10}$/.test(req.params.shortId)) {
        return uploadController.handleDownload(req, res);
    }
    next();
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!', error: err.message });
});

// Always export the app for serverless environments
module.exports = app;

// For local development only
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on:`);
        console.log(`  Local:   http://localhost:${PORT}`);
    });
}