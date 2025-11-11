import axios from './axios';

/**
 * AI Service for Pet Planet
 * Handles all AI-related functionality including health analysis, 
 * avatar generation, feeding recommendations, and image analysis
 */

// Mock AI responses for development/demo
// Can be replaced with real AI API calls
const mockAIResponses = {
  healthAnalysis: (petData) => ({
    insights: {
      overall: `${petData.pet?.name || '您的宠物'}整体健康状况良好，各项指标稳定。建议继续保持当前的饮食和运动习惯。`,
      trends: [
        {
          metric: '体重',
          trend: 'stable',
          prediction: '体重保持稳定，预计下周变化不超过±0.2kg'
        },
        {
          metric: '饮水量',
          trend: 'down',
          prediction: '饮水量略有下降，建议增加引导饮水'
        },
        {
          metric: '活动量',
          trend: 'up',
          prediction: '活动量呈上升趋势，健康指标良好'
        }
      ],
      alerts: petData.healthData?.waterIntake < 400 ? [
        {
          level: 'warning',
          title: '饮水量偏低',
          description: `当前日均饮水量为${petData.healthData?.waterIntake}ml，低于推荐值20%。长期饮水不足可能导致泌尿系统问题。`,
          suggestions: [
            '在多个位置放置水碗',
            '使用流动水饮水器',
            '在食物中增加水分',
            '定时提醒宠物饮水'
          ]
        }
      ] : [],
      recommendations: [
        '每日保持30分钟以上的户外活动',
        '定期检查口腔卫生，预防牙周病',
        '根据季节调整饮食量，冬季可适当增加10-15%',
        '每月进行一次体重监测，及时发现异常'
      ]
    },
    healthScore: Math.round(85 + Math.random() * 10) // 85-95分
  }),

  feedingRecommendation: (petData) => {
    const baseCalories = petData.weight * 30; // 简单计算
    const activityMultiplier = petData.activityLevel === 'high' ? 1.4 : 
                               petData.activityLevel === 'medium' ? 1.2 : 1.0;
    const dailyCalories = Math.round(baseCalories * activityMultiplier);

    return {
      dailyCalories,
      mealPlan: {
        breakfast: {
          amount: `${Math.round(dailyCalories * 0.3 / 4)}g`,
          foods: ['优质狗粮', '鸡胸肉', '南瓜泥']
        },
        lunch: {
          amount: `${Math.round(dailyCalories * 0.3 / 4)}g`,
          foods: ['狗粮', '胡萝卜', '鸡蛋']
        },
        dinner: {
          amount: `${Math.round(dailyCalories * 0.4 / 4)}g`,
          foods: ['狗粮', '牛肉', '西兰花', '糙米']
        }
      },
      supplements: ['复合维生素', 'Omega-3脂肪酸', '益生菌'],
      warnings: petData.healthIssues?.length > 0 ? [
        '注意：该宠物有特殊健康问题，建议咨询兽医后再调整饮食'
      ] : []
    };
  },

  breedRecognition: () => ({
    predictions: [
      { label: '金毛寻回犬', confidence: 0.92, description: '友善、聪明、忠诚的大型犬' },
      { label: '拉布拉多', confidence: 0.06, description: '温顺、活泼的伴侣犬' },
      { label: '黄色拉布拉多', confidence: 0.02, description: '性格温和的工作犬' }
    ],
    suggestions: [
      '该品种需要大量运动，建议每天至少1-2小时户外活动',
      '金毛易患髋关节发育不良，建议定期检查',
      '注意控制饮食，避免肥胖'
    ]
  }),

  avatarGeneration: (petData) => ({
    imageUrl: `/api/placeholder/avatar/${petData.petType}_${petData.breed}_${petData.style}.png`,
    taskId: `avatar_${Date.now()}`,
    status: 'completed',
    message: '头像生成成功！'
  })
};

export const aiService = {
  /**
   * Analyze pet health data and provide insights
   * @param {string} petId - Pet ID
   * @param {Object} healthData - Current health metrics
   * @param {Array} historicalData - Historical health logs
   */
  analyzeHealth: async (petId, pet, healthData, historicalData = []) => {
    try {
      // In production, replace with real AI API call:
      // const response = await axios.post('/ai/health/analyze', {
      //   petId, healthData, historicalData
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock data for now
      const result = mockAIResponses.healthAnalysis({ pet, healthData, historicalData });
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('AI health analysis failed:', error);
      return {
        success: false,
        message: 'AI分析暂时不可用，请稍后再试'
      };
    }
  },

  /**
   * Generate AI avatar for pet
   * @param {Object} petData - Pet information
   */
  generateAvatar: async (petData) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = mockAIResponses.avatarGeneration(petData);
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('AI avatar generation failed:', error);
      return {
        success: false,
        message: '头像生成失败，请稍后再试'
      };
    }
  },

  /**
   * Check avatar generation status (for async operations)
   * @param {string} taskId - Task ID
   */
  checkAvatarStatus: async (taskId) => {
    try {
      // In production: await axios.get(`/ai/avatar/status/${taskId}`);
      
      return {
        success: true,
        data: {
          status: 'completed',
          imageUrl: `/api/placeholder/avatar/${taskId}.png`
        }
      };
    } catch (error) {
      return {
        success: false,
        message: '无法查询生成状态'
      };
    }
  },

  /**
   * Get AI-powered feeding recommendations
   * @param {Object} petData - Pet characteristics
   */
  getFeedingRecommendation: async (petData) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const result = mockAIResponses.feedingRecommendation(petData);
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('AI feeding recommendation failed:', error);
      return {
        success: false,
        message: '获取喂养建议失败'
      };
    }
  },

  /**
   * Analyze image to identify breed, health, or emotion
   * @param {File} image - Image file
   * @param {string} analysisType - 'breed', 'health', or 'emotion'
   */
  analyzeImage: async (image, analysisType = 'breed') => {
    try {
      // In production, send image to AI API:
      // const formData = new FormData();
      // formData.append('image', image);
      // formData.append('analysisType', analysisType);
      // const response = await axios.post('/ai/image/analyze', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = mockAIResponses.breedRecognition();
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('AI image analysis failed:', error);
      return {
        success: false,
        message: '图片分析失败'
      };
    }
  }
};

export default aiService;
