const PetDocument = require('../models/PetDocument');
const multer = require('multer');
const path = require('path');

// Get all documents for user
exports.getDocuments = async (req, res) => {
  try {
    const { type, petId } = req.query;
    const query = { user: req.user.id };
    
    if (type) {
      query.type = type;
    }
    
    if (petId) {
      query.pet = petId;
    }
    
    const documents = await PetDocument.find(query)
      .sort({ issueDate: -1 })
      .populate('pet', 'name avatar');
    
    res.json({
      success: true,
      data: documents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get document statistics
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    
    const total = await PetDocument.countDocuments({ user: userId });
    
    // Valid documents (no expiry or expiry date in future)
    const valid = await PetDocument.countDocuments({
      user: userId,
      $or: [
        { expiryDate: null },
        { expiryDate: { $gt: now } }
      ]
    });
    
    // Expiring soon (within 30 days)
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const expiringSoon = await PetDocument.countDocuments({
      user: userId,
      expiryDate: { $gt: now, $lte: thirtyDaysLater }
    });
    
    // Expired
    const expired = await PetDocument.countDocuments({
      user: userId,
      expiryDate: { $lt: now }
    });
    
    res.json({
      success: true,
      data: {
        total,
        valid,
        expiringSoon,
        expired
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Upload a new document
exports.uploadDocument = async (req, res) => {
  try {
    const { type, title, issueDate, expiryDate, petId, metadata } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请上传文件'
      });
    }
    
    const document = await PetDocument.create({
      user: req.user.id,
      pet: petId,
      type,
      title,
      issueDate,
      expiryDate,
      fileUrl: `/uploads/documents/${req.file.filename}`,
      fileType: req.file.mimetype,
      thumbnail: req.file.mimetype.startsWith('image') 
        ? `/uploads/documents/${req.file.filename}` 
        : null,
      metadata: metadata ? JSON.parse(metadata) : {}
    });
    
    res.status(201).json({
      success: true,
      data: document
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update a document
exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    
    const document = await PetDocument.findOne({ _id: id, user: req.user.id });
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: '证件不存在'
      });
    }
    
    Object.assign(document, req.body);
    await document.save();
    
    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a document
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    
    const document = await PetDocument.findOneAndDelete({ _id: id, user: req.user.id });
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: '证件不存在'
      });
    }
    
    // TODO: Delete file from storage
    
    res.json({
      success: true,
      message: '删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get document by ID
exports.getDocument = async (req, res) => {
  try {
    const { id } = req.params;
    
    const document = await PetDocument.findOne({ _id: id, user: req.user.id })
      .populate('pet', 'name avatar');
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: '证件不存在'
      });
    }
    
    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
