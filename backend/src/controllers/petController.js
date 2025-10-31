const Pet = require('../models/Pet');

// @desc    Get all pets for logged in user
// @route   GET /api/pets
// @access  Private
exports.getPets = async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user.id }).sort('-createdAt');

    res.json({
      success: true,
      count: pets.length,
      data: pets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single pet
// @route   GET /api/pets/:id
// @access  Private
exports.getPet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: '宠物未找到'
      });
    }

    // Make sure user owns the pet
    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权访问此宠物信息'
      });
    }

    res.json({
      success: true,
      data: pet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new pet
// @route   POST /api/pets
// @access  Private
exports.createPet = async (req, res) => {
  try {
    req.body.owner = req.user.id;

    const pet = await Pet.create(req.body);

    res.status(201).json({
      success: true,
      data: pet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Private
exports.updatePet = async (req, res) => {
  try {
    let pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: '宠物未找到'
      });
    }

    // Make sure user owns the pet
    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权修改此宠物信息'
      });
    }

    pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: pet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Private
exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: '宠物未找到'
      });
    }

    // Make sure user owns the pet
    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权删除此宠物信息'
      });
    }

    await pet.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add health record
// @route   POST /api/pets/:id/health
// @access  Private
exports.addHealthRecord = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: '宠物未找到'
      });
    }

    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权修改此宠物信息'
      });
    }

    const { type, data } = req.body;

    if (type === 'vaccination') {
      pet.health.vaccinations.push(data);
    } else if (type === 'medical') {
      pet.health.medicalHistory.push(data);
    } else if (type === 'checkup') {
      pet.health.checkups.push(data);
    } else if (type === 'medication') {
      pet.health.medications.push(data);
    }

    await pet.save();

    res.json({
      success: true,
      data: pet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add reminder
// @route   POST /api/pets/:id/reminders
// @access  Private
exports.addReminder = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: '宠物未找到'
      });
    }

    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权修改此宠物信息'
      });
    }

    pet.reminders.push(req.body);
    await pet.save();

    res.json({
      success: true,
      data: pet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
