const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res, next) => {
  try {
    const {
      category,
      city,
      province,
      minRating,
      search,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (city) {
      query['location.city'] = city;
    }

    if (province) {
      query['location.province'] = province;
    }

    if (minRating) {
      query['rating.average'] = { $gte: parseFloat(minRating) };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort
    let sortOption = { createdAt: -1 };
    if (sort === 'rating') {
      sortOption = { 'rating.average': -1 };
    } else if (sort === 'reviews') {
      sortOption = { 'rating.count': -1 };
    }

    // Pagination
    const skip = (page - 1) * limit;
    const total = await Service.countDocuments(query);

    const services = await Service.find(query)
      .populate('provider', 'username avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
exports.getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('provider', 'username avatar email')
      .populate('reviews.user', 'username avatar');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: '服务不存在'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create service
// @route   POST /api/services
// @access  Private
exports.createService = async (req, res, next) => {
  try {
    // Add provider from authenticated user
    req.body.provider = req.user.id;

    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private
exports.updateService = async (req, res, next) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: '服务不存在'
      });
    }

    // Make sure user is service provider or admin
    if (service.provider.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: '无权限更新此服务'
      });
    }

    service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: '服务不存在'
      });
    }

    // Make sure user is service provider or admin
    if (service.provider.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: '无权限删除此服务'
      });
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review to service
// @route   POST /api/services/:id/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    const { rating, content, images } = req.body;

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: '服务不存在'
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = service.reviews.find(
      r => r.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: '您已经评价过此服务'
      });
    }

    const review = {
      user: req.user.id,
      rating: Number(rating),
      content,
      images: images || []
    };

    service.reviews.push(review);

    // Update rating
    service.rating.count = service.reviews.length;
    service.rating.average = 
      service.reviews.reduce((acc, item) => item.rating + acc, 0) / 
      service.reviews.length;

    await service.save();

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get services by location
// @route   GET /api/services/nearby
// @access  Public
exports.getNearbyServices = async (req, res, next) => {
  try {
    const { lng, lat, distance = 10000, category } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({
        success: false,
        message: '请提供经纬度坐标'
      });
    }

    const query = {
      isActive: true,
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(distance)
        }
      }
    };

    if (category) {
      query.category = category;
    }

    const services = await Service.find(query)
      .populate('provider', 'username avatar')
      .limit(20);

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    next(error);
  }
};
