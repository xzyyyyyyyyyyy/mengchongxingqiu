const PetRating = require('../models/PetRating');
const Pet = require('../models/Pet');
const mongoose = require('mongoose');

// @desc    Get ratings for a pet
// @route   GET /api/pets/:petId/ratings
// @access  Public
exports.getPetRatings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || '-createdAt'; // -createdAt, -overall, -helpfulCount

    const ratings = await PetRating.find({ pet: req.params.petId })
      .populate('user', 'username avatar')
      .sort(sortBy)
      .limit(limit)
      .skip(skip);

    const total = await PetRating.countDocuments({ pet: req.params.petId });

    // Calculate average ratings
    const avgRatings = await PetRating.aggregate([
      { $match: { pet: mongoose.Types.ObjectId(req.params.petId) } },
      {
        $group: {
          _id: null,
          overall: { $avg: '$overall' },
          stickiness: { $avg: '$stickiness' },
          intelligence: { $avg: '$intelligence' },
          activeness: { $avg: '$activeness' },
          shedding: { $avg: '$shedding' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      count: ratings.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      averages: avgRatings[0] || {
        overall: 0,
        stickiness: 0,
        intelligence: 0,
        activeness: 0,
        shedding: 0,
        count: 0
      },
      data: ratings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add or update rating for a pet
// @route   POST /api/pets/:petId/ratings
// @access  Private
exports.addPetRating = async (req, res) => {
  try {
    const petId = req.params.petId;
    const userId = req.user.id;

    // Check if pet exists
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: '宠物未找到'
      });
    }

    // Validate ratings
    const { overall, stickiness, intelligence, activeness, shedding, title, content, images } = req.body;

    if (!overall || overall < 1 || overall > 5) {
      return res.status(400).json({
        success: false,
        message: '整体评分必须在1-5之间'
      });
    }

    // Check if user already rated this pet
    let rating = await PetRating.findOne({ pet: petId, user: userId });

    if (rating) {
      // Update existing rating
      rating.overall = overall;
      if (stickiness !== undefined) rating.stickiness = stickiness;
      if (intelligence !== undefined) rating.intelligence = intelligence;
      if (activeness !== undefined) rating.activeness = activeness;
      if (shedding !== undefined) rating.shedding = shedding;
      if (title) rating.title = title;
      if (content) rating.content = content;
      if (images) rating.images = images;
      
      await rating.save();
      
      res.json({
        success: true,
        message: '评分已更新',
        data: rating
      });
    } else {
      // Create new rating
      rating = await PetRating.create({
        pet: petId,
        user: userId,
        overall,
        stickiness,
        intelligence,
        activeness,
        shedding,
        title,
        content,
        images
      });

      res.status(201).json({
        success: true,
        message: '评分成功',
        data: rating
      });
    }
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: '您已经评分过该宠物'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete rating
// @route   DELETE /api/pets/:petId/ratings/:ratingId
// @access  Private
exports.deleteRating = async (req, res) => {
  try {
    const rating = await PetRating.findById(req.params.ratingId);

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: '评分未找到'
      });
    }

    // Check if user owns the rating
    if (rating.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '无权删除此评分'
      });
    }

    await rating.deleteOne();

    res.json({
      success: true,
      message: '评分已删除'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark rating as helpful
// @route   PUT /api/pets/:petId/ratings/:ratingId/helpful
// @access  Private
exports.markRatingHelpful = async (req, res) => {
  try {
    const rating = await PetRating.findById(req.params.ratingId);

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: '评分未找到'
      });
    }

    const userId = req.user.id;
    const helpfulIndex = rating.helpfulBy.indexOf(userId);

    if (helpfulIndex > -1) {
      // User already marked as helpful, remove it
      rating.helpfulBy.splice(helpfulIndex, 1);
      rating.helpfulCount = Math.max(0, rating.helpfulCount - 1);
    } else {
      // Add helpful mark
      rating.helpfulBy.push(userId);
      rating.helpfulCount += 1;
    }

    await rating.save();

    res.json({
      success: true,
      message: helpfulIndex > -1 ? '已取消有用标记' : '已标记为有用',
      data: rating
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's rating for a pet
// @route   GET /api/pets/:petId/ratings/me
// @access  Private
exports.getMyRating = async (req, res) => {
  try {
    const rating = await PetRating.findOne({
      pet: req.params.petId,
      user: req.user.id
    });

    res.json({
      success: true,
      data: rating
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
