const express = require('express');
const uploadController = require('../controllers/uploadController');
const fileUpload = require('../middleware/fileUpload');

const router = express.Router();

router.post('/', fileUpload.single('file'), uploadController.handleUpload);
// router.get('/download/:id', uploadController.generateLink);
router.get('/download/:shortId', uploadController.handleDownload);
router.get('/d/:shortId', uploadController.handleDownload); // Short download URL
router.delete('/cleanup/:shortId', uploadController.cleanupFile);

module.exports = router;