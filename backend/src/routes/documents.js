const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'doc-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('只支持 JPG、PNG 和 PDF 格式'));
  }
});

// @route   GET /api/documents
// @desc    Get all documents for user
// @access  Private
router.get('/', protect, documentController.getDocuments);

// @route   GET /api/documents/stats
// @desc    Get document statistics
// @access  Private
router.get('/stats', protect, documentController.getStats);

// @route   GET /api/documents/:id
// @desc    Get document by ID
// @access  Private
router.get('/:id', protect, documentController.getDocument);

// @route   POST /api/documents
// @desc    Upload a new document
// @access  Private
router.post('/', protect, upload.single('file'), documentController.uploadDocument);

// @route   PUT /api/documents/:id
// @desc    Update a document
// @access  Private
router.put('/:id', protect, documentController.updateDocument);

// @route   DELETE /api/documents/:id
// @desc    Delete a document
// @access  Private
router.delete('/:id', protect, documentController.deleteDocument);

module.exports = router;
