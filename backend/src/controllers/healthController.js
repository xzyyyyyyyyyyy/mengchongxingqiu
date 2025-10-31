const HealthLog = require('../models/HealthLog');
const Pet = require('../models/Pet');

// @desc    Get health logs for a pet
// @route   GET /api/health/:petId
// @access  Private
exports.getHealthLogs = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.petId);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: '宠物未找到'
      });
    }

    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权访问此宠物健康记录'
      });
    }

    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

    let query = { pet: req.params.petId };
    
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }

    const logs = await HealthLog.find(query).sort('-date');

    res.json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create health log
// @route   POST /api/health/:petId
// @access  Private
exports.createHealthLog = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.petId);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: '宠物未找到'
      });
    }

    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权为此宠物创建健康记录'
      });
    }

    req.body.pet = req.params.petId;

    // AI Analysis: Generate alerts based on data
    const alerts = await analyzeHealthData(req.body, pet);
    if (alerts.length > 0) {
      req.body.alerts = alerts;
    }

    const log = await HealthLog.create(req.body);

    res.status(201).json({
      success: true,
      data: log
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get health analytics
// @route   GET /api/health/:petId/analytics
// @access  Private
exports.getHealthAnalytics = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.petId);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: '宠物未找到'
      });
    }

    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权访问此宠物健康分析'
      });
    }

    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await HealthLog.find({
      pet: req.params.petId,
      date: { $gte: startDate }
    }).sort('date');

    // Calculate analytics
    const analytics = {
      weight: {
        current: logs.length > 0 ? logs[logs.length - 1].weight : null,
        trend: calculateTrend(logs.map(l => l.weight)),
        data: logs.map(l => ({ date: l.date, value: l.weight }))
      },
      water: {
        average: calculateAverage(logs.map(l => l.diet?.waterAmount)),
        trend: calculateTrend(logs.map(l => l.diet?.waterAmount)),
        data: logs.map(l => ({ date: l.date, value: l.diet?.waterAmount }))
      },
      food: {
        average: calculateAverage(logs.map(l => l.diet?.foodAmount)),
        trend: calculateTrend(logs.map(l => l.diet?.foodAmount)),
        data: logs.map(l => ({ date: l.date, value: l.diet?.foodAmount }))
      },
      energy: {
        average: logs.filter(l => l.energy?.level).length > 0 
          ? logs.filter(l => l.energy?.level).length / logs.length 
          : null,
        distribution: calculateEnergyDistribution(logs)
      },
      alerts: logs.flatMap(l => l.alerts || []).slice(0, 10)
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to analyze health data and generate alerts
async function analyzeHealthData(logData, pet) {
  const alerts = [];

  // Get recent logs for comparison
  const recentLogs = await HealthLog.find({ pet: pet._id })
    .sort('-date')
    .limit(7);

  // Water intake analysis
  if (logData.diet?.waterAmount && recentLogs.length > 0) {
    const avgWater = calculateAverage(recentLogs.map(l => l.diet?.waterAmount));
    if (avgWater && logData.diet.waterAmount < avgWater * 0.85) {
      alerts.push({
        type: 'warning',
        message: '饮水量低于平均水平',
        suggestion: '您的爱宠近期饮水量持续低于平均水平15%，建议关注'
      });
    }
  }

  // Bowel movement analysis
  if (logData.bowelMovement?.frequency === 0 && recentLogs.length > 0) {
    const lastLog = recentLogs[0];
    if (lastLog.bowelMovement?.frequency === 0) {
      alerts.push({
        type: 'attention',
        message: '连续两天未记录排便',
        suggestion: '建议密切观察，若持续请及时咨询兽医'
      });
    }
  }

  // Appetite analysis
  if (logData.diet?.appetite === 'poor' && logData.energy?.level === 'very-low') {
    alerts.push({
      type: 'critical',
      message: '食欲显著下降且精神萎靡',
      suggestion: '可能与天气、应激或健康问题有关，建议密切观察，若持续请及时咨询兽医'
    });
  }

  return alerts;
}

// Helper functions
function calculateAverage(values) {
  const validValues = values.filter(v => v != null && !isNaN(v));
  if (validValues.length === 0) return null;
  return validValues.reduce((a, b) => a + b, 0) / validValues.length;
}

function calculateTrend(values) {
  const validValues = values.filter(v => v != null && !isNaN(v));
  if (validValues.length < 2) return 'stable';
  
  const recent = validValues.slice(-3);
  const older = validValues.slice(0, 3);
  
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
  
  const diff = ((recentAvg - olderAvg) / olderAvg) * 100;
  
  if (diff > 5) return 'increasing';
  if (diff < -5) return 'decreasing';
  return 'stable';
}

function calculateEnergyDistribution(logs) {
  const distribution = {
    'very-low': 0,
    'low': 0,
    'normal': 0,
    'high': 0,
    'very-high': 0
  };

  logs.forEach(log => {
    if (log.energy?.level) {
      distribution[log.energy.level]++;
    }
  });

  return distribution;
}

module.exports = exports;
