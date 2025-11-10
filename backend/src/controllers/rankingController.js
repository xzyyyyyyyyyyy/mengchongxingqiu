const PetRanking = require('../models/PetRanking');
const Pet = require('../models/Pet');
const PointsTransaction = require('../models/PointsTransaction');
const User = require('../models/User');

// Get rankings by category
exports.getRankings = async (req, res) => {
  try {
    const { category = 'cute', limit = 20 } = req.query;
    
    // Get current week start
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    weekStart.setHours(0, 0, 0, 0);
    
    const rankings = await PetRanking.find({ category, weekStart })
      .sort({ votes: -1 })
      .limit(parseInt(limit))
      .populate({
        path: 'pet',
        populate: { path: 'owner', select: 'username avatar' }
      });
    
    res.json({
      success: true,
      data: rankings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Vote for a pet
exports.voteForPet = async (req, res) => {
  try {
    const { petId, category } = req.body;
    const userId = req.user.id;
    
    // Get current week start
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    weekStart.setHours(0, 0, 0, 0);
    
    // Check if user already voted for this pet this week
    let ranking = await PetRanking.findOne({
      pet: petId,
      category,
      weekStart
    });
    
    if (!ranking) {
      // Create new ranking entry
      ranking = await PetRanking.create({
        pet: petId,
        category,
        weekStart,
        votes: 1,
        voters: [{ user: userId }]
      });
    } else {
      // Check if user already voted
      const hasVoted = ranking.voters.some(v => v.user.toString() === userId);
      
      if (hasVoted) {
        return res.status(400).json({
          success: false,
          message: '您今天已经为这只宠物投过票了'
        });
      }
      
      // Add vote
      ranking.votes += 1;
      ranking.voters.push({ user: userId });
      await ranking.save();
    }
    
    // Award points to pet owner if they reach top 3
    const topRankings = await PetRanking.find({ category, weekStart })
      .sort({ votes: -1 })
      .limit(3)
      .populate('pet');
    
    const petRank = topRankings.findIndex(r => r.pet._id.toString() === petId);
    if (petRank !== -1 && petRank < 3) {
      const pet = await Pet.findById(petId);
      const pointsAmount = petRank === 0 ? 500 : petRank === 1 ? 300 : 200;
      
      await PointsTransaction.create({
        user: pet.owner,
        amount: pointsAmount,
        type: 'earn',
        source: 'ranking',
        description: `宠物进入${category}榜前三名`,
        relatedId: petId
      });
      
      await User.findByIdAndUpdate(pet.owner, { $inc: { points: pointsAmount } });
    }
    
    res.json({
      success: true,
      data: ranking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all categories rankings summary
exports.getAllRankings = async (req, res) => {
  try {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    weekStart.setHours(0, 0, 0, 0);
    
    const categories = ['cute', 'wellBehaved', 'active', 'smart'];
    const results = {};
    
    for (const category of categories) {
      const rankings = await PetRanking.find({ category, weekStart })
        .sort({ votes: -1 })
        .limit(10)
        .populate({
          path: 'pet',
          populate: { path: 'owner', select: 'username avatar' }
        });
      results[category] = rankings;
    }
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
