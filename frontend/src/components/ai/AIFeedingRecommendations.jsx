import { useState, useEffect } from 'react';
import { aiService } from '../../api/aiService';

const AIFeedingRecommendations = ({ pet }) => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    if (pet) {
      loadRecommendations();
    }
  }, [pet]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      
      const petData = {
        petId: pet._id,
        age: pet.age || 3,
        weight: pet.weight || 10,
        breed: pet.breed || pet.species,
        activityLevel: pet.activityLevel || 'medium',
        healthIssues: pet.healthIssues || []
      };

      const result = await aiService.getFeedingRecommendation(petData);
      
      if (result.success) {
        setRecommendations(result.data);
      }
    } catch (error) {
      console.error('Failed to load feeding recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-500">AI正在分析最佳饮食方案...</p>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🍽️</div>
        <p className="text-gray-500">暂无喂养建议</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Daily Calories */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              每日推荐热量
            </h3>
            <p className="text-sm text-gray-600">
              基于 {pet.name} 的体重和活动量
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-primary">
              {recommendations.dailyCalories}
            </div>
            <div className="text-sm text-gray-600">大卡/天</div>
          </div>
        </div>
      </div>

      {/* Meal Plan */}
      <div>
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <span className="text-2xl mr-2">📋</span>
          AI个性化餐食方案
        </h3>

        <div className="space-y-4">
          {/* Breakfast */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">🌅</span>
              <div>
                <h4 className="font-bold text-gray-800">早餐</h4>
                <p className="text-sm text-gray-600">建议量: {recommendations.mealPlan.breakfast.amount}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {recommendations.mealPlan.breakfast.foods.map((food, idx) => (
                <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                  {food}
                </span>
              ))}
            </div>
          </div>

          {/* Lunch */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">☀️</span>
              <div>
                <h4 className="font-bold text-gray-800">午餐</h4>
                <p className="text-sm text-gray-600">建议量: {recommendations.mealPlan.lunch.amount}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {recommendations.mealPlan.lunch.foods.map((food, idx) => (
                <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  {food}
                </span>
              ))}
            </div>
          </div>

          {/* Dinner */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">🌙</span>
              <div>
                <h4 className="font-bold text-gray-800">晚餐</h4>
                <p className="text-sm text-gray-600">建议量: {recommendations.mealPlan.dinner.amount}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {recommendations.mealPlan.dinner.foods.map((food, idx) => (
                <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                  {food}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Supplements */}
      {recommendations.supplements && recommendations.supplements.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-bold text-blue-900 mb-3 flex items-center">
            <span className="mr-2">💊</span>
            推荐营养补充剂
          </h4>
          <div className="flex flex-wrap gap-2">
            {recommendations.supplements.map((supplement, idx) => (
              <span key={idx} className="px-3 py-1 bg-blue-200 text-blue-900 text-sm rounded-full">
                {supplement}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {recommendations.warnings && recommendations.warnings.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <div className="flex items-start">
            <span className="text-2xl mr-2">⚠️</span>
            <div>
              <h4 className="font-bold text-yellow-900 mb-2">注意事项</h4>
              <ul className="space-y-1">
                {recommendations.warnings.map((warning, idx) => (
                  <li key={idx} className="text-sm text-yellow-800">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center">
          <span className="mr-2">💡</span>
          喂养小贴士
        </h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>定时定量喂食，避免随意加餐</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>确保充足的清洁饮用水</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>根据季节和活动量适当调整</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>定期监测体重，保持健康体型</span>
          </li>
        </ul>
      </div>

      <div className="text-center">
        <button
          onClick={loadRecommendations}
          className="px-6 py-2 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          🔄 重新生成建议
        </button>
      </div>
    </div>
  );
};

export default AIFeedingRecommendations;
