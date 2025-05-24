const express = require('express');
const path = require('path');
const uploadRoutes = require('./routes/uploadRoutes');
require('dotenv').config();
const mongoose = require('mongoose');
const uploadController = require('./controllers/uploadController');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection (use MongoDB Atlas for production)
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/file-share-app';
mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Serve static files from both public directory
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle uploads route
app.use('/upload', uploadRoutes);

// Serve the index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

// Add a root-level short download route for minimal URLs like /123
app.get('/:shortId', (req, res, next) => {
    // Only match 3-digit numeric IDs
    if (/^\d{3}$/.test(req.params.shortId)) {
        return uploadController.handleDownload(req, res);
    }
    next();
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!', error: err.message });
});

// For Vercel deployment, export the app
if (process.env.NODE_ENV === 'production') {
    module.exports = app;
} else {
    // For local development
    app.listen(PORT, () => {
        console.log(`Server is running on:`);
        console.log(`  Local:   http://localhost:${PORT}`);
    });
}